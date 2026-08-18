import { cn } from "@/lib/utils";

import type {
  InsightItemProps,
  InsightTone,
} from "./AIInsights.types";

interface InsightToneStyle {
  accent: string;
  iconContainer: string;
  icon: string;
  badge: string;
}

const toneStyles: Record<
  InsightTone,
  InsightToneStyle
> = {
  success: {
    accent: "bg-success",
    iconContainer:
      "border-success/20 bg-success/10",
    icon: "text-success",
    badge:
      "border-success/20 bg-success/10 text-success",
  },

  warning: {
    accent: "bg-warning",
    iconContainer:
      "border-warning/20 bg-warning/10",
    icon: "text-warning",
    badge:
      "border-warning/20 bg-warning/10 text-warning",
  },

  danger: {
    accent: "bg-danger",
    iconContainer:
      "border-danger/20 bg-danger/10",
    icon: "text-danger",
    badge:
      "border-danger/20 bg-danger/10 text-danger",
  },

  info: {
    accent: "bg-primary-bright",
    iconContainer:
      "border-primary/20 bg-primary/10",
    icon: "text-primary-bright",
    badge:
      "border-primary/20 bg-primary/10 text-primary-bright",
  },
};

const toneLabels: Record<InsightTone, string> = {
  success: "Positivo",
  warning: "Oportunidade",
  danger: "Atenção",
  info: "Informação",
};

export function InsightItem({
  insight,
  presentation,
}: Readonly<InsightItemProps>) {
  const Icon = presentation.icon;
  const styles = toneStyles[presentation.tone];

  return (
    <article
      className={cn(
        "group relative flex min-h-[132px]",
        "min-w-0 flex-col overflow-hidden",
        "rounded-[16px] border border-border",
        "bg-surface-elevated/55 p-4",
        "transition-[border-color,background-color,transform,box-shadow]",
        "duration-200 ease-out",
        "hover:-translate-y-px",
        "hover:border-border-highlight",
        "hover:bg-card-hover",
        "hover:shadow-card",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          styles.accent,
        )}
        aria-hidden="true"
      />

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center",
            "justify-center rounded-[11px] border",
            styles.iconContainer,
            styles.icon,
          )}
          aria-hidden="true"
        >
          <Icon size={17} />
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 rounded-full border",
            "px-2 py-1 text-[9px] font-semibold",
            "uppercase tracking-[0.08em]",
            styles.badge,
          )}
        >
          {toneLabels[presentation.tone]}
        </span>
      </div>

      <div className="mt-3 min-w-0">
        <h4 className="text-sm font-semibold leading-5 text-text">
          {presentation.title}
        </h4>

        <p className="mt-1.5 text-xs leading-5 text-text-muted">
          {insight}
        </p>
      </div>
    </article>
  );
}