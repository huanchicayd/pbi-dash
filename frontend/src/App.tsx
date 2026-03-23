import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/Dashboard";
import { KPIsPage } from "@/pages/KPIs";
import { AnalysisPage } from "@/pages/Analysis";
import { DetailsPage } from "@/pages/Details";
import { SettingsPage } from "@/pages/Settings";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="kpis" element={<KPIsPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="details" element={<DetailsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
