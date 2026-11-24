"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BrainCircuit,
  LayoutDashboard,
  Compass,
  FileText,
  BarChart3,
  GraduationCap,
  MapPin,
  Route,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore Opportunities", href: "/opportunities", icon: Compass },
  { label: "My Resume", href: "/resume", icon: FileText },
  { label: "Skill Analysis", href: "/skill-analysis", icon: BarChart3 },
  { label: "Recommended Courses", href: "/courses", icon: GraduationCap },
  { label: "Training Centres", href: "/centres", icon: MapPin },
  { label: "Career Roadmap", href: "/roadmap", icon: Route },
  { label: "My Progress", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/profile", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col border-r-2 border-[var(--sb-navy)] bg-white transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b-2 border-[var(--sb-navy)] h-16 px-4 ${collapsed ? "justify-center" : "gap-2"}`}>
        <BrainCircuit className="h-6 w-6 text-[var(--sb-blue)] shrink-0" />
        {!collapsed && (
          <span className="text-base font-extrabold text-[var(--sb-navy)]">
            Skill<span className="text-[var(--sb-blue)]">Bridge</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-0.5 transition-colors text-sm font-semibold
                ${active
                  ? "bg-[var(--sb-blue)] text-white"
                  : "text-[var(--sb-secondary-text)] hover:bg-[var(--sb-blue)]/5 hover:text-[var(--sb-navy)]"
                } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t-2 border-[var(--sb-navy)] p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-full rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] p-2 hover:bg-gray-100 transition-colors ${collapsed ? "" : "gap-2"}`}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-[var(--sb-navy)]" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 text-[var(--sb-navy)]" />
              <span className="text-xs font-semibold text-[var(--sb-navy)]">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

