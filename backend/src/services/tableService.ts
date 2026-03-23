/**
 * Table Service
 *
 * Provides paginated, sortable tabular data (top items ranking, etc.).
 */

import { config } from "../config";
import { PowerBiClient } from "../clients/powerBiClient";
import { TableResponse, ActiveFilters } from "../types";
import { mockTopItemsTable } from "../mocks/data";

interface TableQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  period?: string;
  category?: string | string[];
  region?: string | string[];
}

export class TableService {
  private readonly pbi?: PowerBiClient;

  constructor() {
    if (!config.data.useMock) {
      this.pbi = new PowerBiClient(config.powerBi);
    }
  }

  async getTopItems(query: TableQuery = {}): Promise<TableResponse> {
    if (config.data.useMock) {
      await delay(200);
      return paginateMock(mockTopItemsTable, query);
    }

    return this.fetchFromPowerBi(query);
  }

  /**
   * Fetches top product rows from Power BI.
   *
   * ─── WHERE TO ADAPT ───────────────────────────────────────────────────────
   *   Replace table/column references with your semantic model names.
   *   Power BI DAX doesn't natively support server-side pagination;
   *   the TOPN approach limits results at query level.
   * ─────────────────────────────────────────────────────────────────────────
   */
  private async fetchFromPowerBi(query: TableQuery): Promise<TableResponse> {
    const topN = (query.page ?? 1) * (query.pageSize ?? 10);

    const dax = `
      EVALUATE
      TOPN(
        ${topN},
        SUMMARIZECOLUMNS(
          'Dim Product'[Product Name],
          'Dim Category'[Category Name],
          "revenue",   [Total Revenue],
          "orders",    [Total Orders],
          "avgTicket", [Average Order Value],
          "growth",    [Revenue Growth %]
        ),
        [revenue],
        DESC
      )
      ORDER BY [revenue] DESC
    `;

    const rows = await this.pbi!.executeDax(dax);

    // Apply client-side slice for the requested page
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const slice = rows.slice(start, start + pageSize);

    const data = slice.map((r, i) => ({
      id: String(start + i + 1),
      rank: start + i + 1,
      product: String(r["Dim Product[Product Name]"] ?? ""),
      category: String(r["Dim Category[Category Name]"] ?? ""),
      revenue: num(r["[revenue]"]),
      orders: num(r["[orders]"]),
      avgTicket: num(r["[avgTicket]"]),
      growth: num(r["[growth]"]),
    }));

    return {
      ...mockTopItemsTable,
      data,
      total: rows.length,
      page,
      pageSize,
      totalPages: Math.ceil(rows.length / pageSize),
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function paginateMock(base: TableResponse, query: TableQuery): TableResponse {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const data = base.data.slice(start, start + pageSize);

  return {
    ...base,
    data,
    page,
    pageSize,
    totalPages: Math.ceil(base.total / pageSize),
    lastUpdated: new Date().toISOString(),
  };
}

function num(v: unknown): number {
  return typeof v === "number" ? v : parseFloat(String(v ?? 0)) || 0;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
