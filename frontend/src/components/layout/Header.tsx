import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const queryClient = useQueryClient();

  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.health(),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  const { mutate: triggerRefresh, isPending } = useMutation({
    mutationFn: () => api.refresh(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6 shrink-0">
      <div>
        <h1 className="text-sm font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {health && (
          <Badge
            variant={health.dataSource === "powerbi" ? "default" : "outline"}
            className="gap-1.5"
          >
            <Database className="size-3" />
            {health.dataSource === "powerbi" ? "Power BI Live" : "Mock Data"}
          </Badge>
        )}

        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => triggerRefresh()}
          disabled={isPending}
          title="Atualizar todos os dados"
        >
          <RefreshCw className={cn("size-3.5", isPending && "animate-spin")} />
        </Button>
      </div>
    </header>
  );
}
