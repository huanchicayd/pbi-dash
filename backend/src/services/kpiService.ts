/**
 * KPI Service
 *
 * Responsible for fetching KPI metrics.
 * Currently returns mock data. To connect Power BI, replace the mock block
 * with real DAX queries via PowerBiClient.executeDax().
 *
 * DAX example for this service:
 *
 *   EVALUATE
 *   ROW(
 *     "TotalRevenue", [Total Revenue],
 *     "TotalOrders", [Total Orders],
 *     "AvgTicket", [Average Order Value],
 *     "Conversion", [Conversion Rate],
 *     "ActiveCustomers", [Active Customers]
 *   )
 */

import { config } from "../config";
import { PowerBiClient } from "../clients/powerBiClient";
import { KpiResponse, KpiMetric, ActiveFilters } from "../types";
import { mockKpis } from "../mocks/data";

export class KpiService {
  private readonly pbi?: PowerBiClient;

  constructor() {
    if (!config.data.useMock) {
      this.pbi = new PowerBiClient(config.powerBi);
    }
  }

  async getKpis(filters: ActiveFilters = {}): Promise<KpiResponse> {
    if (config.data.useMock) {
      // Simulate network delay in development
      await delay(120);
      return { ...mockKpis, lastUpdated: new Date().toISOString() };
    }

    return this.fetchFromPowerBi(filters);
  }

  /**
   * Real Power BI implementation.
   *
   * Adapt the DAX query below to match your own semantic model.
   * Column names must match what your model exposes.
   *
   * ─────────────────────────────────────────────────────────────────────────
   * WHERE TO ADAPT:
   *   1. Replace table/column names in the DAX with your actual model names
   *   2. Map the raw row output to KpiMetric[] in mapRowsToKpis()
   *   3. Add more measures as needed
   * ─────────────────────────────────────────────────────────────────────────
   */
  private async fetchFromPowerBi(filters: ActiveFilters): Promise<KpiResponse> {
    const dax = buildKpiDax(filters);
    const rows = await this.pbi!.executeDax(dax);
    const data = mapRowsToKpis(rows);

    return {
      data,
      period: filters.period ?? "current",
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ─── DAX builder ─────────────────────────────────────────────────────────────

function buildKpiDax(_filters: ActiveFilters): string {
  // TODO: apply filter context using CALCULATETABLE / FILTER based on _filters
  return `
    EVALUATE
    ROW(
      "TotalRevenue",      [Total Revenue],
      "PrevRevenue",       [Total Revenue PY],
      "TotalOrders",       [Total Orders],
      "PrevOrders",        [Total Orders PY],
      "AvgTicket",         [Average Order Value],
      "PrevAvgTicket",     [Average Order Value PY],
      "ConversionRate",    [Conversion Rate],
      "PrevConversion",    [Conversion Rate PY],
      "ActiveCustomers",   [Active Customers],
      "PrevCustomers",     [Active Customers PY]
    )
  `;
}

// ─── Row mapper ──────────────────────────────────────────────────────────────

function mapRowsToKpis(rows: Array<Record<string, unknown>>): KpiMetric[] {
  if (rows.length === 0) return [];

  const r = rows[0];
  const pctChange = (current: number, prev: number) =>
    prev === 0 ? 0 : Math.round(((current - prev) / prev) * 10000) / 100;

  const revenue = num(r["[TotalRevenue]"]);
  const prevRevenue = num(r["[PrevRevenue]"]);

  const orders = num(r["[TotalOrders]"]);
  const prevOrders = num(r["[PrevOrders]"]);

  const avgTicket = num(r["[AvgTicket]"]);
  const prevAvgTicket = num(r["[PrevAvgTicket]"]);

  const conversion = num(r["[ConversionRate]"]);
  const prevConversion = num(r["[PrevConversion]"]);

  const customers = num(r["[ActiveCustomers]"]);
  const prevCustomers = num(r["[PrevCustomers]"]);

  return [
    kpi("total_revenue", "Receita Total", revenue, prevRevenue, "currency"),
    kpi("orders", "Pedidos", orders, prevOrders, "number"),
    kpi("avg_ticket", "Ticket Médio", avgTicket, prevAvgTicket, "currency"),
    kpi("conversion", "Conversão", conversion, prevConversion, "percentage"),
    kpi("active_customers", "Clientes Ativos", customers, prevCustomers, "number"),
  ];

  function kpi(
    id: string,
    label: string,
    value: number,
    prev: number,
    format: KpiMetric["format"]
  ): KpiMetric {
    const change = pctChange(value, prev);
    return {
      id,
      label,
      value,
      previousValue: prev,
      change,
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      format,
    };
  }
}

function num(v: unknown): number {
  return typeof v === "number" ? v : parseFloat(String(v ?? 0)) || 0;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
