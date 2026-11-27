/**
 * SkillBridge AI — API Client
 *
 * Thin wrapper around fetch that:
 *  - Prefixes the base API URL
 *  - Attaches the Clerk session token as Bearer
 *  - Returns typed JSON responses
 *  - Throws ApiError for non-2xx responses
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  token: string | null,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const url = `${baseUrl}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string }).message ?? res.statusText);
  }

  return data as T;
}

// ── Typed user shape returned by the API ──────────────────────────────────

export interface ApiUser {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "student" | "admin";
  education: {
    qualification?: string;
    institution?: string;
    graduationYear?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  education?: {
    qualification?: string;
    institution?: string;
    graduationYear?: number;
  };
}

// ── User endpoints ─────────────────────────────────────────────────────────

// ── Resume types ──────────────────────────────────────────────────────────

export interface ApiSkill {
  name: string;
  category: string;
  evidence: string;
}

export interface ApiEducation {
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number | null;
}

export interface ApiExperience {
  organization: string;
  designation: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
}

export interface ApiProject {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface ApiCertification {
  name: string;
  issuer: string;
  issueDate: string | null;
}

export interface ApiExtractedData {
  skills: ApiSkill[];
  education: ApiEducation[];
  experience: ApiExperience[];
  projects: ApiProject[];
  certifications: ApiCertification[];
}

export interface ApiResume {
  _id: string;
  userId: string;
  originalFileName: string;
  fileType: "pdf" | "docx";
  fileSize: number;
  status: "uploaded" | "processing" | "completed" | "failed";
  extractedData: ApiExtractedData | null;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Resume API helpers ────────────────────────────────────────────────────

export const resumesApi = {
  /** POST /api/resumes — upload a resume file */
  upload: async (token: string, file: File): Promise<{ success: boolean; data: ApiResume }> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch(`${baseUrl}/api/resumes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({})) as { success: boolean; data: ApiResume; message?: string };
    if (!res.ok) throw new ApiError(res.status, data.message ?? res.statusText);
    return data;
  },

  /** GET /api/resumes — list user's resumes */
  list: (token: string) =>
    request<{ success: boolean; data: ApiResume[] }>("/api/resumes", token),

  /** GET /api/resumes/:id */
  getById: (token: string, id: string) =>
    request<{ success: boolean; data: ApiResume }>(`/api/resumes/${id}`, token),

  /** DELETE /api/resumes/:id */
  delete: (token: string, id: string) =>
    request<{ success: boolean; message: string }>(`/api/resumes/${id}`, token, {
      method: "DELETE",
    }),

  /** POST /api/resumes/:id/reprocess */
  reprocess: (token: string, id: string) =>
    request<{ success: boolean; message: string }>(`/api/resumes/${id}/reprocess`, token, {
      method: "POST",
    }),
};

// ── Occupation types ───────────────────────────────────────────────────────

export interface ApiSector {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiSchemeAssociation {
  schemeName: string;
  schemeCode?: string;
  evidenceUrl?: string;
  verified: boolean;
}

export interface ApiOccupationSource {
  name: string;
  url?: string;
  identifier?: string;
  importedAt?: string;
  verifiedAt?: string;
}

export interface ApiOccupation {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  sector: ApiSector | string;
  subSector?: string;
  qualificationCode?: string;
  qpCode?: string;
  qualificationTitle?: string;
  nsqfLevel?: number;
  qualificationCriteria?: string;
  minimumEducation?: string;
  relatedCourses: string[];
  schemeAssociations: ApiSchemeAssociation[];
  sourceInformation: ApiOccupationSource;
  verificationStatus: "demo" | "imported" | "verified" | "pending";
  lastVerifiedAt?: string;
  isActive: boolean;
  competencyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOccupationSkill {
  _id: string;
  occupationId: string;
  skillId: {
    _id: string;
    name: string;
    category: string;
    description?: string;
    normalizedName: string;
  };
  competencyDescription?: string;
  importanceWeight: number;
  proficiencyExpectation: "beginner" | "intermediate" | "advanced" | "expert";
  mandatory: boolean;
  sourceReference?: string;
}

export interface ApiPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface OccupationListResponse {
  success: boolean;
  data: ApiOccupation[];
  pagination: ApiPagination;
}

// ── Occupation API helpers ─────────────────────────────────────────────────

export const occupationsApi = {
  /** GET /api/occupations — list with optional filters */
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<OccupationListResponse>(`/api/occupations${qs}`, null);
  },

  /** GET /api/occupations/sectors — available sectors */
  getSectors: () =>
    request<{ success: boolean; data: ApiSector[] }>("/api/occupations/sectors", null),

  /** GET /api/occupations/:id — single occupation */
  getById: (id: string) =>
    request<{ success: boolean; data: ApiOccupation }>(`/api/occupations/${id}`, null),

  /** GET /api/occupations/:id/skills — competencies */
  getSkills: (id: string) =>
    request<{ success: boolean; data: ApiOccupationSkill[] }>(
      `/api/occupations/${id}/skills`,
      null
    ),
};

// ── Admin occupation API helpers ───────────────────────────────────────────

export const adminOccupationsApi = {
  list: (token: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<OccupationListResponse>(`/api/admin/occupations${qs}`, token);
  },

  create: (token: string, body: Partial<ApiOccupation>) =>
    request<{ success: boolean; data: ApiOccupation }>("/api/admin/occupations", token, {
      method: "POST",
      body,
    }),

  update: (token: string, id: string, body: Partial<ApiOccupation>) =>
    request<{ success: boolean; data: ApiOccupation }>(
      `/api/admin/occupations/${id}`,
      token,
      { method: "PATCH", body }
    ),

  deactivate: (token: string, id: string) =>
    request<{ success: boolean; message: string }>(
      `/api/admin/occupations/${id}`,
      token,
      { method: "DELETE" }
    ),

  import: async (
    token: string,
    file: File,
    preview = false
  ): Promise<{ success: boolean; dryRun: boolean; data: unknown }> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
    const formData = new FormData();
    formData.append("file", file);
    const url = `${baseUrl}/api/admin/occupations/import${preview ? "?preview=true" : ""}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => ({})) as {
      success: boolean;
      dryRun: boolean;
      data: unknown;
      message?: string;
    };
    if (!res.ok) throw new ApiError(res.status, data.message ?? res.statusText);
    return data;
  },

  getImportHistory: (token: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: unknown[]; pagination: ApiPagination }>(
      `/api/admin/import-history${qs}`,
      token
    );
  },

  listSkills: (token: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: unknown[]; pagination: ApiPagination }>(
      `/api/admin/occupations/skills${qs}`,
      token
    );
  },

  mapSkill: (
    token: string,
    occupationId: string,
    body: {
      skillId: string;
      mandatory?: boolean;
      proficiencyExpectation?: string;
      importanceWeight?: number;
      competencyDescription?: string;
    }
  ) =>
    request<{ success: boolean; data: unknown }>(
      `/api/admin/occupations/${occupationId}/skills`,
      token,
      { method: "POST", body }
    ),
};

export const usersApi = {
  /** GET /api/users/me — fetch the signed-in user's profile */
  getMe: (token: string) =>
    request<{ success: boolean; data: ApiUser }>("/api/users/me", token),

  /** PATCH /api/users/me — update permitted profile fields */
  updateMe: (token: string, payload: UpdateUserPayload) =>
    request<{ success: boolean; data: ApiUser }>("/api/users/me", token, {
      method: "PATCH",
      body: payload,
    }),
};
