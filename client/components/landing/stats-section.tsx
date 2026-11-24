import { landingStats } from "@/lib/mock-data";

export function StatsSection() {
  return (
    <section className="bg-[var(--sb-navy)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="label-tech text-center text-[var(--sb-orange)] mb-8">Platform at a Glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {landingStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border-2 border-white/20 bg-white/5 p-5 text-center"
            >
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="label-tech text-white/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="label-tech text-center text-white/30 mt-6">
          Sample figures for demonstration purposes only
        </p>
      </div>
    </section>
  );
}

