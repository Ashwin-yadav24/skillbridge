"use client";

import { BrainCircuit } from "lucide-react";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--sb-navy)] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[var(--sb-blue)]" />
            <span className="text-sm font-bold text-[var(--sb-navy)]">
              SkillBridge AI
            </span>
          </div>
          <p className="text-sm text-[var(--sb-secondary-text)]">
            &copy; {CURRENT_YEAR} SkillBridge AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
