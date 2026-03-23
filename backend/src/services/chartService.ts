/**
 * Chart Service
 *
 * Provides time-series and categorical chart data.
 *
 * DAX patterns used:
 *   - Revenue over time: SUMMARIZECOLUMNS on date dimension
 *   - Category breakdown: SUMMARIZECOLUMNS on category dimension
 */

import { config } from "../config";
import { PowerBiClient } from "../clients/powerBiClient";
import { ChartResponse, ActiveFilters } from "../types";
import { mockRevenueChart, mockCategoryChart } from "../mocks/data";

export class ChartService {
  private readonly pbi?: PowerBiClient;

  constructor() {
    if (!config.data.useMock) {
      this.pbi = new PowerBiClient(config.powerBi);
    }
  }

  async getRevenueChart(filters: ActiveFilters = {}): Promise<ChartResponse> {
    if (config.data.useMock) {
      await delay(150);
      return { ...mockRevenueChart, lastUpdated: new Date().toISOString() };
    }

    return this.fetchRevenuFromPowerBi(filters);
  }

  async getCategoryChart(filters: ActiveFilters = {}): Promise<ChartResponse> {
    if (config.data.useMock) {
      await delay(150);
      return { ...mockCategoryChart, lastUpdated: new Date().toISOString() };
    }

    return this.fetchCategoryFromPowerBi(filters);
  }

  // ─── Power BI implementations ─────────────────────────────────────────────

  /**
   * Fetches monthly revenue for current vs. previous year.
   *
   * ─── WHERE TO ADAPT ───────────────────────────────────────────────────────
   *   Replace 'Dim Date'[Month Short] and [Total Revenue] / [Total Revenue PY]
   *   with the actual names from your semantic model.
   * ─────────────────────────────────────────────────────────────────────────
   */
  private async fetchRevenuFromPowerBi(filters: ActiveFilters): Promise<ChartResponse> {
    const dax = `
      EVALUATE
      SUMMARIZECOLUMNS(
        'Dim Date'[Month Short],
        'Dim Date'[Month Number],
        "current",  [Total Revenue],
        "previous", [Total Revenue PY]
      )
      ORDER BY 'Dim Date'[Month Number] ASC
    `;

    const rows = await this.pbi!.executeDax(dax);

    const data = rows.map((r) => ({
      period: String(r["Dim Date[Month Short]"] ?? ""),
      current: num(r["[current]"]),
      previous: num(r["[previous]"]),
    }));

    return {
      title: "Receita ao Longo do Tempo",
      description: "Comparativo de receita mensal — ano atual vs. ano anterior",
      period: filters.period ?? "current",
      lastUpdated: new Date().toISOString(),
      series: [
        { key: "current", label: "Atual", color: "#2563eb" },
        { key: "previous", label: "Anterior", color: "#94a3b8" },
      ],
      data,
    };
  }

  /**
   * Fetches revenue and target by product category.
   *
   * ─── WHERE TO ADAPT ───────────────────────────────────────────────────────
   *   Replace 'Dim Category'[Category Name] and [Total Revenue] / [Revenue Target]
   *   with the actual names from your semantic model.
   * ─────────────────────────────────────────────────────────────────────────
   */
  private async fetchCategoryFromPowerBi(filters: ActiveFilters): Promise<ChartResponse> {
    const dax = `
      EVALUATE
      SUMMARIZECOLUMNS(
        'Dim Category'[Category Name],
        "revenue", [Total Revenue],
        "target",  [Revenue Target]
      )
      ORDER BY [revenue] DESC
    `;

    const rows = await this.pbi!.executeDax(dax);

    const data = rows.map((r) => ({
      period: String(r["Dim Category[Category Name]"] ?? ""),
      revenue: num(r["[revenue]"]),
      target: num(r["[target]"]),
    }));

    return {
      title: "Receita por Categoria",
      description: "Performance vs. meta por linha de produto",
      period: filters.period ?? "current",
      lastUpdated: new Date().toISOString(),
      series: [
        { key: "revenue", label: "Receita", color: "#2563eb" },
        { key: "target", label: "Meta", color: "#e2e8f0" },
      ],
      data,
    };
  }
}

function num(v: unknown): number {
  return typeof v === "number" ? v : parseFloat(String(v ?? 0)) || 0;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
