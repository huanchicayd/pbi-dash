import { useState } from "react";
import {
  DollarSign, ShoppingCart, Target, TrendingUp, Users, BarChart3,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useKpis } from "@/hooks/useKpis";
import type { ActiveFilters, KpiMetric } from "@/types";
import type { LucideIcon } from "lucide-react";
import { relativeTime } from "@/lib/utils";

const KPI_ICONS: Record<string, LucideIcon> = {
  total_revenue: DollarSign,
  orders: ShoppingCart,
  avg_ticket: Target,
  conversion: TrendingUp,
  active_customers: Users,
  nps: BarChart3,
};

export function KPIsPage() {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const { data, isLoading, isError, error, refetch } = useKpis(filters);

  return (
    <div className="flex flex-col gap-6 animate-in">
      <FilterBar filters={filters} onChange={setFilters} />

      {isError ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Todos os indicadores
              </h2>
              {data?.lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Atualizado {relativeTime(data.lastUpdated)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <KpiCardSkeleton key={i} />)
                : data?.data?.map((metric: KpiMetric) => (
                    <KpiCard
                      key={metric.id}
                      metric={metric}
                      icon={KPI_ICONS[metric.id]}
                    />
                  ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
