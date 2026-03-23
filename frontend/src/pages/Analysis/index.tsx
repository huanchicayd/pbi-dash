import { useState } from "react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AreaChartCard } from "@/components/charts/AreaChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { DonutChartCard } from "@/components/charts/DonutChartCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRevenueChart, useCategoryChart } from "@/hooks/useCharts";
import type { ActiveFilters } from "@/types";

export function AnalysisPage() {
  const [filters, setFilters] = useState<ActiveFilters>({});

  const revenueQuery = useRevenueChart(filters);
  const categoryQuery = useCategoryChart(filters);

  return (
    <div className="flex flex-col gap-6 animate-in">
      <FilterBar filters={filters} onChange={setFilters} />

      <Tabs defaultValue="temporal">
        <TabsList>
          <TabsTrigger value="temporal">Série Temporal</TabsTrigger>
          <TabsTrigger value="categoria">Por Categoria</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
        </TabsList>

        <TabsContent value="temporal">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <AreaChartCard
              data={revenueQuery.data}
              isLoading={revenueQuery.isLoading}
              isError={revenueQuery.isError}
              error={revenueQuery.error as Error}
              onRetry={() => revenueQuery.refetch()}
            />
            <LineChartCard
              data={revenueQuery.data}
              isLoading={revenueQuery.isLoading}
              isError={revenueQuery.isError}
              error={revenueQuery.error as Error}
              onRetry={() => revenueQuery.refetch()}
            />
          </div>
        </TabsContent>

        <TabsContent value="categoria">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <BarChartCard
              data={categoryQuery.data}
              isLoading={categoryQuery.isLoading}
              isError={categoryQuery.isError}
              error={categoryQuery.error as Error}
              onRetry={() => categoryQuery.refetch()}
              layout="vertical"
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
        </TabsContent>

        <TabsContent value="distribuicao">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <DonutChartCard
              data={categoryQuery.data}
              isLoading={categoryQuery.isLoading}
              isError={categoryQuery.isError}
              error={categoryQuery.error as Error}
              onRetry={() => categoryQuery.refetch()}
              dataKey="revenue"
            />
            <DonutChartCard
              data={categoryQuery.data}
              isLoading={categoryQuery.isLoading}
              isError={categoryQuery.isError}
              error={categoryQuery.error as Error}
              onRetry={() => categoryQuery.refetch()}
              dataKey="target"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
