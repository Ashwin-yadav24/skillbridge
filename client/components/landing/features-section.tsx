import {
  FileSearch,
  TrendingDown,
  GraduationCap,
  Route,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    color: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)]",
    title: "AI Resume Analysis",
    desc: "Gemini-powered extraction pulls skills, education, projects, and experience from any PDF or DOCX resume automatically.",
  },
  {
    icon: TrendingDown,
    color: "bg-[var(--sb-orange)]/10 text-[var(--sb-orange)]",
    title: "Skill Gap Detection",
    desc: "Compare your profile against occupation requirements using exact matching, semantic similarity, and weighted scoring.",
  },
  {
    icon: GraduationCap,
    color: "bg-[var(--sb-green)]/10 text-[var(--sb-green)]",
    title: "Training Discovery",
    desc: "Browse training programs and PMKVY-aligned courses filtered by sector, skill, location, and eligibility.",
  },
  {
    icon: Route,
    color: "bg-[var(--sb-purple)]/10 text-[var(--sb-purple)]",
    title: "Career Roadmaps",
    desc: "AI generates a step-by-step career development plan with milestones, project suggestions, and timelines.",
  },
  {
    icon: CheckCircle2,
    color: "bg-[var(--sb-red)]/10 text-[var(--sb-red)]",
    title: "Progress Tracking",
    desc: "Track completed skills, compare multiple resume versions, and visualize your improvement over time.",
  },
  {
    icon: MessageSquare,
    color: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)]",
    title: "AI Career Assistant",
    desc: "Chat with an AI assistant grounded in verified scheme data for context-aware career guidance.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-[var(--sb-cream)] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--sb-navy)]">
            Everything You Need to <span className="underline-accent">Succeed</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[var(--sb-secondary-text)]">
            One platform. Every tool you need to navigate your career transition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy-sm hover:-translate-y-1 transition-transform"
            >
              <div className={`rounded-xl p-3 w-fit mb-4 ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--sb-navy)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

