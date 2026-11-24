import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-[var(--sb-cream)]">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div className="flex flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[var(--sb-navy)] bg-white px-4 py-1.5 text-xs font-bold shadow-navy-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--sb-green)] animate-pulse" />
              AI-POWERED CAREER INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-[var(--sb-navy)]">
              Bridge Your{" "}
              <span className="text-[var(--sb-blue)]">Skills Gap.</span>
              <br />
              Build Your{" "}
              <span className="underline-accent">Future.</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-[var(--sb-secondary-text)]">
              Discover your career potential with AI-powered resume analysis, occupational skill mapping
              and government-supported training opportunities — all in one platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-7 py-3.5 text-sm font-bold text-white shadow-navy hover:bg-[var(--sb-blue-hover)] transition-colors"
              >
                Explore Opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-white px-7 py-3.5 text-sm font-bold text-[var(--sb-navy)] shadow-navy hover:bg-gray-50 transition-colors"
              >
                <Play className="h-4 w-4" />
                Analyze My Resume
              </Link>
            </div>

            {/* Trust signals */}
            <p className="text-xs text-[var(--sb-secondary-text)]">
              No credit card required · Resume data encrypted · Delete anytime
            </p>
          </div>

          {/* ── Right: browser mockup ── */}
          <div className="relative lg:block">
            <div className="rounded-2xl border-2 border-[var(--sb-navy)] bg-white shadow-navy overflow-hidden">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 border-b-2 border-[var(--sb-navy)] bg-gray-50 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-[var(--sb-red)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--sb-orange)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--sb-green)]" />
                <span className="ml-3 label-tech text-[var(--sb-secondary-text)] text-[10px]">
                  skillbridge_dashboard_v1.0
                </span>
              </div>

              {/* Mock content */}
              <div className="p-5 space-y-4">
                <p className="text-xs font-bold text-[var(--sb-navy)]">Skill Analysis — Full Stack Developer</p>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Skill Match", val: "78.5%", color: "text-[var(--sb-green)]" },
                    { label: "Skills Found", val: "24", color: "text-[var(--sb-blue)]" },
                    { label: "Gaps", val: "7", color: "text-[var(--sb-orange)]" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-gray-200 bg-[var(--sb-card)] p-2.5 text-center">
                      <p className={`text-xl font-extrabold ${s.color}`}>{s.val}</p>
                      <p className="label-tech text-[8px] text-[var(--sb-secondary-text)] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Skill bars */}
                <div className="space-y-2">
                  {[
                    { name: "React.js", pct: 92 },
                    { name: "Node.js", pct: 85 },
                    { name: "TypeScript", pct: 70 },
                    { name: "MongoDB", pct: 45 },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-[var(--sb-navy)]">{s.name}</span>
                        <span className="text-[var(--sb-secondary-text)]">{s.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[var(--sb-blue)]"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI card */}
                <div className="rounded-xl border-2 border-[var(--sb-purple)]/40 bg-[var(--sb-purple)]/5 p-3">
                  <p className="label-tech text-[9px] text-[var(--sb-purple)] mb-1">AI Recommendation</p>
                  <p className="text-xs text-[var(--sb-navy)] leading-relaxed">
                    &ldquo;Consider a TypeScript + Node.js course to close your backend skill gap and reach 90%+ match.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative offset */}
            <div className="absolute -z-10 inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-[var(--sb-navy)] bg-[var(--sb-orange)]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
