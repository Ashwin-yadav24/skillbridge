"use client";


import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { mockAssessment } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function SkillAnalysisPage() {
  const { overallMatch, matchedSkills, missingSkills, partialSkills } = mockAssessment;

  const radarData = matchedSkills.map((s) => ({
    subject: s.name,
    score: s.score ?? 50,
    fullMark: 100,
  }));

  const barData = [...matchedSkills]
    .filter((s) => s.score !== undefined)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map((s) => ({ name: s.name.split(" ")[0], score: s.score }));

  return (
    <div className="max-w-7xl space-y-6">
      <PageHeader
        badge="SKILL GAP ANALYSIS"
        title="Skill Gap Analysis"
        highlight="Analysis"
        description="Your detailed skill compatibility report against Full Stack Developer requirements."
      />
      <DemoBanner message="This analysis uses demo data. Real analysis will use AI-extracted resume data." />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-1 rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-secondary-text)] mb-2">Overall Match</p>
          <div className="flex items-center gap-4">
            <PieChart width={80} height={80}>
              <Pie data={[{ value: overallMatch }, { value: 100 - overallMatch }]} cx={35} cy={35} innerRadius={26} outerRadius={38} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                <Cell fill="#0878F9" />
                <Cell fill="#E2E8F0" />
              </Pie>
            </PieChart>
            <span className="text-3xl font-extrabold text-[var(--sb-blue)]">{overallMatch}%</span>
          </div>
        </div>
        <MetricCard label="Matched Skills" value={String(matchedSkills.length)} color="text-[var(--sb-green)]" />
        <MetricCard label="Missing Skills" value={String(missingSkills.length)} color="text-[var(--sb-orange)]" />
        <MetricCard label="Partial Match" value={String(partialSkills.length)} color="text-[var(--sb-blue)]" />
      </div>

      {/* Skills lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Matched */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-[var(--sb-green)]" />
            <p className="label-tech text-[var(--sb-navy)]">Matched Skills ({matchedSkills.length})</p>
          </div>
          <div className="space-y-3">
            {matchedSkills.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-[var(--sb-navy)]">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={s.importance === "critical" ? "error" : s.importance === "important" ? "warning" : "info"}
                      label={s.importance}
                    />
                    <span className="text-[var(--sb-secondary-text)]">{s.score}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-[var(--sb-green)]" style={{ width: `${s.score ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-[var(--sb-orange)]" />
            <p className="label-tech text-[var(--sb-navy)]">Missing Skills ({missingSkills.length})</p>
          </div>
          <div className="space-y-2">
            {missingSkills.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-[var(--sb-card)] border border-gray-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[var(--sb-orange)] shrink-0" />
                  <span className="text-sm font-semibold text-[var(--sb-navy)]">{s.name}</span>
                </div>
                <StatusBadge
                  status={s.importance === "critical" ? "error" : s.importance === "important" ? "warning" : "info"}
                  label={s.importance}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-navy)] mb-4">Skill Proficiency Radar</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748B" }} />
              <Radar name="Score" dataKey="score" stroke="#0878F9" fill="#0878F9" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-navy)] mb-4">Skill Scores</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical" barSize={14}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#1E293B" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ border: "2px solid #1E293B", borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [`${v}%`, "Score"]}
              />
              <Bar dataKey="score" fill="#0878F9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI recommendation */}
      <div className="rounded-xl border-2 border-[var(--sb-purple)]/40 bg-[var(--sb-purple)]/5 p-5">
        <p className="label-tech text-[var(--sb-purple)] mb-2">AI Career Recommendation (Demo)</p>
        <p className="text-[var(--sb-navy)] font-medium leading-relaxed">
          &ldquo;Your frontend skills are strong (HTML, JavaScript, React). Focus next on <strong>TypeScript</strong> and <strong>Node.js</strong> to build full-stack capability. A structured backend course could raise your match from 68% to above 85% within 3–4 months.&rdquo;
        </p>
        <p className="text-xs text-[var(--sb-secondary-text)] mt-3">This suggestion is AI-generated demo content and not a certified career assessment.</p>
      </div>
    </div>
  );
}
