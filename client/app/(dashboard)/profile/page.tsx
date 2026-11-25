"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  User, Mail, Phone, GraduationCap, Briefcase,
  Edit3, Save, X, CheckCircle2, Shield, Camera,
  AlertCircle, Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { usersApi, type ApiUser, type UpdateUserPayload } from "@/services/api-client";

// ── Types ──────────────────────────────────────────────────────────────────

type EditForm = {
  name: string;
  qualification: string;
  institution: string;
  graduationYear: string;
};

// ── Component ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    name: "", qualification: "", institution: "", graduationYear: "",
  });

  // ── Fetch profile from API ────────────────────────────────────────────

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated.");
      const res = await usersApi.getMe(token);
      setProfile(res.data);
      setForm({
        name: res.data.name,
        qualification: res.data.education?.qualification ?? "",
        institution: res.data.education?.institution ?? "",
        graduationYear: res.data.education?.graduationYear?.toString() ?? "",
      });
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Save changes ──────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated.");
      const payload: UpdateUserPayload = {
        name: form.name.trim(),
        education: {
          qualification: form.qualification.trim() || undefined,
          institution: form.institution.trim() || undefined,
          graduationYear: form.graduationYear ? parseInt(form.graduationYear) : undefined,
        },
      };
      const res = await usersApi.updateMe(token, payload);
      setProfile(res.data);
      setEditing(false);
      setSuccessMsg("Profile updated successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name,
        qualification: profile.education?.qualification ?? "",
        institution: profile.education?.institution ?? "",
        graduationYear: profile.education?.graduationYear?.toString() ?? "",
      });
    }
    setEditing(false);
    setError("");
  };

  // ── Derived values ────────────────────────────────────────────────────

  const displayName = profile?.name ?? clerkUser?.fullName ?? "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarUrl = clerkUser?.imageUrl;

  const completionSteps = [
    { label: "Basic info filled", done: !!profile?.name },
    { label: "Education added", done: !!profile?.education?.institution },
    { label: "Resume uploaded", done: false },
    { label: "Skill analysis run", done: false },
    { label: "Courses enrolled", done: false },
  ];
  const completionPct = Math.round((completionSteps.filter((s) => s.done).length / completionSteps.length) * 100);

  // ── Loading state ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--sb-blue)] mx-auto mb-3" />
          <p className="text-sm text-[var(--sb-secondary-text)]">Loading profile…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────

  if (!profile && error) {
    return (
      <div className="p-6">
        <div className="flex items-start gap-3 px-5 py-4 bg-[var(--sb-red)]/10 border-2 border-[var(--sb-red)] rounded-xl max-w-lg">
          <AlertCircle className="w-5 h-5 text-[var(--sb-red)] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--sb-red)] text-sm">Could not load profile</p>
            <p className="text-xs text-[var(--sb-secondary-text)] mt-1">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-3 text-xs font-semibold text-[var(--sb-blue)] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
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
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--sb-green)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-sm disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--sb-navy)] font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-sm"
              >
                <X className="w-4 h-4" />Cancel
              </button>
            </div>
          )
        }
      />

      {/* Success / error alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--sb-green)]/10 border-2 border-[var(--sb-green)] rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-[var(--sb-green)]" />
          <p className="text-sm font-semibold text-[var(--sb-green)]">{successMsg}</p>
        </div>
      )}
      {error && editing && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--sb-red)]/10 border-2 border-[var(--sb-red)] rounded-xl">
          <AlertCircle className="w-4 h-4 text-[var(--sb-red)]" />
          <p className="text-sm text-[var(--sb-red)]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Avatar + completion ── */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[var(--sb-navy)] mx-auto shadow-navy-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[var(--sb-blue)] border-4 border-[var(--sb-navy)] flex items-center justify-center mx-auto shadow-navy-sm">
                  <span className="text-3xl font-bold text-white">{initials}</span>
                </div>
              )}
              {editing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--sb-orange)] border-2 border-[var(--sb-navy)] rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors" title="Profile image managed by Clerk">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold text-[var(--sb-navy)]">{displayName}</h2>
            <p className="text-sm text-[var(--sb-secondary-text)] mb-1">{profile?.email}</p>
            <span className="inline-block px-3 py-0.5 bg-[var(--sb-blue)]/10 border border-[var(--sb-blue)] text-[var(--sb-blue)] text-xs font-semibold rounded-full label-tech">
              {profile?.role?.toUpperCase()}
            </span>
            <p className="text-xs text-[var(--sb-secondary-text)] mt-3 label-tech">
              Joined{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>

          {/* Profile completion */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[var(--sb-navy)] text-sm">Profile Completion</h3>
              <span className="text-lg font-bold text-[var(--sb-blue)]">{completionPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full border border-gray-200 overflow-hidden mb-4">
              <div
                className="h-full bg-[var(--sb-blue)] rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <ul className="space-y-2">
              {completionSteps.map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${step.done ? "text-[var(--sb-green)]" : "text-gray-300"}`} />
                  <span className={step.done ? "text-[var(--sb-navy)]" : "text-[var(--sb-secondary-text)]"}>
                    {step.label}
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
                <span className="text-xs text-[var(--sb-secondary-text)]">Auth provider</span>
                <span className="text-xs font-semibold text-[var(--sb-blue)]">Clerk</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Editable fields ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <h3 className="font-bold text-[var(--sb-navy)] mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--sb-blue)]" />
              Personal Information
            </h3>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--sb-secondary-text)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                  />
                ) : (
                  <p className="text-sm text-[var(--sb-navy)] px-4 py-2.5 bg-[var(--sb-cream)] border-2 border-gray-100 rounded-xl">{profile?.name}</p>
                )}
              </div>

              {/* Email (read-only — managed by Clerk) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--sb-secondary-text)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />Email Address
                </label>
                <p className="text-sm text-[var(--sb-secondary-text)] px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl flex items-center gap-2">
                  {profile?.email}
                  <span className="label-tech text-[9px] text-[var(--sb-secondary-text)] bg-gray-200 px-1.5 py-0.5 rounded">
                    managed by Clerk
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <h3 className="font-bold text-[var(--sb-navy)] mb-5 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[var(--sb-green)]" />
              Education
            </h3>
            <div className="space-y-4">
              {[
                { key: "qualification" as const, label: "Qualification", placeholder: "e.g. B.Tech Computer Science" },
                { key: "institution" as const, label: "Institution", placeholder: "e.g. VIT University" },
                { key: "graduationYear" as const, label: "Graduation Year", placeholder: "e.g. 2024", type: "number" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[var(--sb-secondary-text)] uppercase tracking-wider mb-1.5">{label}</label>
                  {editing ? (
                    <input
                      type={type ?? "text"}
                      value={form[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                    />
                  ) : (
                    <p className="text-sm text-[var(--sb-navy)] px-4 py-2.5 bg-[var(--sb-cream)] border-2 border-gray-100 rounded-xl">
                      {profile?.education?.[key as keyof typeof profile.education] || <span className="text-[var(--sb-secondary-text)]">Not provided</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Role info */}
          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-xl shadow-navy-sm p-6">
            <h3 className="font-bold text-[var(--sb-navy)] mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[var(--sb-purple)]" />
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--sb-secondary-text)] label-tech mb-1">Account Role</p>
                <p className="text-sm font-semibold text-[var(--sb-navy)] capitalize">{profile?.role}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--sb-secondary-text)] label-tech mb-1">Member Since</p>
                <p className="text-sm font-semibold text-[var(--sb-navy)]">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--sb-secondary-text)] mt-4 italic">
              <Phone className="w-3 h-3 inline mr-1" />
              Role is assigned by administrators and cannot be changed by users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
