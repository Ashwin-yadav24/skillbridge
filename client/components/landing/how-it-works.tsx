import {
  FileUp,
  Cpu,
  BarChart3,
  BookOpen,
  Rocket,
} from "lucide-react";

const steps = [
  { num: "01", icon: BookOpen, title: "Explore Occupations", desc: "Browse career paths across sectors like IT, Healthcare, Renewable Energy and more." },
  { num: "02", icon: FileUp, title: "Upload Resume", desc: "Securely upload your PDF or DOCX resume in seconds." },
  { num: "03", icon: Cpu, title: "Extract Skills", desc: "AI analyzes your resume and extracts skills, education and experience." },
  { num: "04", icon: BarChart3, title: "Analyze Skill Gaps", desc: "Get a weighted compatibility score and see exactly which skills you're missing." },
  { num: "05", icon: BookOpen, title: "Discover Training", desc: "Find relevant training programs and PMKVY-aligned courses to close your gaps." },
  { num: "06", icon: Rocket, title: "Build Your Career", desc: "Follow your personalized roadmap and track progress toward your dream role." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--sb-navy)]">
            The Path to Your <span className="underline-accent">Career</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[var(--sb-secondary-text)]">
            Six simple steps from where you are to where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-cream)] p-6 shadow-navy-sm hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-start gap-4">
                <span className="label-tech text-[var(--sb-blue)] text-lg font-extrabold shrink-0">
                  {s.num}
                </span>
                <div>
                  <div className="rounded-lg bg-[var(--sb-blue)]/10 p-2 w-fit mb-3">
                    <s.icon className="h-5 w-5 text-[var(--sb-blue)]" />
                  </div>
                  <h3 className="font-bold text-[var(--sb-navy)] mb-1">{s.title}</h3>
                  <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

