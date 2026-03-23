import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { ActiveFilters } from "@/types";

const REFETCH_INTERVAL = 60_000; // auto-refresh every 60s

export function useKpis(filters?: ActiveFilters) {
  return useQuery({
    queryKey: ["kpis", filters],
    queryFn: () => api.kpis(filters),
    refetchInterval: REFETCH_INTERVAL,
  });
}
