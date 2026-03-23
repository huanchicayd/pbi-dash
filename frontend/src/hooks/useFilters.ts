import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useAvailableFilters() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: () => api.filters(),
    staleTime: 5 * 60_000, // Filter options rarely change
  });
}
