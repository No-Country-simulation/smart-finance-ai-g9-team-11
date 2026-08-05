import {
  Activity,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  FinancialHealthRadarDetailProps,
  FinancialHealthStatus,
  FinancialHealthStatusConfig,
} from "./FinancialHealthRadar.types";

const statusConfig: Record<
  FinancialHealthStatus,
  FinancialHealthStatusConfig
> = {
  excellent: {
    label: "Excelente",
    className:
      "border-success/20 bg-success/10 text-success",
    progressClassName: "bg-success",
  },

  good: {
    label: "Bom",
    className:
      "border-primary/20 bg-primary/10 text-primary-bright",
    progressClassName: "bg-primary-bright",
  },

  attention: {
    label: "Atenção",
    className:
      "border-warning/20 bg-warning/10 text-warning",
    progressClassName: "bg-warning",
  },

  critical: {
    label: "Crítico",
    className:
      "border-danger/20 bg-danger/10 text-danger",
    progressClassName: "bg-danger",
  },
};

function getStatus(
  value: number,
  fullMark: number,
): FinancialHealthStatus {
  const safeFullMark = Math.max(fullMark, 1);
  const percentage = (value / safeFullMark) * 100;

  if (percentage >= 80) {
    return "excellent";
  }

  if (percentage >= 60) {
    return "good";
  }

  if (percentage >= 40) {
    return "attention";
  }

  return "critical";
}

export function FinancialHealthRadarTooltip({
  metric,
}: Readonly<FinancialHealthRadarDetailProps>) {
  const safeFullMark = Math.max(
    metric.fullMark,
    1,
  );

  const percentage = Math.min(
    Math.max(
      Math.round(
        (metric.value / safeFullMark) * 100,
      ),
      0,
    ),
    100,
  );

  const status = getStatus(
    metric.value,
    metric.fullMark,
  );

  const config = statusConfig[status];

  const StatusIcon =
    status === "excellent" || status === "good"
      ? CircleCheck
      : TriangleAlert;

  return (
    <div
      className={cn(
        "rounded-[14px] border border-border",
        "bg-surface-elevated/55 p-4",
      )}
      aria-live="polite"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center",
              "justify-center rounded-[11px]",
              "border border-primary/20",
              "bg-primary/10 text-primary-bright",
            )}
            aria-hidden="true"
          >
            <Activity size={16} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-text-subtle">
              Pilar selecionado
            </p>

            <h4 className="mt-1 truncate text-sm font-semibold text-text">
              {metric.subject}
            </h4>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5",
            "rounded-full border px-2 py-1",
            "text-[9px] font-semibold uppercase",
            "tracking-[0.08em]",
            config.className,
          )}
        >
          <StatusIcon
            size={11}
            aria-hidden="true"
          />

          {config.label}
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-text-muted">
        {metric.description}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-medium text-text-muted">
            Pontuação do pilar
          </span>

          <span className="text-xs font-bold tabular-nums text-text">
            {metric.value}/{metric.fullMark}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              "h-full rounded-full",
              "transition-[width] duration-500 ease-out",
              config.progressClassName,
            )}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}