/**
 * API service layer.
 *
 * All requests go through this module. In development, the Vite proxy
 * forwards /api → http://localhost:3001. In production, set VITE_API_BASE_URL.
 * When VITE_USE_MOCK=true, returns local mock data (used for GitHub Pages).
 */

import axios from "axios";
import type {
  KpiResponse,
  ChartResponse,
  TableResponse,
  FiltersResponse,
  ActiveFilters,
  RefreshResponse,
} from "@/types";
import {
  mockKpis,
  mockRevenueChart,
  mockCategoryChart,
  mockTopItemsTable,
  mockFilters,
} from "@/mocks/data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Interceptors ────────────────────────────────────────────────────────────

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.message ??
      err.message ??
      "Erro de comunicação com o servidor";
    return Promise.reject(new Error(message));
  }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toParams(filters: ActiveFilters = {}): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.period) params.period = filters.period;
  if (filters.category?.length) params.category = filters.category.join(",");
  if (filters.region?.length) params.region = filters.region.join(",");
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return params;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const api = {
  health: async () => {
    if (USE_MOCK) { await delay(); return { status: "ok", dataSource: "mock" }; }
    return http.get<{ status: string; dataSource: string }>("/api/health").then((r) => r.data);
  },

  kpis: async (filters?: ActiveFilters): Promise<KpiResponse> => {
    if (USE_MOCK) { await delay(); return mockKpis; }
    return http.get<KpiResponse>("/api/kpis", { params: toParams(filters) }).then((r) => r.data);
  },

  charts: {
    revenue: async (filters?: ActiveFilters): Promise<ChartResponse> => {
      if (USE_MOCK) { await delay(); return mockRevenueChart; }
      return http
        .get<ChartResponse>("/api/charts/revenue", { params: toParams(filters) })
        .then((r) => r.data);
    },

    category: async (filters?: ActiveFilters): Promise<ChartResponse> => {
      if (USE_MOCK) { await delay(); return mockCategoryChart; }
      return http
        .get<ChartResponse>("/api/charts/category", { params: toParams(filters) })
        .then((r) => r.data);
    },
  },

  table: {
    topItems: async (params: { page?: number; pageSize?: number; filters?: ActiveFilters }): Promise<TableResponse> => {
      if (USE_MOCK) { await delay(); return mockTopItemsTable; }
      return http
        .get<TableResponse>("/api/table/top-items", {
          params: {
            ...toParams(params.filters),
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 10,
          },
        })
        .then((r) => r.data);
    },
  },

  filters: async (): Promise<FiltersResponse> => {
    if (USE_MOCK) { await delay(); return mockFilters; }
    return http.get<FiltersResponse>("/api/filters").then((r) => r.data);
  },

  refresh: async (): Promise<RefreshResponse> => {
    if (USE_MOCK) { await delay(800); return { success: true, message: "Dados atualizados (mock)" }; }
    return http.post<RefreshResponse>("/api/refresh").then((r) => r.data);
  },
};
