import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-[var(--sb-cream)]">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left — Copy ── */}
          <div className="flex flex-col gap-6">
            {/* Announcement badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[var(--sb-navy)] bg-white px-4 py-1.5 text-xs font-semibold shadow-navy-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--sb-green)] animate-pulse" />
              AI-POWERED CAREER GUIDANCE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-[var(--sb-navy)]">
              Bridge Your{" "}
              <span className="text-[var(--sb-blue)]">Skill Gaps</span> with{" "}
              <span className="underline-accent">Intelligent</span> Career
              Guidance
            </h1>

            {/* Description */}
            <p className="max-w-lg text-lg leading-relaxed text-[var(--sb-secondary-text)]">
              Upload your resume, discover missing skills, find verified PMKVY
              training programs, and get a personalized AI-generated career
              roadmap — all in one platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--sb-blue)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--sb-blue-hover)] shadow-navy">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--sb-navy)] transition-colors hover:bg-gray-50 shadow-navy">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* ── Right — Dashboard preview mockup ── */}
          <div className="relative">
            <div className="rounded-2xl border-2 border-[var(--sb-navy)] bg-white shadow-navy overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 label-tech text-[var(--sb-secondary-text)]">
                  skillbridge_dashboard_v1.0
                </span>
              </div>

              {/* Mock dashboard content */}
              <div className="p-6 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    label="Skill Match"
                    value="78.5%"
                    color="text-[var(--sb-green)]"
                  />
                  <StatCard
                    label="Skills Found"
                    value="24"
                    color="text-[var(--sb-blue)]"
                  />
                  <StatCard
                    label="Gaps Identified"
                    value="7"
                    color="text-[var(--sb-orange)]"
                  />
                </div>

                {/* Skills bar */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-[var(--sb-navy)] mb-3">
                    Skill Compatibility
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: "React.js", pct: 92 },
                      { name: "Node.js", pct: 85 },
                      { name: "TypeScript", pct: 70 },
                      { name: "MongoDB", pct: 45 },
                    ].map((s) => (
                      <SkillBar key={s.name} {...s} />
                    ))}
                  </div>
                </div>

                {/* AI recommendation card */}
                <div className="rounded-xl border-2 border-[var(--sb-purple)]/30 bg-[var(--sb-purple)]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="label-tech text-[var(--sb-purple)]">
                      AI Recommendation
                    </span>
                  </div>
                  <p className="text-sm text-[var(--sb-navy)]">
                    &ldquo;Consider taking the PMKVY Full-Stack Developer course
                    to close your MongoDB and DevOps gaps.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Helper components (local to this file) ── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="label-tech text-[var(--sb-secondary-text)] mt-1">{label}</p>
    </div>
  );
}

function SkillBar({ name, pct }: { name: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-[var(--sb-navy)]">{name}</span>
        <span className="text-[var(--sb-secondary-text)]">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-[var(--sb-blue)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

