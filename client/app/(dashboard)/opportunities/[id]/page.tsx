"use client";


import { useParams } from "next/navigation";
import Link from "next/link";
import { mockOccupations, mockCourses } from "@/lib/mock-data";
import { DemoBanner } from "@/components/shared/demo-banner";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, CheckCircle2, Circle, GraduationCap, FileSearch, Clock } from "lucide-react";

export default function OccupationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const occ = mockOccupations.find((o) => o.id === id);

  if (!occ) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Occupation not found"
        description="This occupation does not exist in the demo dataset."
        action={<Link href="/opportunities" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--sb-blue)] hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Opportunities</Link>}
      />
    );
  }

  const related = mockCourses.filter((c) => occ.relatedCourses.includes(c.id));
  const mandatory = occ.competencies.filter((c) => c.type === "mandatory");
  const optional = occ.competencies.filter((c) => c.type === "optional");

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      <DemoBanner message="This occupation record is for demonstration. No official NSQF data is implied." />

      {/* Header card */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-3 py-1 text-xs font-bold text-[var(--sb-blue)]">{occ.sector}</span>
              <StatusBadge status="demo" label="DEMO DATA" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--sb-navy)]">{occ.title}</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            {occ.nsqfLevel && <span className="rounded-full bg-[var(--sb-green)]/10 px-3 py-1 text-xs font-bold text-[var(--sb-green)]">NSQF Level {occ.nsqfLevel}</span>}
            {occ.qpCode && <span className="label-tech text-[var(--sb-secondary-text)]">{occ.qpCode}</span>}
          </div>
        </div>
        <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{occ.description}</p>
      </div>

      {/* Competencies */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm">
        <h2 className="text-lg font-extrabold text-[var(--sb-navy)] mb-5">Required Competencies</h2>

        {mandatory.length > 0 && (
          <div className="mb-5">
            <p className="label-tech text-[var(--sb-navy)] mb-3">Mandatory</p>
            <div className="space-y-2">
              {mandatory.map((c) => (
                <div key={c.id} className="flex gap-3 items-start rounded-lg border border-[var(--sb-green)]/30 bg-[var(--sb-green)]/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--sb-green)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[var(--sb-navy)]">{c.name}</p>
                    <p className="text-xs text-[var(--sb-secondary-text)]">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {optional.length > 0 && (
          <div>
            <p className="label-tech text-[var(--sb-navy)] mb-3">Optional</p>
            <div className="space-y-2">
              {optional.map((c) => (
                <div key={c.id} className="flex gap-3 items-start rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Circle className="h-4 w-4 text-[var(--sb-secondary-text)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[var(--sb-navy)]">{c.name}</p>
                    <p className="text-xs text-[var(--sb-secondary-text)]">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related courses */}
      {related.length > 0 && (
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm">
          <h2 className="text-lg font-extrabold text-[var(--sb-navy)] mb-4">Related Training Programs</h2>
          <div className="space-y-3">
            {related.map((c) => (
              <div key={c.id} className="flex gap-4 items-start rounded-lg border-2 border-gray-200 p-4 hover:border-[var(--sb-blue)]/50 transition-colors">
                <div className="rounded-xl bg-[var(--sb-blue)]/10 p-2 h-fit shrink-0">
                  <GraduationCap className="h-5 w-5 text-[var(--sb-blue)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[var(--sb-navy)]">{c.title}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-[var(--sb-secondary-text)]">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                    <span>{c.provider}</span>
                    {c.nsqfLevel && <span>NSQF {c.nsqfLevel}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border-2 border-[var(--sb-blue)] bg-[var(--sb-blue)]/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[var(--sb-navy)]">Ready to analyze your fit for this role?</p>
          <p className="text-sm text-[var(--sb-secondary-text)]">Upload your resume and get an instant skill gap analysis.</p>
        </div>
        <Link
          href="/resume"
          className="inline-flex items-center gap-2 shrink-0 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-6 py-3 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors"
        >
          Analyze My Resume
        </Link>
      </div>
    </div>
  );
}

