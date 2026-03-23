// Mirror of backend types — kept in sync manually.
// In a monorepo setup, these would be shared from a /packages/types workspace.

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
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
  category?: string[];
  region?: string[];
  startDate?: string;
  endDate?: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  refreshId?: string;
}
