import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, relativeTime } from "@/lib/utils";
import type { ChartResponse } from "@/types";

const DEFAULT_COLORS = ["#2563eb", "#e2e8f0", "#16a34a", "#ea580c"];

interface BarChartCardProps {
  data?: ChartResponse;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  formatY?: (value: number) => string;
  layout?: "vertical" | "horizontal";
}


export function BarChartCard({
  data,
  isLoading,
  isError,
  error,
  onRetry,
  formatY = (v) => formatCurrency(v),
  layout = "horizontal",
}: BarChartCardProps) {
  if (isLoading) return <ChartCardSkeleton />;
  if (isError) return <ErrorState message={error?.message} onRetry={onRetry} />;
  if (!data || data.data.length === 0) return <EmptyState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
        <p className="text-xs text-muted-foreground">
          Atualizado {relativeTime(data.lastUpdated)}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data.data}
            layout={layout}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={layout === "horizontal" ? false : true}
              horizontal={layout === "horizontal" ? true : false}
            />
            {layout === "horizontal" ? (
              <>
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatY}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  tickFormatter={formatY}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="period"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => {
                const label = data.series.find((s) => s.key === name)?.label ?? name;
                return [formatY(value), label];
              }}
            />
            {data.series.length > 1 && (
              <Legend
                formatter={(value) => data.series.find((s) => s.key === value)?.label ?? value}
                wrapperStyle={{ fontSize: "12px" }}
              />
            )}
            {data.series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={s.color ?? DEFAULT_COLORS[i]}
                radius={layout === "horizontal" ? [3, 3, 0, 0] : [0, 3, 3, 0]}
              >
                {data.series.length === 1 &&
                  data.data.map((_entry, idx) => (
                    <Cell
                      key={idx}
                      fill={`hsl(221 83% ${Math.max(35, 65 - idx * 4)}%)`}
                    />
                  ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
