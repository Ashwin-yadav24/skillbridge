"use client";

import { Bell, Menu } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 border-b-2 border-[var(--sb-navy)] bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg border-2 border-[var(--sb-navy)]"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="text-base font-bold text-[var(--sb-navy)] hidden sm:block">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] hover:bg-gray-100 transition-colors">
          <Bell className="h-4 w-4 text-[var(--sb-navy)]" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--sb-orange)]" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-1.5">
          <div className="h-7 w-7 rounded-full bg-[var(--sb-blue)] flex items-center justify-center">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <span className="text-sm font-semibold text-[var(--sb-navy)] hidden sm:block">
            {mockUser.name.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}

