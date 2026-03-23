import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { ActiveFilters } from "@/types";

export function useTopItems(params: {
  page: number;
  pageSize: number;
  filters?: ActiveFilters;
}) {
  return useQuery({
    queryKey: ["table", "top-items", params],
    queryFn: () => api.table.topItems(params),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });
}
