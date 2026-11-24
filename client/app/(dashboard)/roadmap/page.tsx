"use client";

import { mockRoadmap } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { CheckCircle2, Circle, Loader2, BookOpen, FolderGit2, Lightbulb } from "lucide-react";
import type { RoadmapMilestone } from "@/types";

function MilestoneCard({ milestone, isLast }: { milestone: RoadmapMilestone; isLast: boolean }) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-[var(--sb-green)]", border: "border-[var(--sb-green)]", bg: "bg-[var(--sb-green)]", ring: "bg-[var(--sb-green)]" },
    "in-progress": { icon: Loader2, color: "text-[var(--sb-blue)]", border: "border-[var(--sb-blue)]", bg: "bg-[var(--sb-blue)]", ring: "bg-[var(--sb-blue)] animate-pulse" },
    upcoming: { icon: Circle, color: "text-gray-400", border: "border-gray-200", bg: "bg-gray-200", ring: "bg-gray-300" },
  };
  const cfg = statusConfig[milestone.status];

  return (
    <div className="flex gap-5">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${cfg.border} bg-white shadow-navy-sm`}>
          <cfg.icon className={`h-5 w-5 ${cfg.color} ${milestone.status === "in-progress" ? "animate-spin" : ""}`} />
        </div>
        {!isLast && <div className={`mt-2 w-0.5 flex-1 min-h-8 ${milestone.status === "completed" ? "bg-[var(--sb-green)]" : "bg-gray-200"}`} />}
      </div>

      {/* Content */}
      <div className={`flex-1 rounded-xl border-2 p-5 mb-5 ${cfg.border} bg-white shadow-navy-sm`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-extrabold text-[var(--sb-navy)]">{milestone.title}</h3>
          <span className={`label-tech rounded-full px-2.5 py-0.5 text-white text-[9px] ${cfg.bg}`}>{milestone.status}</span>
        </div>
        <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed mb-4">{milestone.description}</p>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[var(--sb-navy)]">
              <Lightbulb className="h-3.5 w-3.5 text-[var(--sb-blue)]" /> Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {milestone.skills.map((s) => (
                <span key={s} className="rounded-full bg-[var(--sb-blue)]/10 px-2 py-0.5 font-semibold text-[var(--sb-blue)]">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[var(--sb-navy)]">
              <FolderGit2 className="h-3.5 w-3.5 text-[var(--sb-purple)]" /> Projects
            </div>
            <ul className="space-y-0.5 text-[var(--sb-secondary-text)]">
              {milestone.projects.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          {milestone.suggestedCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 font-bold text-[var(--sb-navy)]">
                <BookOpen className="h-3.5 w-3.5 text-[var(--sb-green)]" /> Courses
              </div>
              <ul className="space-y-0.5 text-[var(--sb-secondary-text)]">
                {milestone.suggestedCourses.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const { milestones, occupationTitle } = mockRoadmap;
  const completed = milestones.filter((m) => m.status === "completed").length;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        badge="CAREER ROADMAP"
        title="Your Career Roadmap"
        highlight="Career"
        description={`Personalized pathway to become a ${occupationTitle}.`}
      />
      <DemoBanner message="This roadmap is AI-generated demo content. Real roadmaps will be generated from your actual skill data." />

      {/* Progress summary */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm flex flex-wrap items-center gap-6">
        <div>
          <p className="label-tech text-[var(--sb-secondary-text)]">Target Role</p>
          <p className="font-extrabold text-[var(--sb-navy)]">{occupationTitle}</p>
        </div>
        <div>
          <p className="label-tech text-[var(--sb-secondary-text)]">Progress</p>
          <p className="font-extrabold text-[var(--sb-green)]">{completed}/{milestones.length} milestones</p>
        </div>
        <div className="flex-1 min-w-32">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div className="h-2.5 rounded-full bg-[var(--sb-green)]" style={{ width: `${(completed / milestones.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {milestones.map((m, i) => (
          <MilestoneCard key={m.id} milestone={m} isLast={i === milestones.length - 1} />
        ))}
      </div>
    </div>
  );
}

