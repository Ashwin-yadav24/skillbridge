"use client";


import { useState } from "react";
import { mockCourses, sectorOptions } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, GraduationCap, Clock, ChevronDown } from "lucide-react";
import type { Course } from "@/types";

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm hover:-translate-y-1 transition-transform flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">{course.sector}</span>
        <StatusBadge status="demo" label="DEMO" />
      </div>
      <h3 className="font-extrabold text-[var(--sb-navy)]">{course.title}</h3>
      <p className="text-xs text-[var(--sb-secondary-text)] leading-relaxed">{course.description}</p>

      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1 text-xs text-[var(--sb-secondary-text)]"><Clock className="h-3 w-3" />{course.duration}</span>
        <span className="flex items-center gap-1 text-xs text-[var(--sb-secondary-text)]"><GraduationCap className="h-3 w-3" />{course.provider}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {course.skills.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-[var(--sb-green)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--sb-green)]">{s}</span>
        ))}
        {course.skills.length > 3 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[var(--sb-secondary-text)]">+{course.skills.length - 3} more</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
        {course.nsqfLevel && <span className="label-tech text-[var(--sb-secondary-text)]">NSQF {course.nsqfLevel}</span>}
        {course.scheme && <span className="rounded-full bg-[var(--sb-orange)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-orange)]">{course.scheme}</span>}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All Sectors");

  const filtered = mockCourses
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((c) => sector === "All Sectors" || c.sector === sector);

  return (
    <div className="max-w-7xl space-y-6">
      <PageHeader
        badge="TRAINING DISCOVERY"
        title="Recommended Training Courses"
        highlight="Training"
        description="Explore courses aligned with your skill gaps and career goals."
      />
      <DemoBanner message="These are demo course records. Verify details with official training providers." />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course or skill…"
            className="w-full rounded-xl border-2 border-[var(--sb-navy)] bg-white pl-9 pr-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]"
          />
        </div>
        <div className="relative">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="rounded-xl border-2 border-[var(--sb-navy)] bg-white pl-3 pr-8 py-2 text-sm font-semibold text-[var(--sb-navy)] appearance-none cursor-pointer outline-none focus:border-[var(--sb-blue)]"
          >
            {sectorOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[var(--sb-secondary-text)]" />
        </div>
      </div>

      <p className="label-tech text-[var(--sb-secondary-text)]">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No courses found" description="Try adjusting your filters." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}

