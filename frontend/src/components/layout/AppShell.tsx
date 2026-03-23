import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": { title: "Dashboard", description: "Visão geral dos indicadores de negócio" },
  "/kpis": { title: "KPIs", description: "Métricas-chave de performance" },
  "/analysis": { title: "Análise por Período", description: "Tendências e comparativos temporais" },
  "/details": { title: "Detalhamento", description: "Dados granulares e ranking de produtos" },
  "/settings": { title: "Configurações", description: "Gerenciar conexão com Power BI" },
};

export function AppShell() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] ?? { title: "Analytics", description: "" };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={meta.title} description={meta.description} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
