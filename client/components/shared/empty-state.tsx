import type { LucideIcon } from "lucide-react";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = FileQuestion, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl border-2 border-dashed border-gray-300 p-6 mb-4">
        <Icon className="h-12 w-12 text-[var(--sb-secondary-text)]" />
      </div>
      <h3 className="text-lg font-bold text-[var(--sb-navy)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--sb-secondary-text)] max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

