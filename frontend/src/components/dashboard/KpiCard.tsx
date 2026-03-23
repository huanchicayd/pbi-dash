import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatValue, formatChange } from "@/lib/utils";
import type { KpiMetric } from "@/types";

interface KpiCardProps {
  metric: KpiMetric;
  icon?: LucideIcon;
}

export function KpiCard({ metric, icon: Icon }: KpiCardProps) {
  const TrendIcon =
    metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;

  const trendColor =
    metric.trend === "up"
      ? "text-success"
      : metric.trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <Card className="animate-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Icon className="size-4 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold tabular-nums tracking-tight">
          {formatValue(metric.value, metric.format)}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <TrendIcon className={cn("size-3.5", trendColor)} />
          <span className={cn("text-xs font-medium tabular-nums", trendColor)}>
            {formatChange(metric.change)}
          </span>
          <span className="text-xs text-muted-foreground">vs. período anterior</span>
        </div>

        {metric.description && (
          <p className="mt-1.5 text-xs text-muted-foreground">{metric.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
