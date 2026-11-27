"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DemoBanner } from "@/components/shared/demo-banner";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileSearch,
  Loader2,
  Info,
  ShieldCheck,
  BookOpen,
  Link2,
} from "lucide-react";
import { occupationsApi } from "@/services/api-client";
import type { ApiOccupation, ApiOccupationSkill } from "@/services/api-client";

function ProficiencyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    beginner: "bg-blue-50 text-blue-700",
    intermediate: "bg-yellow-50 text-yellow-700",
    advanced: "bg-orange-50 text-orange-700",
    expert: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${colors[level] ?? "bg-gray-100 text-gray-600"}`}>
      {level}
    </span>
  );
}

export default function OccupationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [occ, setOcc] = useState<ApiOccupation | null>(null);
  const [skills, setSkills] = useState<ApiOccupationSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      occupationsApi.getById(id),
      occupationsApi.getSkills(id),
    ])
      .then(([occRes, skillsRes]) => {
        setOcc(occRes.data);
        setSkills(skillsRes.data);
      })
      .catch(() => setError("Failed to load occupation details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-[var(--sb-blue)] animate-spin" />
      </div>
    );
  }

  if (error || !occ) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Occupation not found"
        description={error ?? "This occupation does not exist or has been deactivated."}
        action={
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1 text-sm font-bold text-[var(--sb-blue)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Opportunities
          </Link>
        }
      />
    );
  }

  const sectorName = typeof occ.sector === "object" ? occ.sector.name : occ.sector;
  const mandatory = skills.filter((s) => s.mandatory);
  const optional = skills.filter((s) => !s.mandatory);

  const statusLabel =
    occ.verificationStatus === "demo"
      ? "DEMO DATA"
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
    <div className="max-w-4xl space-y-6">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      {occ.verificationStatus === "demo" && (
        <DemoBanner message="This occupation record is DEMO DATA for illustration purposes. No official NSQF data is implied." />
      )}

      {/* Header card */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-3 py-1 text-xs font-bold text-[var(--sb-blue)]">
                {sectorName}
              </span>
              {occ.subSector && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
                  {occ.subSector}
                </span>
              )}
              <StatusBadge
                status={statusColor}
                label={statusLabel}
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--sb-navy)]">{occ.title}</h1>
            {occ.qualificationTitle && (
              <p className="text-sm text-[var(--sb-secondary-text)] mt-1">{occ.qualificationTitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {occ.nsqfLevel && (
              <span className="rounded-full bg-[var(--sb-green)]/10 px-3 py-1 text-xs font-bold text-[var(--sb-green)]">
                NSQF Level {occ.nsqfLevel}
              </span>
            )}
            {occ.qpCode && (
              <span className="label-tech text-[var(--sb-secondary-text)]">{occ.qpCode}</span>
            )}
            {occ.qualificationCode && (
              <span className="label-tech text-xs text-gray-500">QC: {occ.qualificationCode}</span>
            )}
          </div>
        </div>

        {occ.description && (
          <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{occ.description}</p>
        )}
      </div>

      {/* Qualification info */}
      {(occ.minimumEducation || occ.qualificationCriteria) && (
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[var(--sb-blue)]" />
            <h2 className="text-lg font-extrabold text-[var(--sb-navy)]">Qualification Requirements</h2>
          </div>
          {occ.minimumEducation && (
            <div className="mb-3">
              <p className="label-tech text-[var(--sb-navy)] mb-1">Minimum Education</p>
              <p className="text-sm text-[var(--sb-secondary-text)]">{occ.minimumEducation}</p>
            </div>
          )}
          {occ.qualificationCriteria && (
            <div>
              <p className="label-tech text-[var(--sb-navy)] mb-1">Qualification Criteria</p>
              <p className="text-sm text-[var(--sb-secondary-text)]">{occ.qualificationCriteria}</p>
            </div>
          )}
        </div>
      )}

      {/* Competencies */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm">
        <h2 className="text-lg font-extrabold text-[var(--sb-navy)] mb-5">
          Required Competencies
          <span className="ml-2 text-sm font-normal text-[var(--sb-secondary-text)]">
            ({skills.length} total)
          </span>
        </h2>

        {skills.length === 0 && (
          <p className="text-sm text-[var(--sb-secondary-text)] italic">
            No competency data available for this occupation.
          </p>
        )}

        {mandatory.length > 0 && (
          <div className="mb-5">
            <p className="label-tech text-[var(--sb-navy)] mb-3">Mandatory</p>
            <div className="space-y-2">
              {mandatory.map((s) => (
                <div
                  key={s._id}
                  className="flex gap-3 items-start rounded-lg border border-[var(--sb-green)]/30 bg-[var(--sb-green)]/5 p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-[var(--sb-green)] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[var(--sb-navy)]">
                        {typeof s.skillId === "object" ? s.skillId.name : String(s.skillId)}
                      </p>
                      {typeof s.skillId === "object" && (
                        <span className="text-[10px] rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                          {s.skillId.category}
                        </span>
                      )}
                      <ProficiencyBadge level={s.proficiencyExpectation} />
                    </div>
                    {s.competencyDescription && (
                      <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5">
                        {s.competencyDescription}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {optional.length > 0 && (
          <div>
            <p className="label-tech text-[var(--sb-navy)] mb-3">Optional / Desirable</p>
            <div className="space-y-2">
              {optional.map((s) => (
                <div
                  key={s._id}
                  className="flex gap-3 items-start rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <Circle className="h-4 w-4 text-[var(--sb-secondary-text)] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[var(--sb-navy)]">
                        {typeof s.skillId === "object" ? s.skillId.name : String(s.skillId)}
                      </p>
                      {typeof s.skillId === "object" && (
                        <span className="text-[10px] rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                          {s.skillId.category}
                        </span>
                      )}
                      <ProficiencyBadge level={s.proficiencyExpectation} />
                    </div>
                    {s.competencyDescription && (
                      <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5">
                        {s.competencyDescription}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scheme Associations */}
      {occ.schemeAssociations && occ.schemeAssociations.length > 0 && (
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-[var(--sb-purple)]" />
            <h2 className="text-lg font-extrabold text-[var(--sb-navy)]">Scheme Associations</h2>
          </div>
          <div className="space-y-2">
            {occ.schemeAssociations.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div>
                  <p className="text-sm font-bold text-[var(--sb-navy)]">{s.schemeName}</p>
                  {s.schemeCode && (
                    <p className="label-tech text-xs text-gray-500">{s.schemeCode}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {s.verified ? (
                    <span className="text-xs rounded-full bg-[var(--sb-green)]/10 px-2 py-0.5 font-bold text-[var(--sb-green)]">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs rounded-full bg-yellow-50 px-2 py-0.5 font-bold text-yellow-700">
                      Unverified
                    </span>
                  )}
                  {s.evidenceUrl && (
                    <a
                      href={s.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--sb-blue)] hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source & Verification */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-gray-400" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Source & Verification
          </p>
        </div>
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Source: </span>
          {occ.sourceInformation?.name ?? "Not specified"}
        </p>
        {occ.sourceInformation?.url && (
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="font-semibold">Reference: </span>
            <a
              href={occ.sourceInformation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--sb-blue)] hover:underline"
            >
              {occ.sourceInformation.url}
            </a>
          </p>
        )}
        {occ.sourceInformation?.identifier && (
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="font-semibold">Identifier: </span>
            {occ.sourceInformation.identifier}
          </p>
        )}
        {occ.sourceInformation?.importedAt && (
          <p className="text-xs text-gray-500 mt-0.5">
            Imported:{" "}
            {new Date(occ.sourceInformation.importedAt).toLocaleDateString("en-IN")}
          </p>
        )}
        {occ.lastVerifiedAt && (
          <p className="text-xs text-gray-500 mt-0.5">
            Last verified:{" "}
            {new Date(occ.lastVerifiedAt).toLocaleDateString("en-IN")}
          </p>
        )}
        {occ.verificationStatus !== "verified" && (
          <p className="text-xs text-yellow-700 mt-1 italic">
            ⚠ This record has not been independently verified against an official government source.
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-xl border-2 border-[var(--sb-blue)] bg-[var(--sb-blue)]/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[var(--sb-navy)]">Ready to analyze your fit for this role?</p>
          <p className="text-sm text-[var(--sb-secondary-text)]">
            Upload your resume and get an instant skill gap analysis.
          </p>
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
