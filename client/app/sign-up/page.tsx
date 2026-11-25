"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BrainCircuit, Sparkles, Eye, EyeOff, ArrowRight,
  AlertCircle, CheckCircle2, Zap, ShieldCheck, Users, TrendingUp,
} from "lucide-react";

const BENEFITS = [
  { icon: Zap, label: "AI Resume Analysis", desc: "Extract skills and experience automatically" },
  { icon: ShieldCheck, label: "Skill Gap Report", desc: "Know exactly what you need to learn" },
  { icon: Users, label: "PMKVY Courses", desc: "Government-backed training programmes" },
  { icon: TrendingUp, label: "Career Roadmap", desc: "Step-by-step AI-generated plan" },
];

type Step = "form" | "verify";

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── OAuth ──────────────────────────────────────────────────────────── */
  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (!signUp) return;
    setError("");
    try {
      await signUp.sso({
        strategy,
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err: unknown) {
      const ce = err as { errors?: Array<{ message: string }> };
      setError(ce?.errors?.[0]?.message ?? "OAuth sign-up failed.");
    }
  };

  /* ── Step 1: Register with password ────────────────────────────────── */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const nameParts = form.name.trim().split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ") || undefined;

      const { error: pwError } = await signUp.password({
        emailAddress: form.email,
        password: form.password,
        firstName,
        lastName,
      });

      if (pwError) {
        setError(pwError.longMessage ?? pwError.message ?? "Sign-up failed. Please try again.");
        return;
      }

      // Send email verification code
      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) {
        setError(codeError.longMessage ?? codeError.message ?? "Failed to send verification code.");
        return;
      }

      setStep("verify");
    } catch (err: unknown) {
      const ce = err as { errors?: Array<{ message: string }> };
      setError(ce?.errors?.[0]?.message ?? "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify email code ──────────────────────────────────────── */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    setLoading(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) {
        setError(verifyError.longMessage ?? verifyError.message ?? "Invalid verification code.");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        router.push("/dashboard");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: unknown) {
      const ce = err as { errors?: Array<{ message: string }> };
      setError(ce?.errors?.[0]?.message ?? "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--sb-cream)] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--sb-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--sb-green)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* ── Left benefits panel ─────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-2xl p-10 shadow-navy text-white self-stretch">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-white/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-tight mb-4">
            Start your career<br />
            <span className="text-[var(--sb-orange)]">transformation today</span>
          </h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Join thousands of students who discovered their career potential with AI-powered guidance and government-backed training.
          </p>

          <ul className="space-y-4 mb-8">
            {BENEFITS.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--sb-blue)]/20 border border-[var(--sb-blue)]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[var(--sb-blue)]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/50">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[var(--sb-green)]" />
              <span className="text-xs font-semibold text-white">Free to use</span>
            </div>
            <p className="text-xs text-white/50">No credit card required. Sign up with one click.</p>
          </div>
        </div>

        {/* ── Right auth card ─────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-[var(--sb-navy)] rounded-2xl shadow-navy p-8 flex flex-col">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-[var(--sb-navy)]">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--sb-navy)]">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          {step === "form" ? (
            /* ── Registration form ──────────────────────────────────────── */
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--sb-navy)] mb-1">Create Your Account</h1>
                <p className="text-sm text-[var(--sb-secondary-text)]">Start your AI-powered career journey</p>
              </div>

              {/* OAuth */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleOAuth("oauth_google")}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-5 bg-white border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
                <button
                  onClick={() => handleOAuth("oauth_github")}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-5 bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-white shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Sign up with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-[var(--sb-secondary-text)] label-tech">
                    OR SIGN UP WITH EMAIL
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 mb-4 px-4 py-3 bg-[var(--sb-red)]/10 border-2 border-[var(--sb-red)] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-[var(--sb-red)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--sb-red)]">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ashwin Yadav"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 pr-11 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 pr-11 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !signUp}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-6 bg-[var(--sb-blue)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-navy-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-[var(--sb-secondary-text)] mt-4">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-[var(--sb-blue)] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            /* ── Email verification step ────────────────────────────────── */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[var(--sb-green)]/10 border-2 border-[var(--sb-green)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[var(--sb-green)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--sb-navy)] mb-2">Check Your Email</h1>
                <p className="text-sm text-[var(--sb-secondary-text)]">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-[var(--sb-navy)]">{form.email}</span>
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 mb-5 px-4 py-3 bg-[var(--sb-red)]/10 border-2 border-[var(--sb-red)] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-[var(--sb-red)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--sb-red)]">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    className="w-full px-4 py-3 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] text-center text-2xl font-bold tracking-[0.4em] placeholder:text-[var(--sb-secondary-text)] placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !signUp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--sb-green)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Verify &amp; Continue</>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setStep("form"); setError(""); setCode(""); }}
                className="w-full mt-3 text-sm text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
              >
                ← Back to sign-up
              </button>
            </>
          )}

          <div className="flex items-center justify-center gap-2 mt-5">
            <Sparkles className="w-3 h-3 text-[var(--sb-blue)]" />
            <span className="text-xs text-[var(--sb-secondary-text)] label-tech">
              Powered by Google Gemini AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
