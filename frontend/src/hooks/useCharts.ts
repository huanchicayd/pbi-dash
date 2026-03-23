import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { ActiveFilters } from "@/types";

const REFETCH_INTERVAL = 60_000;

export function useRevenueChart(filters?: ActiveFilters) {
  return useQuery({
    queryKey: ["charts", "revenue", filters],
    queryFn: () => api.charts.revenue(filters),
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useCategoryChart(filters?: ActiveFilters) {
  return useQuery({
    queryKey: ["charts", "category", filters],
    queryFn: () => api.charts.category(filters),
    refetchInterval: REFETCH_INTERVAL,
  });
}
