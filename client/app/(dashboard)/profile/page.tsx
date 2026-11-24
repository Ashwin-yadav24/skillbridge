"use client";


import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Shield,
  Camera,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { mockUser } from "@/lib/mock-data";

const SKILLS_LIST = [
  "JavaScript", "TypeScript", "React.js", "Node.js",
  "Python", "MongoDB", "Git", "REST APIs",
];

const MOCK_PROFILE = {
  name: mockUser.name,
  email: mockUser.email,
  phone: "+91 98765 43210",
  education: "B.Tech Computer Science — VIT University, 2024",
  experience: "2 years — Full Stack Development (Internships)",
  bio: "Passionate software developer focused on building scalable web applications. Currently exploring AI and cloud technologies to level up my career.",
};

type ProfileField = keyof typeof MOCK_PROFILE;

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [draft, setDraft] = useState(MOCK_PROFILE);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const fields: { key: ProfileField; label: string; icon: React.ReactNode; type?: string }[] = [
    { key: "name", label: "Full Name", icon: <User className="w-4 h-4" /> },
    { key: "email", label: "Email Address", icon: <Mail className="w-4 h-4" />, type: "email" },
    { key: "phone", label: "Phone Number", icon: <Phone className="w-4 h-4" />, type: "tel" },
    { key: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { key: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <DemoBanner message="Profile data shown is for demonstration. Edits are UI-only and will not persist after refresh." />

      <PageHeader
        title="My Profile"
        description="Manage your personal information and career details."
        badge="STUDENT"
        actions={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--sb-blue)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--sb-green)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--sb-navy)] font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Avatar + completion ── */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-[var(--sb-blue)] border-4 border-[var(--sb-navy)] flex items-center justify-center mx-auto shadow-navy-sm">
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--sb-orange)] border-2 border-[var(--sb-navy)] rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold text-[var(--sb-navy)]">{profile.name}</h2>
            <p className="text-sm text-[var(--sb-secondary-text)] mb-1">{profile.email}</p>
            <span className="inline-block px-3 py-0.5 bg-[var(--sb-blue)]/10 border border-[var(--sb-blue)] text-[var(--sb-blue)] text-xs font-semibold rounded-full label-tech">
              {mockUser.role.toUpperCase()}
            </span>
            <p className="text-xs text-[var(--sb-secondary-text)] mt-3 label-tech">
              Joined {new Date(mockUser.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Profile completion */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[var(--sb-navy)] text-sm">Profile Completion</h3>
              <span className="text-lg font-bold text-[var(--sb-blue)]">
                {mockUser.profileCompletion}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full border border-gray-200 overflow-hidden mb-4">
              <div
                className="h-full bg-[var(--sb-blue)] rounded-full transition-all"
                style={{ width: `${mockUser.profileCompletion}%` }}
              />
            </div>
            <ul className="space-y-2">
              {[
                { label: "Basic info filled", done: true },
                { label: "Resume uploaded", done: true },
                { label: "Occupation selected", done: true },
                { label: "Skill analysis run", done: false },
                { label: "Courses enrolled", done: false },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      item.done ? "text-[var(--sb-green)]" : "text-gray-300"
                    }`}
                  />
                  <span
                    className={
                      item.done ? "text-[var(--sb-navy)]" : "text-[var(--sb-secondary-text)]"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Account security */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[var(--sb-green)]" />
              <h3 className="font-bold text-[var(--sb-navy)] text-sm">Account Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--sb-secondary-text)]">Email verified</span>
                <span className="text-xs font-semibold text-[var(--sb-green)]">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--sb-secondary-text)]">Two-factor auth</span>
                <span className="text-xs font-semibold text-[var(--sb-orange)]">Not set up</span>
              </div>
              <button className="w-full mt-2 py-2 px-3 bg-white border-2 border-[var(--sb-navy)] rounded-xl text-xs font-semibold text-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Editable fields + skills ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <h3 className="font-bold text-[var(--sb-navy)] mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--sb-blue)]" />
              Personal Information
            </h3>
            <div className="space-y-5">
              {fields.map(({ key, label, icon, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[var(--sb-secondary-text)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    {icon}
                    {label}
                  </label>
                  {editing ? (
                    <input
                      type={type ?? "text"}
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                    />
                  ) : (
                    <p className="text-sm text-[var(--sb-navy)] px-4 py-2.5 bg-[var(--sb-cream)] border-2 border-gray-100 rounded-xl">
                      {profile[key]}
                    </p>
                  )}
                </div>
              ))}

              {/* Bio / textarea */}
              <div>
                <label className="block text-xs font-semibold text-[var(--sb-secondary-text)] uppercase tracking-wider mb-1.5">
                  Professional Bio
                </label>
                {editing ? (
                  <textarea
                    value={draft.bio}
                    onChange={(e) => setDraft((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm resize-none"
                  />
                ) : (
                  <p className="text-sm text-[var(--sb-navy)] px-4 py-2.5 bg-[var(--sb-cream)] border-2 border-gray-100 rounded-xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills snapshot */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[var(--sb-navy)] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--sb-purple)]" />
                Skills Snapshot
              </h3>
              <span className="label-tech text-xs text-[var(--sb-secondary-text)]">
                From last resume analysis
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-[var(--sb-blue)]/10 border border-[var(--sb-blue)] text-[var(--sb-blue)] text-xs font-semibold rounded-lg"
                >
                  {skill}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-[var(--sb-cream)] border-2 border-dashed border-[var(--sb-navy)] text-[var(--sb-secondary-text)] text-xs font-semibold rounded-lg">
                + Upload Resume to Discover More
              </span>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border-2 border-[var(--sb-red)] rounded-xl p-6">
            <h3 className="font-bold text-[var(--sb-red)] mb-2 text-sm">Danger Zone</h3>
            <p className="text-xs text-[var(--sb-secondary-text)] mb-4">
              Deleting your account is permanent and cannot be undone. All your data, resume
              analyses, and progress will be lost.
            </p>
            <button
              className="px-4 py-2 bg-white border-2 border-[var(--sb-red)] text-[var(--sb-red)] font-semibold text-sm rounded-xl hover:bg-[var(--sb-red)] hover:text-white transition-all"
              onClick={() => alert("Account deletion is not available in the demo.")}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

