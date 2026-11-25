"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * SSO Callback — handles OAuth redirect completions (Google, GitHub, etc.)
 * Clerk processes the token and redirects to /dashboard on success.
 */
export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[var(--sb-cream)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[var(--sb-blue)]/30 border-t-[var(--sb-blue)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[var(--sb-secondary-text)]">Completing sign-in…</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

