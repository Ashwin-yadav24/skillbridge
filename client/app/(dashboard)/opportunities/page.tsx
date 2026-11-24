"use client";


import { useState } from "react";
import { mockOccupations, sectorOptions } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, Filter, ChevronDown, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Occupation } from "@/types";

function OccupationCard({ occ }: { occ: Occupation }) {
  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm hover:-translate-y-1 transition-transform flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">
          {occ.sector}
        </span>
        <StatusBadge status="demo" label="DEMO" />
      </div>

      <div>
        <h3 className="font-extrabold text-[var(--sb-navy)] text-base mb-1">{occ.title}</h3>
        <p className="text-xs text-[var(--sb-secondary-text)] line-clamp-2 leading-relaxed">{occ.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[var(--sb-secondary-text)]">
        {occ.nsqfLevel && (
          <span className="rounded-full bg-[var(--sb-green)]/10 px-2.5 py-0.5 font-semibold text-[var(--sb-green)]">
            NSQF Level {occ.nsqfLevel}
          </span>
        )}
        {occ.qpCode && (
          <span className="label-tech rounded-full bg-gray-100 px-2.5 py-0.5">{occ.qpCode}</span>
        )}
        <span className="rounded-full bg-[var(--sb-orange)]/10 px-2.5 py-0.5 font-semibold text-[var(--sb-orange)]">
          {occ.competencies.length} Competencies
        </span>
      </div>

      <Link
        href={`/opportunities/${occ.id}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-4 py-2 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors mt-auto"
      >
        View Details <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All Sectors");
  const [nsqfLevel, setNsqfLevel] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const filtered = mockOccupations
    .filter((o) => o.title.toLowerCase().includes(search.toLowerCase()) || o.sector.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => sector === "All Sectors" || o.sector === sector)
    .filter((o) => nsqfLevel === "All" || String(o.nsqfLevel) === nsqfLevel)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "sector") return a.sector.localeCompare(b.sector);
      if (sortBy === "level") return (a.nsqfLevel ?? 0) - (b.nsqfLevel ?? 0);
      return 0;
    });

  return (
    <div className="max-w-7xl space-y-6">
      <PageHeader
        badge="CAREER EXPLORATION"
        title="Explore Career Opportunities"
        highlight="Career"
        description="Discover occupational pathways, understand required competencies, and find training opportunities that match your career goals."
      />
      <DemoBanner message="Occupation data shown here is for demonstration. No official NSQF/PMKVY records are shown." />

      {/* Filters */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-4 shadow-navy-sm flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search occupations…"
            className="w-full rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] pl-9 pr-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] pl-9 pr-8 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            {sectorOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={nsqfLevel}
            onChange={(e) => setNsqfLevel(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            {["All", "4", "5", "6", "7"].map((l) => <option key={l}>{l === "All" ? "All Levels" : `NSQF ${l}`}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            <option value="title">Sort: Name</option>
            <option value="sector">Sort: Sector</option>
            <option value="level">Sort: Level</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <p className="label-tech text-[var(--sb-secondary-text)]">
        {filtered.length} occupation{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No occupations found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((occ) => <OccupationCard key={occ.id} occ={occ} />)}
        </div>
      )}
    </div>
  );
}

