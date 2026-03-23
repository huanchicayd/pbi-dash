import { useState } from "react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { DataTableCard } from "@/components/shared/DataTableCard";
import type { ActiveFilters } from "@/types";

export function DetailsPage() {
  const [filters, setFilters] = useState<ActiveFilters>({});

  return (
    <div className="flex flex-col gap-6 animate-in">
      <FilterBar filters={filters} onChange={setFilters} />
      <DataTableCard filters={filters} />
    </div>
  );
}
