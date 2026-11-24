"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/api-client";
import type { HealthResponse } from "@/types/api";
import { CheckCircle, XCircle, Loader2, Server } from "lucide-react";

type ConnectionState = "loading" | "connected" | "error";

export function ApiStatus() {
  const [state, setState] = useState<ConnectionState>("loading");
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setState("loading");
        const response = await apiClient.get<HealthResponse>("/api/health");
        setData(response);
        setState("connected");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
        setState("error");
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="rounded-xl border-2 border-[var(--sb-navy)] bg-white p-6 shadow-navy">
      <div className="flex items-center gap-3 mb-4">
        <Server className="h-5 w-5 text-[var(--sb-blue)]" />
        <h3 className="text-lg font-bold text-[var(--sb-navy)]">
          Development Status
        </h3>
        <span className="label-tech text-[var(--sb-secondary-text)]">
          Phase 1
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Frontend */}
        <StatusItem
          label="Frontend"
          status="connected"
          detail="Next.js running on :3000"
        />

        {/* Backend */}
        <StatusItem
          label="Backend API"
          status={state}
          detail={
            state === "connected"
              ? `${data?.message} (${data?.environment})`
              : state === "error"
              ? error ?? "Connection failed"
              : "Checking connection…"
          }
        />

        {/* Database */}
        <StatusItem
          label="Database"
          status={
            state === "connected"
              ? data?.database === "connected"
                ? "connected"
                : "error"
              : "loading"
          }
          detail={
            state === "connected"
              ? data?.database === "connected"
                ? "MongoDB Atlas connected"
                : "Not configured — running in disconnected mode"
              : "Waiting for API…"
          }
        />

        {/* TypeScript */}
        <StatusItem
          label="TypeScript"
          status="connected"
          detail="Strict mode enabled"
        />
      </div>
    </div>
  );
}

function StatusItem({
  label,
  status,
  detail,
}: {
  label: string;
  status: ConnectionState;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-[var(--sb-card)] p-4">
      {status === "loading" && (
        <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-[var(--sb-blue)]" />
      )}
      {status === "connected" && (
        <CheckCircle className="mt-0.5 h-5 w-5 text-[var(--sb-green)]" />
      )}
      {status === "error" && (
        <XCircle className="mt-0.5 h-5 w-5 text-[var(--sb-orange)]" />
      )}
      <div>
        <p className="text-sm font-semibold text-[var(--sb-navy)]">{label}</p>
        <p className="text-xs text-[var(--sb-secondary-text)]">{detail}</p>
      </div>
    </div>
  );
}

