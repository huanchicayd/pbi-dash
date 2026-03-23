/**
 * Filter Service
 *
 * Returns available filter options for the dashboard.
 * In a real Power BI integration, these are fetched from dimension tables.
 */

import { config } from "../config";
import { PowerBiClient } from "../clients/powerBiClient";
import { FiltersResponse, FilterDefinition } from "../types";
import { mockFilters } from "../mocks/data";

export class FilterService {
  private readonly pbi?: PowerBiClient;

  constructor() {
    if (!config.data.useMock) {
      this.pbi = new PowerBiClient(config.powerBi);
    }
  }

  async getFilters(): Promise<FiltersResponse> {
    if (config.data.useMock) {
      await delay(80);
      return { ...mockFilters, lastUpdated: new Date().toISOString() };
    }

    return this.fetchFromPowerBi();
  }

  /**
   * Fetches distinct filter values from dimension tables in Power BI.
   *
   * ─── WHERE TO ADAPT ───────────────────────────────────────────────────────
   *   One DAX query per dimension. Replace table/column names with yours.
   * ─────────────────────────────────────────────────────────────────────────
   */
  private async fetchFromPowerBi(): Promise<FiltersResponse> {
    const [categoryRows, regionRows, periodRows] = await Promise.all([
      this.pbi!.executeDax(`
        EVALUATE
        DISTINCT('Dim Category'[Category Name])
        ORDER BY 'Dim Category'[Category Name] ASC
      `),
      this.pbi!.executeDax(`
        EVALUATE
        DISTINCT('Dim Region'[Region Name])
        ORDER BY 'Dim Region'[Region Name] ASC
      `),
      this.pbi!.executeDax(`
        EVALUATE
        VALUES('Dim Date'[Quarter Year])
        ORDER BY 'Dim Date'[Quarter Year] DESC
      `),
    ]);

    const filters: FilterDefinition[] = [
      {
        id: "period",
        label: "Período",
        type: "select",
        options: periodRows.map((r) => {
          const v = String(r["Dim Date[Quarter Year]"] ?? "");
          return { value: v, label: v };
        }),
      },
      {
        id: "category",
        label: "Categoria",
        type: "multiselect",
        options: categoryRows.map((r) => {
          const v = String(r["Dim Category[Category Name]"] ?? "");
          return { value: v, label: v };
        }),
      },
      {
        id: "region",
        label: "Região",
        type: "multiselect",
        options: regionRows.map((r) => {
          const v = String(r["Dim Region[Region Name]"] ?? "");
          return { value: v, label: v };
        }),
      },
    ];

    return { filters, lastUpdated: new Date().toISOString() };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
