"use client";

/**
 * SkillBridge AI — Admin Occupation Management
 *
 * Full CRUD interface for the occupation catalogue.
 * Requires admin role — the server enforces this; the page also
 * redirects non-admins on the client side.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Upload,
  History,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Lock,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { adminOccupationsApi } from "@/services/api-client";
import type { ApiOccupation, ApiPagination } from "@/services/api-client";
import Link from "next/link";

// ─── Toast ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";
function Toast({ msg, type, onClose }: { msg: string; type: ToastType; onClose: () => void }) {
  const colors = {
    success: "bg-[var(--sb-green)] text-white",
    error: "bg-[var(--sb-red)] text-white",
    info: "bg-[var(--sb-blue)] text-white",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg font-semibold text-sm ${colors[type]}`}>
      <span>{msg}</span>
      <button onClick={onClose}><X className="h-4 w-4" /></button>
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

interface OccFormState {
  title: string;
  sector: string;
  subSector: string;
  description: string;
  nsqfLevel: string;
  minimumEducation: string;
  qualificationCriteria: string;
  verificationStatus: "demo" | "imported" | "verified" | "pending";
  sourceName: string;
  sourceUrl: string;
}

const EMPTY_FORM: OccFormState = {
  title: "",
  sector: "",
  subSector: "",
  description: "",
  nsqfLevel: "",
  minimumEducation: "",
  qualificationCriteria: "",
  verificationStatus: "pending",
  sourceName: "Admin Entry",
  sourceUrl: "",
};

function OccupationModal({
  token,
  occ,
  onClose,
  onSaved,
}: {
  token: string;
  occ?: ApiOccupation;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<OccFormState>(
    occ
      ? {
          title: occ.title,
          sector: typeof occ.sector === "object" ? occ.sector.name : occ.sector ?? "",
          subSector: occ.subSector ?? "",
          description: occ.description ?? "",
          nsqfLevel: occ.nsqfLevel ? String(occ.nsqfLevel) : "",
          minimumEducation: occ.minimumEducation ?? "",
          qualificationCriteria: occ.qualificationCriteria ?? "",
          verificationStatus: occ.verificationStatus,
          sourceName: occ.sourceInformation?.name ?? "Admin Entry",
          sourceUrl: occ.sourceInformation?.url ?? "",
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (field: keyof OccFormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.sector.trim()) {
      setErr("Title and Sector are required.");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        title: form.title,
        sector: form.sector,
        subSector: form.subSector || undefined,
        description: form.description || undefined,
        nsqfLevel: form.nsqfLevel ? parseInt(form.nsqfLevel, 10) : undefined,
        minimumEducation: form.minimumEducation || undefined,
        qualificationCriteria: form.qualificationCriteria || undefined,
        verificationStatus: form.verificationStatus,
        sourceInformation: {
          name: form.sourceName || "Admin Entry",
          url: form.sourceUrl || undefined,
        },
      };

      if (occ) {
        await adminOccupationsApi.update(token, occ._id, payload);
      } else {
        await adminOccupationsApi.create(token, payload);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-card)] px-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border-2 border-[var(--sb-navy)] shadow-navy w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b-2 border-[var(--sb-navy)]">
          <h2 className="text-lg font-extrabold text-[var(--sb-navy)]">
            {occ ? "Edit Occupation" : "Add Occupation"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {err && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} placeholder="e.g. Full Stack Developer" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Sector *</label>
              <input value={form.sector} onChange={(e) => set("sector", e.target.value)} required className={inputCls} placeholder="e.g. IT-ITeS" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Sub-Sector</label>
              <input value={form.subSector} onChange={(e) => set("subSector", e.target.value)} className={inputCls} placeholder="e.g. Software Development" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">NSQF Level (1–10)</label>
              <input type="number" min="1" max="10" value={form.nsqfLevel} onChange={(e) => set("nsqfLevel", e.target.value)} className={inputCls} placeholder="e.g. 7" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Verification Status</label>
              <select value={form.verificationStatus} onChange={(e) => set("verificationStatus", e.target.value as OccFormState["verificationStatus"])} className={inputCls}>
                <option value="pending">Pending</option>
                <option value="demo">Demo</option>
                <option value="imported">Imported</option>
                <option value="verified">Verified</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} placeholder="Brief description of the occupation" />
            </div>
            <div className="col-span-2">
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Minimum Education</label>
              <input value={form.minimumEducation} onChange={(e) => set("minimumEducation", e.target.value)} className={inputCls} placeholder="e.g. 10+2 or equivalent" />
            </div>
            <div className="col-span-2">
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Qualification Criteria</label>
              <textarea rows={2} value={form.qualificationCriteria} onChange={(e) => set("qualificationCriteria", e.target.value)} className={inputCls} placeholder="Entry requirements and assessment criteria" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Source Name</label>
              <input value={form.sourceName} onChange={(e) => set("sourceName", e.target.value)} className={inputCls} placeholder="e.g. Admin Entry" />
            </div>
            <div>
              <label className="label-tech text-xs text-[var(--sb-navy)] mb-1 block">Source URL</label>
              <input type="url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} className={inputCls} placeholder="https://…" />
            </div>
          </div>

          {form.verificationStatus === "verified" && (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-2 text-xs text-yellow-800">
              ⚠ Only mark as &quot;Verified&quot; if you have confirmed this record against an official government source (NSDC, NQR, SIDH).
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] py-2.5 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {occ ? "Save Changes" : "Create Occupation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Import Panel ─────────────────────────────────────────────────────────────

function ImportPanel({ token, onImported }: { token: string; onImported: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await adminOccupationsApi.import(token, file, true);
      setPreview(res.data);
      setCommitted(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Preview failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit() {
    if (!file) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await adminOccupationsApi.import(token, file, false);
      setPreview(res.data);
      setCommitted(true);
      onImported();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  type ImportResult = {
    total?: number;
    inserted?: number;
    updated?: number;
    failed?: number;
    errors?: { row: number; message: string }[];
    preview?: { row: number; action: string; title: string; reason?: string }[];
  };

  const pv = preview as ImportResult | null;

  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 space-y-4">
      <h3 className="font-extrabold text-[var(--sb-navy)]">Import Occupations</h3>
      <p className="text-xs text-[var(--sb-secondary-text)]">
        Upload a CSV, JSON, or Excel file. Required columns: <code className="bg-gray-100 px-1 rounded">title</code>, <code className="bg-gray-100 px-1 rounded">sector</code>. Optional: nsqfLevel, description, skills (comma-separated), sourceName, sourceUrl, verificationStatus.
      </p>

      <div className="flex gap-3 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-[var(--sb-navy)] bg-[var(--sb-card)] px-4 py-2 text-sm font-semibold text-[var(--sb-navy)] hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          {file ? file.name : "Choose file (CSV / JSON / Excel)"}
          <input type="file" className="hidden" accept=".csv,.json,.xlsx,.xls" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); setCommitted(false); }} />
        </label>
        {file && !committed && (
          <button onClick={handlePreview} disabled={loading} className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-white px-4 py-2 text-sm font-bold text-[var(--sb-navy)] hover:bg-gray-50 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Preview
          </button>
        )}
      </div>

      {err && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{err}</div>
      )}

      {pv && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total", value: pv.total ?? 0, color: "text-[var(--sb-navy)]" },
              { label: "Insert", value: pv.inserted ?? 0, color: "text-[var(--sb-green)]" },
              { label: "Update", value: pv.updated ?? 0, color: "text-[var(--sb-blue)]" },
              { label: "Failed", value: pv.failed ?? 0, color: "text-[var(--sb-red)]" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="label-tech text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {pv.errors && pv.errors.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-1 max-h-32 overflow-y-auto">
              <p className="text-xs font-bold text-red-700 mb-2">Errors ({pv.errors.length})</p>
              {pv.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-600">Row {e.row}: {e.message}</p>
              ))}
            </div>
          )}

          {!committed && (pv.inserted ?? 0) + (pv.updated ?? 0) > 0 && (
            <button
              onClick={handleCommit}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-green)] px-5 py-2.5 text-sm font-bold text-white shadow-navy-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Commit Import ({(pv.inserted ?? 0) + (pv.updated ?? 0)} records)
            </button>
          )}

          {committed && (
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--sb-green)]">
              <CheckCircle2 className="h-5 w-5" /> Import committed successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "catalogue" | "import" | "history";

export default function AdminOccupationsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [tab, setTab] = useState<TabId>("catalogue");
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const [occupations, setOccupations] = useState<ApiOccupation[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>({ total: 0, page: 1, limit: 20, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<{ open: boolean; occ?: ApiOccupation }>({ open: false });
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const [importHistory, setImportHistory] = useState<unknown[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Get token + verify admin role via metadata
  useEffect(() => {
    getToken().then(async (tok) => {
      if (!tok) { setAuthError(true); setAuthLoading(false); return; }
      setToken(tok);
      setAuthLoading(false);
    }).catch(() => { setAuthError(true); setAuthLoading(false); });
  }, [getToken]);

  const showToast = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load occupations
  const loadOccupations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "15" };
      if (search) params.search = search;
      const res = await adminOccupationsApi.list(token, params);
      setOccupations(res.data);
      setPagination(res.pagination);
    } catch {
      showToast("Failed to load occupations.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    if (tab === "catalogue" && token) loadOccupations();
  }, [tab, loadOccupations, token]);

  // Load import history
  const loadHistory = useCallback(async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await adminOccupationsApi.getImportHistory(token);
      setImportHistory(res.data);
    } catch {
      showToast("Failed to load import history.", "error");
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (tab === "history" && token) loadHistory();
  }, [tab, loadHistory, token]);

  async function handleDeactivate(id: string) {
    if (!token || !confirm("Deactivate this occupation? It will be hidden from public listings.")) return;
    setDeactivating(id);
    try {
      await adminOccupationsApi.deactivate(token, id);
      showToast("Occupation deactivated.", "success");
      loadOccupations();
    } catch {
      showToast("Failed to deactivate.", "error");
    } finally {
      setDeactivating(null);
    }
  }

  // ── Loading / Auth states ──

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-[var(--sb-blue)] animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Lock className="h-12 w-12 text-[var(--sb-red)]" />
        <p className="text-lg font-extrabold text-[var(--sb-navy)]">Admin Access Required</p>
        <p className="text-sm text-[var(--sb-secondary-text)]">You must be signed in with an admin account to access this page.</p>
        <button onClick={() => router.push("/admin")} className="rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-6 py-2 text-sm font-bold text-white">
          Go Back
        </button>
      </div>
    );
  }

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "catalogue", label: "Catalogue", icon: <Briefcase className="h-4 w-4" /> },
    { id: "import", label: "Import Data", icon: <Upload className="h-4 w-4" /> },
    { id: "history", label: "Import History", icon: <History className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {modal.open && token && (
        <OccupationModal
          token={token}
          occ={modal.occ}
          onClose={() => setModal({ open: false })}
          onSaved={() => { showToast(modal.occ ? "Occupation updated." : "Occupation created.", "success"); loadOccupations(); }}
        />
      )}

      <PageHeader
        badge="ADMIN"
        title="Occupation Catalogue"
        highlight="Occupation"
        description="Manage the occupation database — add, edit, deactivate and import records."
        actions={
          <Link href="/admin" className="text-xs font-semibold text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] underline">
            ← Admin Home
          </Link>
        }
      />

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl border-2 border-[var(--sb-orange)] bg-[var(--sb-orange)]/10 px-5 py-3">
        <AlertTriangle className="h-5 w-5 text-[var(--sb-orange)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--sb-navy)]">
          <span className="font-bold">Data integrity: </span>
          Only mark records as &quot;Verified&quot; when you have an official source (NSDC, NQR, SIDH). Never fabricate QP codes or NSQF levels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border-2 border-[var(--sb-navy)] bg-white p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${tab === t.id ? "bg-[var(--sb-navy)] text-white" : "text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)]"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Catalogue tab ── */}
      {tab === "catalogue" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--sb-secondary-text)]" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search occupations…"
                className="w-full rounded-xl border-2 border-[var(--sb-navy)] bg-white pl-9 pr-3 py-2 text-sm font-medium text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] outline-none focus:border-[var(--sb-blue)]"
              />
            </div>
            <button onClick={loadOccupations} className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-2 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setModal({ open: true })}
              className="flex items-center gap-2 rounded-xl border-2 border-[var(--sb-navy)] bg-[var(--sb-blue)] px-4 py-2 text-sm font-bold text-white shadow-navy-sm hover:bg-[var(--sb-blue-hover)]"
            >
              <Plus className="h-4 w-4" /> Add Occupation
            </button>
          </div>

          <p className="label-tech text-xs text-[var(--sb-secondary-text)]">
            {pagination.total} total records (all statuses, including inactive)
          </p>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-[var(--sb-blue)] animate-spin" />
            </div>
          ) : occupations.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No occupations yet"
              description="Click 'Add Occupation' to create the first record, or use the Import tab to bulk-upload."
            />
          ) : (
            <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white overflow-hidden shadow-navy-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b-2 border-[var(--sb-navy)] bg-[var(--sb-cream)]">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Title</th>
                      <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Sector</th>
                      <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">NSQF</th>
                      <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Status</th>
                      <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Active</th>
                      <th className="text-right px-4 py-3 font-bold text-[var(--sb-navy)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {occupations.map((occ) => {
                      const sectorName = typeof occ.sector === "object" ? occ.sector.name : occ.sector;
                      const vs = occ.verificationStatus;
                      const statusColor: "demo" | "success" | "warning" | "info" = vs === "verified" ? "success" : vs === "demo" ? "demo" : vs === "imported" ? "info" : "warning";
                      return (
                        <tr key={occ._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-[var(--sb-navy)] truncate max-w-[200px]">{occ.title}</p>
                            {occ.qpCode && <p className="label-tech text-xs text-gray-500">{occ.qpCode}</p>}
                          </td>
                          <td className="px-4 py-3 text-[var(--sb-secondary-text)]">{sectorName}</td>
                          <td className="px-4 py-3">
                            {occ.nsqfLevel ? (
                              <span className="rounded-full bg-[var(--sb-green)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--sb-green)]">
                                {occ.nsqfLevel}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={statusColor} label={vs} />
                          </td>
                          <td className="px-4 py-3">
                            {occ.isActive
                              ? <CheckCircle2 className="h-4 w-4 text-[var(--sb-green)]" />
                              : <XCircle className="h-4 w-4 text-gray-400" />}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setModal({ open: true, occ })}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5 text-[var(--sb-navy)]" />
                              </button>
                              {occ.isActive && (
                                <button
                                  onClick={() => handleDeactivate(occ._id)}
                                  disabled={deactivating === occ._id}
                                  className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-40"
                                  title="Deactivate"
                                >
                                  {deactivating === occ._id
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                                    : <Trash2 className="h-3.5 w-3.5 text-red-500" />}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100">
                  <p className="label-tech text-xs text-[var(--sb-secondary-text)]">
                    Page {page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                      className="rounded-xl border-2 border-[var(--sb-navy)] px-3 py-1.5 text-xs font-bold disabled:opacity-40 hover:bg-gray-50">
                      Previous
                    </button>
                    <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}
                      className="rounded-xl border-2 border-[var(--sb-navy)] px-3 py-1.5 text-xs font-bold disabled:opacity-40 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Import tab ── */}
      {tab === "import" && token && (
        <ImportPanel token={token} onImported={() => { showToast("Import committed. Switch to Catalogue to verify.", "success"); }} />
      )}

      {/* ── History tab ── */}
      {tab === "history" && (
        <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white overflow-hidden shadow-navy-sm">
          {historyLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-[var(--sb-blue)] animate-spin" />
            </div>
          ) : importHistory.length === 0 ? (
            <div className="p-10 text-center">
              <History className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-[var(--sb-secondary-text)]">No import history yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-[var(--sb-navy)] bg-[var(--sb-cream)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Source</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Type</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Total</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Inserted</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Updated</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Failed</th>
                    <th className="text-left px-4 py-3 font-bold text-[var(--sb-navy)]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(importHistory as Record<string, unknown>[]).map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-[var(--sb-navy)]">{String(h.sourceName ?? "—")}</td>
                      <td className="px-4 py-3 label-tech text-gray-500">{String(h.fileType ?? "—").toUpperCase()}</td>
                      <td className="px-4 py-3">{String(h.totalRecords ?? 0)}</td>
                      <td className="px-4 py-3 text-[var(--sb-green)] font-bold">{String(h.inserted ?? 0)}</td>
                      <td className="px-4 py-3 text-[var(--sb-blue)] font-bold">{String(h.updated ?? 0)}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{String(h.failed ?? 0)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {h.createdAt ? new Date(String(h.createdAt)).toLocaleString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Admin info */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-5 py-3">
        <p className="text-xs text-gray-500">
          Signed in as <span className="font-bold">{user?.primaryEmailAddress?.emailAddress ?? "admin"}</span>.
          All actions are recorded. Server enforces admin role via MongoDB — client role claims are not trusted.
        </p>
      </div>
    </div>
  );
}
