import { type LucideIcon, BarChart3 } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
}

export function EmptyState({
  icon: Icon = BarChart3,
  title = "Nenhum dado disponível",
  message = "Não há dados para o período ou filtros selecionados.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
