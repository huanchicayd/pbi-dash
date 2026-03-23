import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/utils";
import type { ChartResponse } from "@/types";

const COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c",
  "#16a34a", "#0891b2", "#ca8a04", "#9333ea",
];

interface DonutChartCardProps {
  data?: ChartResponse;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  dataKey?: string;
  formatValue?: (value: number) => string;
}

export function DonutChartCard({
  data,
  isLoading,
  isError,
  error,
  onRetry,
  dataKey = "revenue",
  formatValue = (v) => formatCurrency(v),
}: DonutChartCardProps) {
  if (isLoading) return <ChartCardSkeleton />;
  if (isError) return <ErrorState message={error?.message} onRetry={onRetry} />;
  if (!data || data.data.length === 0) return <EmptyState />;

  const pieData = data.data.map((d) => ({
    name: d.period,
    value: Number(d[dataKey]),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [formatValue(value), ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
