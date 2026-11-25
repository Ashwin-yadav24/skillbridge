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
