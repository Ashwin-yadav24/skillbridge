import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[var(--sb-navy)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-[var(--sb-blue)]" />
          <span className="text-xl font-bold text-[var(--sb-navy)]">
            Skill<span className="text-[var(--sb-blue)]">Bridge</span> AI
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Training", "FAQ"].map((item) => (
            <span
              key={item}
              className="label-nav text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block label-nav text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors cursor-pointer">
            Login
          </span>
          <button className="rounded-xl bg-[var(--sb-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--sb-blue-hover)] shadow-navy-sm">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

