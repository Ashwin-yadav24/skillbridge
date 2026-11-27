"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { PageHeader } from "@/components/shared/page-header";
import {
  Upload, FileText, X, CheckCircle2, AlertCircle,
  Briefcase, GraduationCap, FolderGit2, Award,
  RefreshCw, Trash2, Clock, Loader2, ChevronDown, ChevronUp,
  Sparkles, Info,
} from "lucide-react";
import { resumesApi, type ApiResume, type ApiSkill } from "@/services/api-client";

// ── Helpers ───────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const STATUS_COLOR: Record<ApiResume["status"], string> = {
  uploaded: "bg-[var(--sb-orange)]/10 text-[var(--sb-orange)] border-[var(--sb-orange)]",
  processing: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)] border-[var(--sb-blue)]",
  completed: "bg-[var(--sb-green)]/10 text-[var(--sb-green)] border-[var(--sb-green)]",
  failed: "bg-[var(--sb-red)]/10 text-[var(--sb-red)] border-[var(--sb-red)]",
};

const STATUS_LABEL: Record<ApiResume["status"], string> = {
  uploaded: "Queued",
  processing: "Processing…",
  completed: "Completed",
  failed: "Failed",
};

const SKILL_CATEGORY_COLOR: Record<string, string> = {
  "Programming Language": "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)]",
  "Framework/Library": "bg-[var(--sb-purple)]/10 text-[var(--sb-purple)]",
  Database: "bg-[var(--sb-orange)]/10 text-[var(--sb-orange)]",
  "Cloud/DevOps": "bg-sky-100 text-sky-700",
  Tool: "bg-gray-100 text-gray-700",
  "Soft Skill": "bg-[var(--sb-green)]/10 text-[var(--sb-green)]",
  "Domain Knowledge": "bg-amber-100 text-amber-700",
  Other: "bg-gray-100 text-gray-600",
  General: "bg-gray-100 text-gray-600",
};

function skillColor(category: string): string {
  return SKILL_CATEGORY_COLOR[category] ?? SKILL_CATEGORY_COLOR.Other;
}

// ── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ApiResume["status"] }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold label-tech ${STATUS_COLOR[status]}`}>
      {status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "completed" && <CheckCircle2 className="w-3 h-3" />}
      {status === "failed" && <AlertCircle className="w-3 h-3" />}
      {status === "uploaded" && <Clock className="w-3 h-3" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <span className="p-1.5 rounded-lg bg-[var(--sb-cream)]">{icon}</span>
      <p className="label-tech text-[var(--sb-navy)] font-semibold">{label}</p>
      <span className="ml-auto text-xs font-bold text-[var(--sb-secondary-text)] bg-gray-100 rounded-full px-2 py-0.5">{count}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

type UploadState = "empty" | "dragging" | "selected" | "uploading" | "error";

export default function ResumePage() {
  const { getToken } = useAuth();

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>("empty");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Resume list
  const [resumes, setResumes] = useState<ApiResume[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  // Selected resume for detail view
  const [selected, setSelected] = useState<ApiResume | null>(null);
  const [expandedSkillCategories, setExpandedSkillCategories] = useState<Record<string, boolean>>({});

  // Polling ref
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch resumes ───────────────────────────────────────────────────────

  const fetchResumes = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await resumesApi.list(token);
      setResumes(res.data);
      // Auto-select most recent if none selected
      if (!selected && res.data.length > 0) {
        setSelected(res.data[0]);
      }
      // Update selected if it changed on server
      if (selected) {
        const updated = res.data.find((r) => r._id === selected._id);
        if (updated) setSelected(updated);
      }
    } catch {
      setListError("Failed to load resumes.");
    } finally {
      setListLoading(false);
    }
  }, [getToken, selected]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResumes();
  }, [fetchResumes]);

  // Poll while any resume is processing/uploaded
  useEffect(() => {
    const hasInProgress = resumes.some(
      (r) => r.status === "processing" || r.status === "uploaded"
    );
    if (hasInProgress && !pollRef.current) {
      pollRef.current = setInterval(() => { fetchResumes(); }, 3000);
    }
    if (!hasInProgress && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [resumes, fetchResumes]);

  // ── File validation ─────────────────────────────────────────────────────

  const validateFile = (f: File): string | null => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExts = /\.(pdf|docx)$/i;
    if (!allowedMimes.includes(f.type) || !allowedExts.test(f.name)) {
      return "Only PDF (.pdf) and Word (.docx) files are accepted.";
    }
    if (f.size > 5 * 1024 * 1024) return "File size must be under 5 MB.";
    if (f.size < 100) return "File appears to be empty or invalid.";
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setUploadError(err);
      setUploadState("error");
      return;
    }
    setFile(f);
    setUploadState("selected");
    setUploadError("");
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    else setUploadState("empty");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    setUploadState("empty");
    setUploadError("");
    setUploadProgress(0);
  };

  // ── Upload ──────────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file) return;
    setUploadState("uploading");
    setUploadProgress(10);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated.");

      setUploadProgress(30);
      const res = await resumesApi.upload(token, file);
      setUploadProgress(100);

      // Add to list and auto-select
      setResumes((prev) => [res.data, ...prev]);
      setSelected(res.data);
      setFile(null);
      setUploadState("empty");
      setUploadProgress(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setUploadError(msg);
      setUploadState("error");
      setUploadProgress(0);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Delete this resume and all extracted data?")) return;
    try {
      const token = await getToken();
      if (!token) return;
      await resumesApi.delete(token, resumeId);
      const updated = resumes.filter((r) => r._id !== resumeId);
      setResumes(updated);
      if (selected?._id === resumeId) setSelected(updated[0] ?? null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  // ── Reprocess ───────────────────────────────────────────────────────────

  const handleReprocess = async (resumeId: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await resumesApi.reprocess(token, resumeId);
      setResumes((prev) =>
        prev.map((r) =>
          r._id === resumeId ? { ...r, status: "uploaded", extractedData: null, processingError: null } : r
        )
      );
      if (selected?._id === resumeId) {
        setSelected((prev) => prev ? { ...prev, status: "uploaded", extractedData: null, processingError: null } : prev);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Reprocess failed.");
    }
  };

  // ── Skills grouped by category ──────────────────────────────────────────

  const groupedSkills = (skills: ApiSkill[]) => {
    const groups: Record<string, ApiSkill[]> = {};
    for (const s of skills) {
      const cat = s.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    }
    return groups;
  };

  const toggleCategory = (cat: string) =>
    setExpandedSkillCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        badge="RESUME INTELLIGENCE"
        title="Resume Intelligence"
        highlight="Intelligence"
        description="Upload your resume and let AI extract your skills, experience, and education automatically."
      />

      {/* AI Privacy Notice */}
      <div className="flex items-start gap-3 rounded-xl border-2 border-[var(--sb-blue)]/30 bg-[var(--sb-blue)]/5 px-4 py-3">
        <Info className="w-4 h-4 text-[var(--sb-blue)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--sb-secondary-text)]">
          <span className="font-semibold text-[var(--sb-navy)]">Privacy notice:</span>{" "}
          Resume text is processed by Google Gemini AI to extract structured information.
          Your file is stored privately and never shared publicly.
        </p>
      </div>

      <div className="grid lg:grid-cols-[340px,1fr] gap-6 items-start">

        {/* ── Left column: uploader + history ───────────────────────────── */}
        <div className="space-y-5">

          {/* Upload area */}
          <div
            onDragOver={(e) => { e.preventDefault(); if (uploadState !== "uploading") setUploadState("dragging"); }}
            onDragLeave={() => setUploadState(file ? "selected" : "empty")}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              uploadState === "dragging" ? "border-[var(--sb-blue)] bg-[var(--sb-blue)]/5 scale-[1.01]" :
              uploadState === "error" ? "border-[var(--sb-red)] bg-[var(--sb-red)]/5" :
              uploadState === "selected" ? "border-[var(--sb-green)] bg-[var(--sb-green)]/5" :
              uploadState === "uploading" ? "border-[var(--sb-blue)] bg-[var(--sb-blue)]/5" :
              "border-[var(--sb-navy)]/30 bg-white hover:border-[var(--sb-blue)] hover:bg-[var(--sb-blue)]/5"
            } cursor-pointer`}
          >
            {uploadState === "uploading" ? (
              <div className="space-y-3">
                <Loader2 className="h-10 w-10 text-[var(--sb-blue)] mx-auto animate-spin" />
                <p className="font-bold text-[var(--sb-navy)]">Uploading…</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[var(--sb-blue)] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--sb-secondary-text)]">{uploadProgress}%</p>
              </div>
            ) : uploadState === "selected" && file ? (
              <div className="space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[var(--sb-green)] mx-auto" />
                <div>
                  <p className="font-bold text-[var(--sb-navy)] text-sm truncate max-w-[200px] mx-auto">{file.name}</p>
                  <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5">{formatBytes(file.size)}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleUpload}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-4 py-2 text-xs font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Analyse with AI
                  </button>
                  <button
                    onClick={removeFile}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[var(--sb-red)] px-3 py-2 text-xs font-bold text-[var(--sb-red)] hover:bg-[var(--sb-red)]/5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : uploadState === "error" ? (
              <div className="space-y-2">
                <AlertCircle className="h-10 w-10 text-[var(--sb-red)] mx-auto" />
                <p className="font-bold text-[var(--sb-red)] text-sm">Upload Error</p>
                <p className="text-xs text-[var(--sb-secondary-text)] max-w-[220px] mx-auto">{uploadError}</p>
                <button onClick={() => { setUploadState("empty"); setUploadError(""); }} className="text-xs font-semibold text-[var(--sb-blue)] hover:underline">
                  Try again
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 text-[var(--sb-secondary-text)] mx-auto" />
                <div>
                  <p className="font-bold text-[var(--sb-navy)]">Drag &amp; drop your resume</p>
                  <p className="text-sm text-[var(--sb-secondary-text)] mt-1">or click to browse files</p>
                </div>
                <p className="label-tech text-[var(--sb-secondary-text)] text-xs">PDF or DOCX — Max 5 MB</p>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-5 py-2 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                  <FileText className="h-4 w-4" /> Browse Files
                  <input type="file" accept=".pdf,.docx" className="sr-only" onChange={handleInputChange} />
                </label>
              </div>
            )}
          </div>

          {/* Resume history */}
          <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white overflow-hidden">
            <div className="px-4 py-3 border-b-2 border-[var(--sb-navy)] bg-[var(--sb-cream)]">
              <p className="label-tech text-[var(--sb-navy)] font-semibold">Resume History</p>
            </div>

            {listLoading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--sb-blue)]" />
              </div>
            ) : listError ? (
              <div className="p-4 text-sm text-[var(--sb-red)]">{listError}</div>
            ) : resumes.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--sb-secondary-text)]">
                No resumes uploaded yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {resumes.map((r) => (
                  <li
                    key={r._id}
                    onClick={() => setSelected(r)}
                    className={`px-4 py-3 cursor-pointer hover:bg-[var(--sb-cream)] transition-colors ${selected?._id === r._id ? "bg-[var(--sb-blue)]/5 border-l-4 border-[var(--sb-blue)]" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-[var(--sb-blue)] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--sb-navy)] truncate">{r.originalFileName}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StatusBadge status={r.status} />
                          <span className="text-xs text-[var(--sb-secondary-text)]">{formatDate(r.createdAt)}</span>
                          <span className="text-xs text-[var(--sb-secondary-text)]">{formatBytes(r.fileSize)}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Right column: extracted data ──────────────────────────────── */}
        <div>
          {!selected ? (
            <div className="rounded-xl border-2 border-dashed border-[var(--sb-navy)]/20 p-16 text-center">
              <FileText className="w-12 h-12 text-[var(--sb-secondary-text)] mx-auto mb-4 opacity-40" />
              <p className="text-[var(--sb-secondary-text)]">Upload a resume to see AI-extracted data here.</p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white overflow-hidden shadow-navy-sm">
              {/* Header */}
              <div className="px-5 py-4 border-b-2 border-[var(--sb-navy)] bg-[var(--sb-cream)] flex items-center gap-3 flex-wrap">
                <FileText className="w-5 h-5 text-[var(--sb-blue)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[var(--sb-navy)] text-sm truncate">{selected.originalFileName}</p>
                  <p className="text-xs text-[var(--sb-secondary-text)]">
                    {formatBytes(selected.fileSize)} · {selected.fileType.toUpperCase()} · {formatDate(selected.createdAt)}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
                <div className="flex items-center gap-2">
                  {(selected.status === "failed" || selected.status === "completed") && (
                    <button
                      onClick={() => handleReprocess(selected._id)}
                      className="inline-flex items-center gap-1 rounded-xl border-2 border-[var(--sb-navy)] px-3 py-1.5 text-xs font-bold text-[var(--sb-navy)] hover:bg-[var(--sb-cream)] transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reprocess
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[var(--sb-red)] px-3 py-1.5 text-xs font-bold text-[var(--sb-red)] hover:bg-[var(--sb-red)]/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-6">

                {/* Processing states */}
                {(selected.status === "uploaded" || selected.status === "processing") && (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-14 h-14 rounded-full bg-[var(--sb-blue)]/10 border-2 border-[var(--sb-blue)] flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-[var(--sb-blue)] animate-spin" />
                    </div>
                    <p className="font-bold text-[var(--sb-navy)]">AI is analysing your resume…</p>
                    <p className="text-sm text-[var(--sb-secondary-text)]">This usually takes 10–30 seconds. This page updates automatically.</p>
                  </div>
                )}

                {selected.status === "failed" && (
                  <div className="rounded-xl border-2 border-[var(--sb-red)] bg-[var(--sb-red)]/5 px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-[var(--sb-red)]" />
                      <p className="font-bold text-[var(--sb-red)] text-sm">Processing Failed</p>
                    </div>
                    <p className="text-xs text-[var(--sb-secondary-text)]">
                      {selected.processingError ?? "An unknown error occurred."}
                    </p>
                    <p className="text-xs text-[var(--sb-secondary-text)] mt-2">
                      Click <span className="font-semibold">Reprocess</span> to try again.
                    </p>
                  </div>
                )}

                {selected.status === "completed" && selected.extractedData && (() => {
                  const { skills, education, experience, projects, certifications } = selected.extractedData;
                  const skillGroups = groupedSkills(skills);

                  return (
                    <>
                      {/* Summary strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Skills", val: skills.length, color: "text-[var(--sb-blue)]" },
                          { label: "Education", val: education.length, color: "text-[var(--sb-green)]" },
                          { label: "Experience", val: experience.length, color: "text-[var(--sb-orange)]" },
                          { label: "Projects", val: projects.length, color: "text-[var(--sb-purple)]" },
                        ].map((m) => (
                          <div key={m.label} className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-cream)] p-3 text-center">
                            <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
                            <p className="label-tech text-[var(--sb-secondary-text)] text-xs mt-0.5">{m.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="space-y-3">
                          <SectionHeader
                            icon={<Briefcase className="h-4 w-4 text-[var(--sb-blue)]" />}
                            label="Skills"
                            count={skills.length}
                          />
                          {Object.entries(skillGroups).map(([cat, catSkills]) => {
                            const expanded = expandedSkillCategories[cat] !== false;
                            return (
                              <div key={cat}>
                                <button
                                  onClick={() => toggleCategory(cat)}
                                  className="flex items-center gap-2 w-full text-left mb-2"
                                >
                                  <span className="text-xs font-bold text-[var(--sb-navy)] label-tech">{cat}</span>
                                  <span className="text-xs text-[var(--sb-secondary-text)]">({catSkills.length})</span>
                                  {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                                </button>
                                {expanded && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {catSkills.map((s, i) => (
                                      <span
                                        key={i}
                                        title={s.evidence ? `Evidence: ${s.evidence}` : undefined}
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-default ${skillColor(cat)}`}
                                      >
                                        {s.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Education */}
                      {education.length > 0 && (
                        <div className="space-y-3">
                          <SectionHeader
                            icon={<GraduationCap className="h-4 w-4 text-[var(--sb-green)]" />}
                            label="Education"
                            count={education.length}
                          />
                          <ul className="space-y-2">
                            {education.map((e, i) => (
                              <li key={i} className="rounded-xl border border-gray-100 bg-[var(--sb-cream)] p-3">
                                <p className="font-semibold text-[var(--sb-navy)] text-sm">{e.qualification || "—"}</p>
                                <p className="text-xs text-[var(--sb-secondary-text)]">{e.institution}</p>
                                {e.fieldOfStudy && <p className="text-xs text-[var(--sb-secondary-text)]">{e.fieldOfStudy}</p>}
                                {e.graduationYear && (
                                  <p className="text-xs font-semibold text-[var(--sb-blue)] mt-1">Class of {e.graduationYear}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Experience */}
                      {experience.length > 0 && (
                        <div className="space-y-3">
                          <SectionHeader
                            icon={<Briefcase className="h-4 w-4 text-[var(--sb-orange)]" />}
                            label="Experience"
                            count={experience.length}
                          />
                          <ul className="space-y-2">
                            {experience.map((e, i) => (
                              <li key={i} className="rounded-xl border border-gray-100 bg-[var(--sb-cream)] p-3">
                                <p className="font-semibold text-[var(--sb-navy)] text-sm">{e.designation}</p>
                                <p className="text-xs font-medium text-[var(--sb-blue)]">{e.organization}</p>
                                {(e.startDate || e.endDate) && (
                                  <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5">
                                    {e.startDate ?? "?"} → {e.endDate ?? "Present"}
                                  </p>
                                )}
                                {e.description && (
                                  <p className="text-xs text-[var(--sb-secondary-text)] mt-1 line-clamp-2">{e.description}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Projects */}
                      {projects.length > 0 && (
                        <div className="space-y-3">
                          <SectionHeader
                            icon={<FolderGit2 className="h-4 w-4 text-[var(--sb-purple)]" />}
                            label="Projects"
                            count={projects.length}
                          />
                          <ul className="space-y-2">
                            {projects.map((p, i) => (
                              <li key={i} className="rounded-xl border border-gray-100 bg-[var(--sb-cream)] p-3">
                                <p className="font-semibold text-[var(--sb-navy)] text-sm">{p.name}</p>
                                {p.description && <p className="text-xs text-[var(--sb-secondary-text)] mt-0.5 line-clamp-2">{p.description}</p>}
                                {p.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {p.technologies.map((t, ti) => (
                                      <span key={ti} className="rounded-full bg-[var(--sb-purple)]/10 text-[var(--sb-purple)] px-2 py-0.5 text-xs font-semibold">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certifications */}
                      {certifications.length > 0 && (
                        <div className="space-y-3">
                          <SectionHeader
                            icon={<Award className="h-4 w-4 text-[var(--sb-orange)]" />}
                            label="Certifications"
                            count={certifications.length}
                          />
                          <ul className="space-y-2">
                            {certifications.map((c, i) => (
                              <li key={i} className="rounded-xl border border-gray-100 bg-[var(--sb-cream)] p-3 flex items-start gap-3">
                                <Award className="w-4 h-4 text-[var(--sb-orange)] shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-[var(--sb-navy)] text-sm">{c.name}</p>
                                  <p className="text-xs text-[var(--sb-secondary-text)]">{c.issuer}</p>
                                  {c.issueDate && <p className="text-xs text-[var(--sb-blue)] mt-0.5">{c.issueDate}</p>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Empty state if extraction found nothing */}
                      {skills.length === 0 && education.length === 0 && experience.length === 0 &&
                        projects.length === 0 && certifications.length === 0 && (
                        <div className="text-center py-8 text-sm text-[var(--sb-secondary-text)]">
                          No structured information could be extracted. Try reprocessing or uploading a different resume.
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
