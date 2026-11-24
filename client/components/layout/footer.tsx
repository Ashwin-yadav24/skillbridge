"use client";

import Link from "next/link";
import { BrainCircuit } from "lucide-react";

const YEAR = 2026;

const cols = [
  {
    heading: "Platform",
    links: [
      { label: "Explore Opportunities", href: "/opportunities" },
      { label: "Resume Analysis", href: "/resume" },
      { label: "Skill Gap Analysis", href: "/skill-analysis" },
      { label: "Training Courses", href: "/courses" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Career Roadmap", href: "/roadmap" },
      { label: "Training Centres", href: "/centres" },
      { label: "Learning Progress", href: "/progress" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Protection", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--sb-navy)] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BrainCircuit className="h-6 w-6 text-[var(--sb-blue)]" />
              <span className="text-lg font-extrabold text-[var(--sb-navy)]">
                Skill<span className="text-[var(--sb-blue)]">Bridge</span> AI
              </span>
            </Link>
            <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">
              AI-powered career guidance to bridge your skills gap and build your future.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="label-tech text-[var(--sb-navy)] mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--sb-secondary-text)]">
            &copy; {YEAR} SkillBridge AI. All rights reserved.
          </p>
          <p className="text-xs text-[var(--sb-secondary-text)]">
            Course and scheme data shown for demonstration purposes only. Verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
