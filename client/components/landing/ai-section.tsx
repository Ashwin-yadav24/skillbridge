import { Cpu, Layers, Route } from "lucide-react";

const capabilities = [
  {
    icon: Cpu,
    title: "Intelligent Skill Extraction",
    desc: "Gemini parses your resume and identifies technical skills, soft skills, and competencies — even when phrased differently.",
  },
  {
    icon: Layers,
    title: "Semantic Skill Matching",
    desc: "Beyond keyword matching — embeddings capture meaning so 'ReactJS', 'React.js', and 'React Framework' all match correctly.",
  },
  {
    icon: Route,
    title: "Personalized Roadmaps",
    desc: "AI generates unique career paths tailored to your existing skills, target occupation, and timeline.",
  },
];

export function AiSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--sb-purple)]/30 bg-[var(--sb-purple)]/5 px-4 py-1.5 text-xs font-bold text-[var(--sb-purple)] mb-5">
              Powered by Gemini
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--sb-navy)] mb-5">
              Powered by{" "}
              <span className="text-[var(--sb-blue)]">Advanced AI</span>
            </h2>
            <div className="space-y-5">
              {capabilities.map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="rounded-xl bg-[var(--sb-purple)]/10 p-2.5 h-fit shrink-0">
                    <c.icon className="h-5 w-5 text-[var(--sb-purple)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--sb-navy)] mb-1">{c.title}</h3>
                    <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="rounded-2xl border-2 border-[var(--sb-purple)]/40 bg-[var(--sb-purple)]/5 p-6 space-y-4">
              <p className="label-tech text-[var(--sb-purple)]">AI Analysis Output</p>

              <div className="rounded-xl border border-[var(--sb-purple)]/20 bg-white p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--sb-green)]" />
                  <span className="text-xs font-semibold text-[var(--sb-navy)]">Skills Identified</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["React.js", "JavaScript", "HTML5", "CSS3", "Git", "Node.js"].map((s) => (
                    <span key={s} className="rounded-full bg-[var(--sb-blue)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--sb-purple)]/20 bg-white p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--sb-orange)]" />
                  <span className="text-xs font-semibold text-[var(--sb-navy)]">Gap Analysis</span>
                </div>
                <div className="space-y-2">
                  {[
                    { skill: "TypeScript", importance: "Critical" },
                    { skill: "MongoDB", importance: "Important" },
                    { skill: "Docker", importance: "Nice to have" },
                  ].map((g) => (
                    <div key={g.skill} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--sb-navy)] font-medium">{g.skill}</span>
                      <span className="rounded-full bg-[var(--sb-orange)]/10 px-2 py-0.5 text-[var(--sb-orange)] font-semibold">{g.importance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--sb-purple)]/20 bg-white p-4">
                <p className="label-tech text-[9px] text-[var(--sb-purple)] mb-1">AI Career Suggestion</p>
                <p className="text-xs text-[var(--sb-navy)] leading-relaxed">
                  &ldquo;Your frontend skills are strong. Focus on TypeScript and Node.js to transition to full-stack development within 4–6 months.&rdquo;
                </p>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-[var(--sb-navy)] bg-[var(--sb-purple)]/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

