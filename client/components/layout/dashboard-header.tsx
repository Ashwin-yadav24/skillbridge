"use client";

import { Bell, Menu, LogOut, User } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const { user, isLoaded } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.emailAddresses?.[0]?.emailAddress?.slice(0, 2).toUpperCase() ?? "U";

  const displayName = user?.firstName
    ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]
    ?? "User";

  return (
    <header className="h-16 border-b-2 border-[var(--sb-navy)] bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
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

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            {!isLoaded ? (
              <div className="h-7 w-7 rounded-full bg-gray-200 animate-pulse" />
            ) : user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "User"}
                className="h-7 w-7 rounded-full object-cover border border-[var(--sb-navy)]"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[var(--sb-blue)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
            )}
            <span className="text-sm font-semibold text-[var(--sb-navy)] hidden sm:block">
              {displayName}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-[var(--sb-navy)] truncate">{user?.fullName ?? displayName}</p>
                <p className="text-xs text-[var(--sb-secondary-text)] truncate">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--sb-navy)] hover:bg-[var(--sb-cream)] transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <div className="border-t border-gray-100">
                <SignOutButton redirectUrl="/">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--sb-red)] hover:bg-[var(--sb-red)]/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
