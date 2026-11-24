"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/mock-data";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--sb-navy)]">
            Frequently Asked <span className="underline-accent">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-[var(--sb-navy)] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[var(--sb-card)] transition-colors"
              >
                <span className="font-bold text-[var(--sb-navy)] pr-4">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--sb-blue)] transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="border-t-2 border-[var(--sb-navy)] bg-[var(--sb-cream)] p-5">
                  <p className="text-sm text-[var(--sb-secondary-text)] leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

