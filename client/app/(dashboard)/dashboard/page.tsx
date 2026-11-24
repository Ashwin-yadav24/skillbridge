"use client";


import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { mockUser, dashboardStats, mockAssessment, mockCourses, mockWeeklyActivity, mockRoadmap } from "@/lib/mock-data";
import { MetricCard } from "@/components/shared/metric-card";
import { DemoBanner } from "@/components/shared/demo-banner";
import { StatusBadge } from "@/components/shared/status-badge";
import { CheckCircle2, XCircle, ArrowRight, Clock, BookOpen } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {
  const matchPct = mockAssessment.overallMatch;

  return (
    <div className="space-y-6 max-w-7xl">
      <DemoBanner />

      {/* Welcome */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--sb-navy)]">
              Welcome back, {mockUser.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-[var(--sb-secondary-text)] mt-1">
              Your career journey toward <strong>Full Stack Developer</strong> is in progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="label-tech text-[var(--sb-secondary-text)] mb-1">Profile Completion</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-[var(--sb-blue)]" style={{ width: `${mockUser.profileCompletion}%` }} />
                </div>
                <span className="text-sm font-bold text-[var(--sb-blue)]">{mockUser.profileCompletion}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((s) => (
          <MetricCard key={s.label} label={s.label} value={s.value} color={s.color} change={s.change} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill match donut */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-navy)] mb-4">Overall Skill Match</p>
          <div className="flex items-center gap-6">
            <div className="relative">
              <PieChart width={120} height={120}>
                <Pie data={[{ value: matchPct }, { value: 100 - matchPct }]} cx={55} cy={55} innerRadius={38} outerRadius={55} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill="#0878F9" />
                  <Cell fill="#E2E8F0" />
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-extrabold text-[var(--sb-blue)]">{matchPct}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--sb-green)]" />
                <span className="text-[var(--sb-navy)]">Matched: {mockAssessment.matchedSkills.length} skills</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--sb-orange)]" />
                <span className="text-[var(--sb-navy)]">Missing: {mockAssessment.missingSkills.length} skills</span>
              </div>
              <Link href="/skill-analysis" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sb-blue)] hover:underline mt-2">
                Full Analysis <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Weekly activity */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <p className="label-tech text-[var(--sb-navy)] mb-4">Weekly Learning Activity</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={mockWeeklyActivity} barSize={20}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ border: "2px solid #1E293B", borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [`${v}h`, "Hours"]}
              />
              <Bar dataKey="hours" fill="#0878F9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Missing skills + Courses */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Missing skills */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="label-tech text-[var(--sb-navy)]">Missing Skills</p>
            <Link href="/skill-analysis" className="text-xs font-semibold text-[var(--sb-blue)] hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {mockAssessment.missingSkills.slice(0, 5).map((s) => (
              <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--sb-card)]">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-[var(--sb-orange)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--sb-navy)]">{s.name}</span>
                </div>
                <StatusBadge
                  status={s.importance === "critical" ? "error" : s.importance === "important" ? "warning" : "info"}
                  label={s.importance}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended courses */}
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="label-tech text-[var(--sb-navy)]">Recommended Courses</p>
            <Link href="/courses" className="text-xs font-semibold text-[var(--sb-blue)] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {mockCourses.slice(0, 3).map((c) => (
              <div key={c.id} className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-[var(--sb-blue)]/50 transition-colors">
                <div className="rounded-lg bg-[var(--sb-blue)]/10 p-2 h-fit shrink-0">
                  <BookOpen className="h-4 w-4 text-[var(--sb-blue)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--sb-navy)] truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3 text-[var(--sb-secondary-text)]" />
                    <span className="text-xs text-[var(--sb-secondary-text)]">{c.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap preview */}
      <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="label-tech text-[var(--sb-navy)]">Career Roadmap — {mockRoadmap.occupationTitle}</p>
          <Link href="/roadmap" className="text-xs font-semibold text-[var(--sb-blue)] hover:underline">Full Roadmap</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {mockRoadmap.milestones.map((m) => (
            <div
              key={m.id}
              className={`shrink-0 rounded-xl border-2 p-3 w-40 ${
                m.status === "completed" ? "border-[var(--sb-green)] bg-[var(--sb-green)]/5" :
                m.status === "in-progress" ? "border-[var(--sb-blue)] bg-[var(--sb-blue)]/5" :
                "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                {m.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--sb-green)]" />}
                {m.status === "in-progress" && <span className="h-2.5 w-2.5 rounded-full bg-[var(--sb-blue)] animate-pulse" />}
                {m.status === "upcoming" && <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />}
                <span className="label-tech text-[8px] text-[var(--sb-secondary-text)]">{m.status}</span>
              </div>
              <p className="text-xs font-bold text-[var(--sb-navy)]">{m.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
