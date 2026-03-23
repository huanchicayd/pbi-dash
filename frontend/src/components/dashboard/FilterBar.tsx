import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAvailableFilters } from "@/hooks/useFilters";
import type { ActiveFilters } from "@/types";

interface FilterBarProps {
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const { data } = useAvailableFilters();

  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const clearAll = () => onChange({});

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
        <SlidersHorizontal className="size-3.5" />
        <span className="text-xs font-medium">Filtros</span>
        {activeCount > 0 && (
          <Badge variant="default" className="h-4 w-4 p-0 justify-center text-[10px]">
            {activeCount}
          </Badge>
        )}
      </div>

      <div className="w-px h-4 bg-border shrink-0" />

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Period filter */}
        {data?.filters
          ?.filter((f) => f.type === "select")
          .map((filter) => (
            <Select
              key={filter.id}
              value={(filters[filter.id as keyof ActiveFilters] as string) ?? ""}
              onValueChange={(value) =>
                onChange({ ...filters, [filter.id]: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs border-input">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                {filter.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
      </div>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
        >
          <X className="size-3" />
          Limpar
        </Button>
      )}
    </div>
  );
}
