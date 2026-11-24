"use client";

import { useState } from "react";
import Link from "next/link";
import { BrainCircuit, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "AI-powered resume analysis",
  "Skill gap identification",
  "PMKVY course recommendations",
  "Personalized career roadmap",
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-[var(--sb-cream)] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--sb-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--sb-green)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left — benefits panel */}
        <div className="hidden md:block bg-[var(--sb-navy)] border-2 border-[var(--sb-navy)] rounded-2xl p-8 shadow-navy text-white self-stretch">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-white/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-3 leading-tight">
            Start your career transformation today
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Join thousands of students who discovered their career potential
            with AI-powered guidance and government-backed training.
          </p>

          <ul className="space-y-4 mb-8">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--sb-green)] shrink-0" />
                <span className="text-sm text-white/80">{b}</span>
              </li>
            ))}
          </ul>

          {/* Fake stat strip */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-[var(--sb-blue)]">12k+</div>
              <div className="text-xs text-white/50 label-tech mt-0.5">Students Guided</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--sb-green)]">500+</div>
              <div className="text-xs text-white/50 label-tech mt-0.5">PMKVY Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--sb-orange)]">85%</div>
              <div className="text-xs text-white/50 label-tech mt-0.5">Placement Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--sb-purple)]">200+</div>
              <div className="text-xs text-white/50 label-tech mt-0.5">Occupations Mapped</div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div>
          {/* Demo notice */}
          <div className="mb-4 px-4 py-2 bg-[var(--sb-orange)]/10 border-2 border-[var(--sb-orange)] rounded-xl text-center">
            <span className="label-tech text-[var(--sb-orange)] text-xs">
              🚧 UI PREVIEW — Authentication implemented in Phase 3
            </span>
          </div>

          <div className="bg-white border-2 border-[var(--sb-navy)] rounded-2xl shadow-navy p-8">
            {/* Mobile logo */}
            <div className="flex md:hidden items-center justify-center gap-2 mb-6">
              <div className="w-9 h-9 bg-[var(--sb-blue)] rounded-xl flex items-center justify-center border-2 border-[var(--sb-navy)]">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--sb-navy)]">
                SkillBridge <span className="text-[var(--sb-blue)]">AI</span>
              </span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-[var(--sb-navy)] mb-1">
                Create Your Account
              </h1>
              <p className="text-[var(--sb-secondary-text)] text-sm">
                Free forever. No credit card required.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Arjun Sharma"
                  className="w-full px-4 py-3 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                />
              </div>

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
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5"
                >
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
                    className="w-full px-4 py-3 pr-12 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-semibold text-[var(--sb-navy)] mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full px-4 py-3 pr-12 border-2 border-[var(--sb-navy)] rounded-xl bg-[var(--sb-cream)] text-[var(--sb-navy)] placeholder:text-[var(--sb-secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-blue)] focus:border-[var(--sb-blue)] transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sb-secondary-text)] hover:text-[var(--sb-navy)] transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 border-2 border-[var(--sb-navy)] rounded accent-[var(--sb-blue)] shrink-0"
                />
                <label htmlFor="terms" className="text-xs text-[var(--sb-secondary-text)] leading-relaxed">
                  I agree to the{" "}
                  <Link href="#" className="text-[var(--sb-blue)] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[var(--sb-blue)] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--sb-blue)] text-white font-semibold rounded-xl border-2 border-[var(--sb-navy)] shadow-navy-sm hover:bg-[var(--sb-blue-hover)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all mt-2"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-sm text-[var(--sb-secondary-text)] mt-5">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[var(--sb-blue)] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
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

