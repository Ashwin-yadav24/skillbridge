"use client";


import { useState } from "react";
import { mockCentres, stateOptions, sectorOptions } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, MapPin, ChevronDown, Phone, Mail } from "lucide-react";
import type { TrainingCentre } from "@/types";

function CentreCard({ centre }: { centre: TrainingCentre }) {
  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm hover:-translate-y-1 transition-transform">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="rounded-full border border-[var(--sb-green)]/30 bg-[var(--sb-green)]/5 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-green)]">{centre.sector}</span>
        <StatusBadge status="demo" label="DEMO" />
      </div>

      <h3 className="font-extrabold text-[var(--sb-navy)] mb-1">{centre.name}</h3>
      <div className="flex items-center gap-1.5 text-sm text-[var(--sb-secondary-text)] mb-3">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {centre.city}, {centre.state}
      </div>

      {/* Map placeholder */}
      <div className="rounded-xl bg-gray-100 border border-gray-200 h-24 flex items-center justify-center mb-3">
        <div className="text-center">
          <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Map placeholder</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="label-tech text-[var(--sb-navy)] mb-1.5">Courses Offered</p>
        <ul className="space-y-1">
          {centre.courses.map((c) => (
            <li key={c} className="text-xs text-[var(--sb-secondary-text)] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sb-blue)] shrink-0" />{c}
            </li>
          ))}
        </ul>
      </div>

      {(centre.contactEmail || centre.contactPhone) && (
        <div className="pt-3 border-t border-gray-100 space-y-1">
          {centre.contactPhone && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--sb-secondary-text)]">
              <Phone className="h-3.5 w-3.5" />{centre.contactPhone}
            </div>
          )}
          {centre.contactEmail && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--sb-secondary-text)]">
              <Mail className="h-3.5 w-3.5" />{centre.contactEmail}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CentresPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");
  const [sector, setSector] = useState("All Sectors");

  const filtered = mockCentres
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => state === "All States" || c.state === state)
    .filter((c) => sector === "All Sectors" || c.sector === sector);

  return (
    <div className="max-w-7xl space-y-6">
      <PageHeader
        badge="TRAINING CENTRES"
        title="Training Centre Discovery"
        highlight="Discovery"
        description="Find training centres near you that offer courses relevant to your career goals."
      />
      <DemoBanner message="Centre details are demo records. Contact centres directly to verify current availability." />

      <div className="rounded-xl border border-[var(--sb-orange)]/30 bg-[var(--sb-orange)]/5 px-4 py-3">
        <p className="text-xs text-[var(--sb-orange)] font-medium">
          Contact centres directly to verify current course availability, timings, and fees. Information is for demonstration only.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or city…"
            className="w-full rounded-xl border-2 border-[var(--sb-navy)] bg-white pl-9 pr-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]"
          />
        </div>
        {[{ value: state, onChange: setState, options: stateOptions, label: "State" }, { value: sector, onChange: setSector, options: sectorOptions, label: "Sector" }].map((f) => (
          <div key={f.label} className="relative">
            <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
              className="rounded-xl border-2 border-[var(--sb-navy)] bg-white pl-3 pr-8 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]">
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[var(--sb-secondary-text)]" />
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MapPin} title="No centres found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => <CentreCard key={c.id} centre={c} />)}
        </div>
      )}
    </div>
  );
}

