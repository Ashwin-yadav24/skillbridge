import {
  Users,
  Briefcase,
  BookOpen,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

const ADMIN_MODULES = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "User Management",
    description:
      "View, search, and manage registered students. Review profiles, reset passwords, and monitor usage.",
    color: "blue" as const,
    colorClass: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)] border-[var(--sb-blue)]/30",
    phase: "Phase 10",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Occupation Management",
    description:
      "Add, edit and curate occupation listings, competency frameworks and NSQF level mappings.",
    color: "purple" as const,
    colorClass: "bg-[var(--sb-purple)]/10 text-[var(--sb-purple)] border-[var(--sb-purple)]/30",
    phase: "Phase 10",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Course Management",
    description:
      "Manage PMKVY training programmes, provider details, enrolment data, and batch information.",
    color: "green" as const,
    colorClass: "bg-[var(--sb-green)]/10 text-[var(--sb-green)] border-[var(--sb-green)]/30",
    phase: "Phase 10",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Centre Management",
    description:
      "Maintain training centre records, geolocation data, approval status, and capacity information.",
    color: "orange" as const,
    colorClass: "bg-[var(--sb-orange)]/10 text-[var(--sb-orange)] border-[var(--sb-orange)]/30",
    phase: "Phase 10",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics & Reports",
    description:
      "Platform usage statistics, skill-gap trends, course completion rates, and placement outcomes.",
    color: "blue" as const,
    colorClass: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)] border-[var(--sb-blue)]/30",
    phase: "Phase 11",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "System Configuration",
    description:
      "API keys, AI model settings, rate limits, feature flags and notification templates.",
    color: "purple" as const,
    colorClass: "bg-[var(--sb-purple)]/10 text-[var(--sb-purple)] border-[var(--sb-purple)]/30",
    phase: "Phase 11",
  },
];

const PLACEHOLDER_STATS = [
  { label: "Total Students", value: "—", icon: <Users className="w-5 h-5" />, color: "text-[var(--sb-blue)]" },
  { label: "Active Occupations", value: "—", icon: <Briefcase className="w-5 h-5" />, color: "text-[var(--sb-purple)]" },
  { label: "PMKVY Courses", value: "—", icon: <BookOpen className="w-5 h-5" />, color: "text-[var(--sb-green)]" },
  { label: "Training Centres", value: "—", icon: <MapPin className="w-5 h-5" />, color: "text-[var(--sb-orange)]" },
];

export default function AdminPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Access warning */}
      <div className="flex items-start gap-3 px-5 py-4 bg-[var(--sb-red)]/10 border-2 border-[var(--sb-red)] rounded-xl">
        <Lock className="w-5 h-5 text-[var(--sb-red)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[var(--sb-red)]">
            Admin Authorization Required
          </p>
          <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5">
            This area is restricted to authorized administrators only. Full access control and
            role-based permissions will be enforced in Phase 10. Currently showing UI placeholder.
          </p>
        </div>
      </div>

      <PageHeader
        title="Admin Dashboard"
        description="Platform management console for SkillBridge AI administrators."
        badge="ADMIN"
        actions={
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--sb-orange)]" />
            <StatusBadge status="warning" label="Coming in Phase 10" />
          </div>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PLACEHOLDER_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-4 flex items-center gap-3"
          >
            <div className={`${stat.color} bg-gray-50 p-2 rounded-lg border border-gray-100`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-[var(--sb-secondary-text)] label-tech">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <div>
        <h2 className="text-lg font-bold text-[var(--sb-navy)] mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADMIN_MODULES.map((mod) => (
            <div
              key={mod.title}
              className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6 flex flex-col gap-4 opacity-80"
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center ${mod.colorClass}`}
                >
                  {mod.icon}
                </div>
                <span className="label-tech text-[10px] text-[var(--sb-secondary-text)] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                  {mod.phase}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-[var(--sb-navy)] mb-1">{mod.title}</h3>
                <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">
                  {mod.description}
                </p>
              </div>

              {/* Disabled button */}
              <button
                disabled
                className="mt-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-400 font-semibold rounded-xl border-2 border-gray-200 cursor-not-allowed text-sm"
              >
                <Lock className="w-4 h-4" />
                Not Available Yet
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Phase info */}
      <div className="bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-2">Development Roadmap</h3>
        <p className="text-white/60 text-sm mb-4">
          The admin panel will be fully implemented across later phases of the SkillBridge AI
          development roadmap.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: "Phase 10", label: "Admin CRUD APIs", status: "Upcoming" },
            { phase: "Phase 11", label: "Analytics & Reports", status: "Upcoming" },
            { phase: "Phase 12", label: "Role-based Access Control", status: "Upcoming" },
          ].map((item) => (
            <div key={item.phase} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="label-tech text-xs text-[var(--sb-blue)] mb-1">{item.phase}</div>
              <div className="font-semibold text-sm">{item.label}</div>
              <div className="text-xs text-white/40 mt-1">{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
