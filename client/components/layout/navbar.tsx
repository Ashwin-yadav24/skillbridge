"use client";

import Link from "next/link";
import { useState } from "react";
import { BrainCircuit, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "PMKVY", href: "#pmkvy" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.emailAddresses?.[0]?.emailAddress?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[var(--sb-navy)] bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BrainCircuit className="h-7 w-7 text-[var(--sb-blue)]" />
          <span className="text-xl font-extrabold text-[var(--sb-navy)]">
            Skill<span className="text-[var(--sb-blue)]">Bridge</span> AI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="label-nav text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoaded ? (
            <div className="w-20 h-8 bg-gray-100 rounded-xl animate-pulse" />
          ) : isSignedIn ? (
            /* ── Signed-in state ── */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                {user?.imageUrl ? (
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
                <span className="text-sm font-semibold text-[var(--sb-navy)]">
                  {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                </span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-[var(--sb-navy)] truncate">
                      {user?.fullName ?? "User"}
                    </p>
                    <p className="text-xs text-[var(--sb-secondary-text)] truncate">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--sb-navy)] hover:bg-[var(--sb-cream)] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--sb-navy)] hover:bg-[var(--sb-cream)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <div className="border-t border-gray-100">
                    <SignOutButton redirectUrl="/">
                      <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--sb-red)] hover:bg-[var(--sb-red)]/5 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Signed-out state ── */
            <>
              <Link
                href="/sign-in"
                className="label-nav text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-5 py-2 text-sm font-semibold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg border-2 border-[var(--sb-navy)]"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-2 border-[var(--sb-navy)] bg-white px-6 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="label-nav text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold text-[var(--sb-navy)]">
                  Dashboard
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="text-sm font-semibold text-[var(--sb-navy)]">
                  My Profile
                </Link>
                <SignOutButton redirectUrl="/">
                  <button className="text-left text-sm font-semibold text-[var(--sb-red)]">Sign Out</button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-semibold text-[var(--sb-navy)]">Login</Link>
                <Link
                  href="/sign-up"
                  className="inline-flex justify-center rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-5 py-2 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
