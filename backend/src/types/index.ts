// ─── KPI ────────────────────────────────────────────────────────────────────

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  /** Percentage change from previous period. Positive = growth. */
  change: number;
  trend: "up" | "down" | "neutral";
  format: "currency" | "number" | "percentage";
  description?: string;
  unit?: string;
}

export interface KpiResponse {
  data: KpiMetric[];
  period: string;
  lastUpdated: string;
}

// ─── Charts ─────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  period: string;
  [key: string]: number | string;
}

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

export interface ChartResponse {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  series: ChartSeries[];
  period: string;
  lastUpdated: string;
}

// ─── Table ──────────────────────────────────────────────────────────────────

export interface TableColumn {
  key: string;
  label: string;
  format?: "currency" | "number" | "percentage" | "text" | "date";
  align?: "left" | "right" | "center";
  sortable?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

export interface TableResponse {
  title: string;
  columns: TableColumn[];
  data: TableRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  lastUpdated: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: "select" | "multiselect" | "date-range";
  options?: FilterOption[];
}

export interface FiltersResponse {
  filters: FilterDefinition[];
  lastUpdated: string;
}

export interface ActiveFilters {
  period?: string;
  category?: string | string[];
  region?: string | string[];
  startDate?: string;
  endDate?: string;
  [key: string]: string | string[] | undefined;
}

// ─── Power BI Integration ────────────────────────────────────────────────────

export interface PowerBiConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  workspaceId: string;
  datasetId: string;
}

export interface DaxQueryRequest {
  queries: Array<{ query: string }>;
  serializerSettings?: { includeNulls?: boolean };
}

export interface DaxQueryResponse {
  results: Array<{
    tables: Array<{
      rows: Array<Record<string, unknown>>;
    }>;
  }>;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: unknown;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  refreshId?: string;
}
