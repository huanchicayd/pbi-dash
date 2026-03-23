import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,          // Data considered fresh for 30s
      gcTime: 5 * 60 * 1000,     // Keep in cache for 5 min after unmount
      refetchOnWindowFocus: true,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    },
  },
});
