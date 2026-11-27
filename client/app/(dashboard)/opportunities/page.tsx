"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, Filter, ChevronDown, Compass, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { occupationsApi } from "@/services/api-client";
import type { ApiOccupation, ApiSector } from "@/services/api-client";

// ─── OccupationCard ──────────────────────────────────────────────────────────

function OccupationCard({ occ }: { occ: ApiOccupation }) {
  const sectorName =
    typeof occ.sector === "object" ? occ.sector.name : occ.sector;

  const hasPmkvy = occ.schemeAssociations?.some(
    (s) => s.schemeName.toLowerCase().includes("pmkvy") && s.verified
  );

  const statusLabel =
    occ.verificationStatus === "demo"
      ? "DEMO"
      : occ.verificationStatus === "verified"
      ? "Verified"
      : occ.verificationStatus === "imported"
      ? "Imported"
      : "Pending";

  const statusColor: "demo" | "success" | "warning" | "info" =
    occ.verificationStatus === "verified"
      ? "success"
      : occ.verificationStatus === "demo"
      ? "demo"
      : occ.verificationStatus === "imported"
      ? "info"
      : "warning";

  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm hover:-translate-y-1 transition-transform flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">
          {sectorName}
        </span>
        <StatusBadge status={statusColor} label={statusLabel} />
      </div>

      <div>
        <h3 className="font-extrabold text-[var(--sb-navy)] text-base mb-1">{occ.title}</h3>
        <p className="text-xs text-[var(--sb-secondary-text)] line-clamp-2 leading-relaxed">
          {occ.description ?? "No description available."}
        </p>
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
        {occ.competencyCount !== undefined && (
          <span className="rounded-full bg-[var(--sb-orange)]/10 px-2.5 py-0.5 font-semibold text-[var(--sb-orange)]">
            {occ.competencyCount} Competencies
          </span>
        )}
        {hasPmkvy && (
          <span className="rounded-full bg-[var(--sb-purple)]/10 px-2.5 py-0.5 font-semibold text-[var(--sb-purple)]">
            PMKVY
          </span>
        )}
        {!occ.isActive && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-600">
            Inactive
          </span>
        )}
      </div>

      {occ.sourceInformation && (
        <p className="text-[10px] text-[var(--sb-secondary-text)] opacity-60">
          Source: {occ.sourceInformation.name}
        </p>
      )}

      <Link
        href={`/opportunities/${occ._id}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-4 py-2 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors mt-auto"
      >
        View Details <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const NSQF_OPTIONS = ["All Levels", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sector, setSector] = useState("");
  const [nsqfLevel, setNsqfLevel] = useState("");
  const [pmkvy, setPmkvy] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [page, setPage] = useState(1);

  const [occupations, setOccupations] = useState<ApiOccupation[]>([]);
  const [sectors, setSectors] = useState<ApiSector[]>([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasDemoRecords, setHasDemoRecords] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load sectors once
  useEffect(() => {
    occupationsApi.getSectors().then((r) => setSectors(r.data)).catch(() => {});
  }, []);

  // Fetch occupations
  const fetchOccupations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "12",
        sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (sector) params.sector = sector;
      if (nsqfLevel && nsqfLevel !== "All Levels") params.nsqfLevel = nsqfLevel;
      if (pmkvy) params.pmkvy = "true";

      const res = await occupationsApi.list(params);
      setOccupations(res.data);
      setPagination(res.pagination);
      setHasDemoRecords(res.data.some((o) => o.verificationStatus === "demo"));
    } catch {
      setError("Failed to load occupations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sector, nsqfLevel, pmkvy, page, sortBy]);

  useEffect(() => {
    fetchOccupations();
  }, [fetchOccupations]);

  // Reset page when filters change
  const handleSectorChange = (v: string) => { setSector(v); setPage(1); };
  const handleNsqfChange = (v: string) => { setNsqfLevel(v); setPage(1); };
  const handlePmkvyChange = (v: boolean) => { setPmkvy(v); setPage(1); };
  const handleSortChange = (v: string) => { setSortBy(v); setPage(1); };

  return (
    <div className="max-w-7xl space-y-6">
      <PageHeader
        badge="CAREER EXPLORATION"
        title="Explore Career Opportunities"
        highlight="Career"
        description="Discover occupational pathways, understand required competencies, and find training opportunities that match your career goals."
      />

      {hasDemoRecords && (
        <DemoBanner message="Some occupation records are labelled DEMO DATA for illustration. No official NSQF/PMKVY records are shown unless sourced and verified." />
      )}

      {/* Filters */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-4 shadow-navy-sm flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search occupations…"
            className="w-full rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] pl-9 pr-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]"
          />
        </div>

        {/* Sector */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <select
            value={sector}
            onChange={(e) => handleSectorChange(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] pl-9 pr-8 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => (
              <option key={s._id} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>

        {/* NSQF Level */}
        <div className="relative">
          <select
            value={nsqfLevel}
            onChange={(e) => handleNsqfChange(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            {NSQF_OPTIONS.map((l) => (
              <option key={l} value={l === "All Levels" ? "" : l}>
                {l === "All Levels" ? l : `NSQF ${l}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>

        {/* PMKVY toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2">
          <input
            type="checkbox"
            checked={pmkvy}
            onChange={(e) => handlePmkvyChange(e.target.checked)}
            className="accent-[var(--sb-blue)]"
          />
          <span className="text-sm font-semibold text-[var(--sb-navy)]">PMKVY Only</span>
        </label>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            <option value="title">Sort: Name</option>
            <option value="nsqfLevel">Sort: Level</option>
            <option value="createdAt">Sort: Newest</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sb-secondary-text)] pointer-events-none" />
        </div>
      </div>

      {/* Results info */}
      <p className="label-tech text-[var(--sb-secondary-text)]">
        {loading ? "Loading…" : `${pagination.total} occupation${pagination.total !== 1 ? "s" : ""} found`}
      </p>

      {/* Error */}
      {error && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchOccupations} className="ml-4 text-xs font-bold underline">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-[var(--sb-blue)] animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          {occupations.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No occupations found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {occupations.map((occ) => (
                <OccupationCard key={occ._id} occ={occ} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border-2 border-[var(--sb-navy)] px-4 py-2 text-sm font-bold text-[var(--sb-navy)] disabled:opacity-40 hover:bg-[var(--sb-cream)] transition-colors"
              >
                Previous
              </button>
              <span className="label-tech text-[var(--sb-secondary-text)]">
                Page {page} / {pagination.pages}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border-2 border-[var(--sb-navy)] px-4 py-2 text-sm font-bold text-[var(--sb-navy)] disabled:opacity-40 hover:bg-[var(--sb-cream)] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
