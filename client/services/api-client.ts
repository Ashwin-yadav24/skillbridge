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
