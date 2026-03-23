import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCardSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { formatValue, relativeTime } from "@/lib/utils";
import type { ActiveFilters } from "@/types";
import { useTopItems } from "@/hooks/useTable";
import { cn } from "@/lib/utils";

interface DataTableCardProps {
  filters?: ActiveFilters;
}

export function DataTableCard({ filters }: DataTableCardProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useTopItems({
    page,
    pageSize,
    filters,
  });

  if (isLoading) return <TableCardSkeleton />;
  if (isError) return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
  if (!data) return null;

  return (
    <Card className={cn("transition-opacity", isFetching && "opacity-70")}>
      <CardHeader className="flex-row items-center justify-between pb-0">
        <div>
          <CardTitle>{data.title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {data.total} registros • atualizado {relativeTime(data.lastUpdated)}
          </p>
        </div>
        <Badge variant="outline">{data.total} itens</Badge>
      </CardHeader>

      <CardContent className="p-0 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {data.columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "h-10 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end")}>
                      {col.label}
                      {col.sortable && <ArrowUpDown className="size-3 opacity-40" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row) => (
                <tr key={row.id} className="border-b border-border/60 hover:bg-muted/20 transition-colors">
                  {data.columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "h-12 px-4 whitespace-nowrap",
                        col.align === "right" && "text-right tabular-nums",
                        col.align === "center" && "text-center",
                        col.key === "growth" && Number(row[col.key]) < 0
                          ? "text-destructive"
                          : col.key === "growth"
                          ? "text-success"
                          : ""
                      )}
                    >
                      {col.format && col.format !== "text"
                        ? formatValue(Number(row[col.key]), col.format)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={data.page <= 1}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={data.page >= data.totalPages}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
