import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--sb-blue)] mb-3" />
      <p className="text-sm text-[var(--sb-secondary-text)]">{message}</p>
    </div>
  );
}

