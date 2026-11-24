"use client";


import { useState, useCallback } from "react";
import { mockResume } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { DemoBanner } from "@/components/shared/demo-banner";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";

type UploadState = "empty" | "dragging" | "selected" | "error";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumePage() {
  const [uploadState, setUploadState] = useState<UploadState>("empty");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const validateFile = (f: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setError("Only PDF or DOCX files are supported.");
      setUploadState("error");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5 MB.");
      setUploadState("error");
      return false;
    }
    return true;
  };

  const handleFile = useCallback((f: File) => {
    if (!validateFile(f)) return;
    setFile(f);
    setUploadState("selected");
    setError("");
    setShowPreview(true);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("empty");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    setUploadState("empty");
    setShowPreview(false);
    setError("");
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        badge="RESUME INTELLIGENCE"
        title="Resume Intelligence"
        highlight="Intelligence"
        description="Upload your resume and let AI extract your skills, experience, and education automatically."
      />
      <DemoBanner message="In this demo, resume preview shows mock extracted data. Real AI extraction will be enabled in Phase 4." />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Uploader */}
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setUploadState("dragging"); }}
            onDragLeave={() => setUploadState(file ? "selected" : "empty")}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-10 text-center transition-all ${
              uploadState === "dragging" ? "border-[var(--sb-blue)] bg-[var(--sb-blue)]/5" :
              uploadState === "error" ? "border-[var(--sb-red)] bg-[var(--sb-red)]/5" :
              uploadState === "selected" ? "border-[var(--sb-green)] bg-[var(--sb-green)]/5" :
              "border-[var(--sb-navy)]/30 bg-white hover:border-[var(--sb-blue)] hover:bg-[var(--sb-blue)]/5"
            } cursor-pointer`}
          >
            {uploadState === "selected" && file ? (
              <div className="space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[var(--sb-green)] mx-auto" />
                <div>
                  <p className="font-bold text-[var(--sb-navy)]">{file.name}</p>
                  <p className="text-sm text-[var(--sb-secondary-text)]">{formatBytes(file.size)}</p>
                </div>
                <button
                  onClick={removeFile}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[var(--sb-red)] px-4 py-1.5 text-xs font-bold text-[var(--sb-red)] hover:bg-[var(--sb-red)]/5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            ) : uploadState === "error" ? (
              <div className="space-y-2">
                <AlertCircle className="h-10 w-10 text-[var(--sb-red)] mx-auto" />
                <p className="font-bold text-[var(--sb-red)]">Upload Error</p>
                <p className="text-sm text-[var(--sb-secondary-text)]">{error}</p>
                <button onClick={() => setUploadState("empty")} className="text-xs font-semibold text-[var(--sb-blue)] hover:underline">Try again</button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 text-[var(--sb-secondary-text)] mx-auto" />
                <div>
                  <p className="font-bold text-[var(--sb-navy)]">Drag & drop your resume</p>
                  <p className="text-sm text-[var(--sb-secondary-text)] mt-1">or click to browse files</p>
                </div>
                <p className="label-tech text-[var(--sb-secondary-text)]">PDF or DOCX — Max 5 MB</p>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-5 py-2 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] transition-colors">
                  <FileText className="h-4 w-4" />
                  Browse Files
                  <input type="file" accept=".pdf,.docx" className="sr-only" onChange={handleInputChange} />
                </label>
              </div>
            )}
          </div>

          <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] p-4">
            <p className="label-tech text-[var(--sb-navy)] mb-2">What happens next?</p>
            <ul className="space-y-1.5 text-sm text-[var(--sb-secondary-text)]">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--sb-blue)]" />AI extracts skills, education, experience</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--sb-blue)]" />Review and edit extracted information</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--sb-blue)]" />Select target occupation and get matched</li>
            </ul>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-[var(--sb-navy)]">
              <FileText className="h-5 w-5 text-[var(--sb-blue)]" />
              <div>
                <p className="font-bold text-[var(--sb-navy)] text-sm">{mockResume.fileName}</p>
                <p className="label-tech text-[var(--sb-secondary-text)]">AI-Extracted Preview (Demo)</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-lg bg-[var(--sb-blue)]/10 p-1.5"><Briefcase className="h-3.5 w-3.5 text-[var(--sb-blue)]" /></span>
                <p className="label-tech text-[var(--sb-navy)]">Skills Identified</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {mockResume.skills.map((s) => (
                  <span key={s} className="rounded-full bg-[var(--sb-blue)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--sb-blue)]">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-lg bg-[var(--sb-green)]/10 p-1.5"><GraduationCap className="h-3.5 w-3.5 text-[var(--sb-green)]" /></span>
                <p className="label-tech text-[var(--sb-navy)]">Education</p>
              </div>
              <ul className="space-y-1">
                {mockResume.education.map((e: string, i: number) => <li key={i} className="text-xs text-[var(--sb-secondary-text)]">{e}</li>)}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-lg bg-[var(--sb-orange)]/10 p-1.5"><Briefcase className="h-3.5 w-3.5 text-[var(--sb-orange)]" /></span>
                <p className="label-tech text-[var(--sb-navy)]">Experience</p>
              </div>
              <ul className="space-y-1">
                {mockResume.experience.map((e: string, i: number) => <li key={i} className="text-xs text-[var(--sb-secondary-text)]">{e}</li>)}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-lg bg-[var(--sb-purple)]/10 p-1.5"><FolderGit2 className="h-3.5 w-3.5 text-[var(--sb-purple)]" /></span>
                <p className="label-tech text-[var(--sb-navy)]">Projects</p>
              </div>
              <ul className="space-y-1">
                {mockResume.projects.map((p: string, i: number) => <li key={i} className="text-xs text-[var(--sb-secondary-text)]">{p}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
