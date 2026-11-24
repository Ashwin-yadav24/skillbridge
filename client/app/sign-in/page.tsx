"use client";

import { useState } from "react";
import Link from "next/link";
import { BrainCircuit, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[var(--sb-cream)] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--sb-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--sb-orange)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Demo notice */}
        <div className="mb-4 px-4 py-2 bg-[var(--sb-orange)]/10 border-2 border-[var(--sb-orange)] rounded-xl text-center">
          <span className="label-tech text-[var(--sb-orange)] text-xs">
            🚧 UI PREVIEW — Authentication implemented in Phase 3
          </span>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-[var(--sb-navy)] rounded-2xl shadow-navy p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-[var(--sb-navy)]">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--sb-navy)]">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--sb-navy)] mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--sb-secondary-text)] text-sm">
              Sign in to continue your career journey
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--sb-navy)]"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-[var(--sb-blue)] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border-2 border-[var(--sb-navy)] rounded accent-[var(--sb-blue)]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-[var(--sb-secondary-text)]"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--sb-blue)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[var(--sb-secondary-text)] label-tech">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* OAuth placeholders */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <svg className="w-4 h-4 fill-[var(--sb-navy)]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-[var(--sb-secondary-text)] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[var(--sb-blue)] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* AI badge */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Sparkles className="w-3 h-3 text-[var(--sb-blue)]" />
          <span className="text-xs text-[var(--sb-secondary-text)] label-tech">
            Powered by Google Gemini AI
          </span>
        </div>
      </div>
    </div>
  );
}

