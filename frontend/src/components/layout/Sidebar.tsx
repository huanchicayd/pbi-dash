import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Table2,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/kpis", label: "KPIs", icon: TrendingUp },
  { to: "/analysis", label: "Análise", icon: BarChart3 },
  { to: "/details", label: "Detalhamento", icon: Table2 },
  { to: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground shrink-0">
          <Zap className="size-4" />
        </div>
        <span className="font-semibold text-sm">Analytics</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/40">v1.0.0</p>
      </div>
    </aside>
  );
}
