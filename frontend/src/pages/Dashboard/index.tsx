import { useState } from "react";
import {
  ShoppingCart, DollarSign, Users, TrendingUp, Target,
  BarChart3,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AreaChartCard } from "@/components/charts/AreaChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { DataTableCard } from "@/components/shared/DataTableCard";
import { KpiCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useKpis } from "@/hooks/useKpis";
import { useRevenueChart, useCategoryChart } from "@/hooks/useCharts";
import type { ActiveFilters, KpiMetric } from "@/types";
import type { LucideIcon } from "lucide-react";

const KPI_ICONS: Record<string, LucideIcon> = {
  total_revenue: DollarSign,
  orders: ShoppingCart,
  avg_ticket: Target,
  conversion: TrendingUp,
  active_customers: Users,
  nps: BarChart3,
};

export function DashboardPage() {
  const [filters, setFilters] = useState<ActiveFilters>({});

  const kpisQuery = useKpis(filters);
  const revenueQuery = useRevenueChart(filters);
  const categoryQuery = useCategoryChart(filters);

  return (
    <div className="flex flex-col gap-6 animate-in">
      {/* Filter bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Indicadores
        </h2>
        {kpisQuery.isError ? (
          <ErrorState
            message={(kpisQuery.error as Error).message}
            onRetry={() => kpisQuery.refetch()}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {kpisQuery.isLoading
              ? Array.from({ length: 6 }).map((_, i) => <KpiCardSkeleton key={i} />)
              : kpisQuery.data?.data?.map((metric: KpiMetric) => (
                  <KpiCard
                    key={metric.id}
                    metric={metric}
                    icon={KPI_ICONS[metric.id]}
                  />
                ))}
          </div>
        )}
      </section>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AreaChartCard
          data={revenueQuery.data}
          isLoading={revenueQuery.isLoading}
          isError={revenueQuery.isError}
          error={revenueQuery.error as Error}
          onRetry={() => revenueQuery.refetch()}
        />
        <BarChartCard
          data={categoryQuery.data}
          isLoading={categoryQuery.isLoading}
          isError={categoryQuery.isError}
          error={categoryQuery.error as Error}
          onRetry={() => categoryQuery.refetch()}
          layout="horizontal"
        />
      </div>

      {/* Table */}
      <DataTableCard filters={filters} />
    </div>
  );
}
