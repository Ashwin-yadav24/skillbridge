"use client";

import { useSignIn } from "@clerk/nextjs";
import { BrainCircuit, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: Zap, text: "AI-powered resume analysis" },
  { icon: ShieldCheck, text: "Skill gap identification" },
  { icon: Users, text: "PMKVY course recommendations" },
];

export default function SignInPage() {
  const { signIn } = useSignIn();

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (!signIn) return;
    await signIn.sso({
      strategy,
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: "/sso-callback",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--sb-cream)] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--sb-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--sb-orange)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left panel — branding */}
        <div className="hidden md:flex flex-col bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-2xl p-10 shadow-navy text-white">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-white/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-tight mb-4">
            Your AI-powered<br />
            <span className="text-[var(--sb-orange)]">career companion</span>
          </h2>
          <p className="text-white/60 text-sm mb-10 leading-relaxed">
            Sign in with your Google or GitHub account to unlock personalised skill gap analysis, PMKVY course recommendations, and AI-generated career roadmaps.
          </p>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                <span className="w-8 h-8 rounded-lg bg-[var(--sb-blue)]/20 border border-[var(--sb-blue)]/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[var(--sb-blue)]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel — auth card */}
        <div className="bg-white border-2 border-[var(--sb-navy)] rounded-2xl shadow-navy p-8 flex flex-col">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-[var(--sb-navy)]">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--sb-navy)]">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--sb-navy)] mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-[var(--sb-secondary-text)]">
              Sign in to continue your career journey
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Google */}
            <button
              onClick={() => handleOAuth("oauth_google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-white border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-[var(--sb-navy)] shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleOAuth("oauth_github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-xl text-sm font-semibold text-white shadow-navy-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <svg className="w-5 h-5 shrink-0 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[var(--sb-secondary-text)] label-tech">
                SECURE & ENCRYPTED
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-[var(--sb-secondary-text)] leading-relaxed">
            By continuing, you agree to SkillBridge AI&apos;s{" "}
            <Link href="#" className="text-[var(--sb-blue)] hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[var(--sb-blue)] hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-sm text-[var(--sb-secondary-text)] mt-5">
            New here?{" "}
            <Link href="/sign-up" className="text-[var(--sb-blue)] font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
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
