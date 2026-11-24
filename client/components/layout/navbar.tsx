"use client";

import Link from "next/link";
import { useState } from "react";
import { BrainCircuit, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "PMKVY", href: "#pmkvy" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
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
            <Link href="/sign-in" className="text-sm font-semibold text-[var(--sb-navy)]">Login</Link>
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-5 py-2 text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
