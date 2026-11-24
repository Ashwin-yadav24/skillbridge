import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  color?: string;
  icon?: LucideIcon;
  change?: string;
  subtitle?: string;
}

export function MetricCard({ label, value, color = "text-[var(--sb-blue)]", icon: Icon, change, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-5 shadow-navy-sm transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-tech text-[var(--sb-secondary-text)]">{label}</p>
          <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-[var(--sb-secondary-text)] mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          {Icon && (
            <div className="rounded-lg bg-[var(--sb-card)] p-2">
              <Icon className="h-5 w-5 text-[var(--sb-secondary-text)]" />
            </div>
          )}
          {change && (
            <span className="text-xs font-semibold text-[var(--sb-green)]">{change}</span>
          )}
        </div>
      </div>
    </div>
  );
}

