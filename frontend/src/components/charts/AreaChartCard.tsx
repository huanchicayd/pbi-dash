import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, relativeTime } from "@/lib/utils";
import type { ChartResponse } from "@/types";

const DEFAULT_COLORS = ["#2563eb", "#94a3b8", "#16a34a", "#ea580c"];

interface AreaChartCardProps {
  data?: ChartResponse;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  formatY?: (value: number) => string;
}

export function AreaChartCard({
  data,
  isLoading,
  isError,
  error,
  onRetry,
  formatY = (v) => formatCurrency(v),
}: AreaChartCardProps) {
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
          <AreaChart data={data.data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {data.series.map((s, i) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color ?? DEFAULT_COLORS[i]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={s.color ?? DEFAULT_COLORS[i]} stopOpacity={0.01} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
            <Legend
              formatter={(value) => data.series.find((s) => s.key === value)?.label ?? value}
              wrapperStyle={{ fontSize: "12px" }}
            />
            {data.series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color ?? DEFAULT_COLORS[i]}
                fill={`url(#grad-${s.key})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
