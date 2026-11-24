interface DemoBannerProps {
  message?: string;
}

export function DemoBanner({ message = "This page displays demo data for illustration purposes. No official records are shown." }: DemoBannerProps) {
  return (
    <div className="rounded-lg border border-[var(--sb-purple)]/30 bg-[var(--sb-purple)]/5 px-4 py-2.5 mb-6">
      <p className="text-xs font-medium text-[var(--sb-purple)]">
        <span className="font-bold">⚡ DEMO DATA</span> — {message}
      </p>
    </div>
  );
}

