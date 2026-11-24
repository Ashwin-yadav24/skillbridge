interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "demo";
  label: string;
}

const styles: Record<StatusBadgeProps["status"], string> = {
  success: "bg-[var(--sb-green)]/10 text-[var(--sb-green)] border-[var(--sb-green)]/30",
  warning: "bg-[var(--sb-orange)]/10 text-[var(--sb-orange)] border-[var(--sb-orange)]/30",
  error: "bg-[var(--sb-red)]/10 text-[var(--sb-red)] border-[var(--sb-red)]/30",
  info: "bg-[var(--sb-blue)]/10 text-[var(--sb-blue)] border-[var(--sb-blue)]/30",
  demo: "bg-[var(--sb-purple)]/10 text-[var(--sb-purple)] border-[var(--sb-purple)]/30",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {label}
    </span>
  );
}

