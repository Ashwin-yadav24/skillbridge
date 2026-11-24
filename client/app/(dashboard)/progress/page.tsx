"use client";


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { mockProgress, mockWeeklyActivity } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { MetricCard } from "@/components/shared/metric-card";
import { CheckCircle2, Loader2, Circle, FileSearch2 } from "lucide-react";

export default function ProgressPage() {
  const completed = mockProgress.filter((p) => p.status === "completed").length;
  const inProgress = mockProgress.filter((p) => p.status === "in-progress").length;
  const pct = Math.round((completed / mockProgress.length) * 100);

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader badge="LEARNING PROGRESS" title="Learning Progress" highlight="Progress" description="Track your skill development journey." />
      <DemoBanner />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Skills Completed" value={String(completed)} color="text-[var(--sb-green)]" />
        <MetricCard label="In Progress" value={String(inProgress)} color="text-[var(--sb-blue)]" />
        <MetricCard label="Overall" value={`${pct}%`} color="text-[var(--sb-purple)]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills list */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-navy)] mb-4">Skill Tracker</p>
          <div className="space-y-2">
            {mockProgress.map((p) => (
              <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                p.status === "completed" ? "border-[var(--sb-green)]/30 bg-[var(--sb-green)]/5" :
                p.status === "in-progress" ? "border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5" :
                "border-gray-200 bg-gray-50"
              }`}>
                <div className="flex items-center gap-2.5">
                  {p.status === "completed" && <CheckCircle2 className="h-4 w-4 text-[var(--sb-green)] shrink-0" />}
                  {p.status === "in-progress" && <Loader2 className="h-4 w-4 text-[var(--sb-blue)] shrink-0 animate-spin" />}
                  {p.status === "not-started" && <Circle className="h-4 w-4 text-gray-300 shrink-0" />}
                  <span className="text-sm font-semibold text-[var(--sb-navy)]">{p.skill}</span>
                </div>
                <span className="label-tech text-[9px] text-[var(--sb-secondary-text)]">
                  {p.status === "completed" && p.completedAt ? p.completedAt : p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + comparison */}
        <div className="space-y-5">
          <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
            <p className="label-tech text-[var(--sb-navy)] mb-4">Weekly Activity</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockWeeklyActivity} barSize={22}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ border: "2px solid #1E293B", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v}h`, "Hours"]} />
                <Bar dataKey="hours" fill="#0878F9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resume comparison placeholder */}
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <FileSearch2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="font-bold text-[var(--sb-navy)] mb-1">Resume Comparison</p>
            <p className="text-sm text-[var(--sb-secondary-text)]">
              Upload an updated resume to compare your skills and see how much you&apos;ve improved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
