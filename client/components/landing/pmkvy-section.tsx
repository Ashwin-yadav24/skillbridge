import Link from "next/link";
import { mockCourses } from "@/lib/mock-data";
import { Clock, GraduationCap, ArrowRight } from "lucide-react";

export function PmkvySection() {
  const featured = mockCourses.slice(0, 3);

  return (
    <section id="pmkvy" className="bg-[var(--sb-cream)] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--sb-navy)]">
            Discover <span className="underline-accent">Training</span> Opportunities
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[var(--sb-secondary-text)]">
            Explore training programs aligned with government skill development initiatives.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--sb-purple)]/30 bg-[var(--sb-purple)]/5 px-4 py-1.5 text-xs font-semibold text-[var(--sb-purple)] mb-8 mx-auto block w-fit">
          ⚡ DEMO DATA — Not official PMKVY listings
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featured.map((c) => (
            <div key={c.id} className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="rounded-full border border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">
                  {c.sector}
                </span>
                {c.nsqfLevel && (
                  <span className="label-tech text-[var(--sb-secondary-text)]">NSQF {c.nsqfLevel}</span>
                )}
              </div>
              <h3 className="font-bold text-[var(--sb-navy)] mb-2">{c.title}</h3>
              <div className="flex items-center gap-4 text-xs text-[var(--sb-secondary-text)] mb-3">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{c.provider}</span>
              </div>
              {c.scheme && (
                <span className="inline-block rounded-full bg-[var(--sb-green)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-green)]">
                  {c.scheme}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-7 py-3 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors"
          >
            View All Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

