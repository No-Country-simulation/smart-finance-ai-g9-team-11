import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  AlertItemProps,
  AlertVisualConfig,
  FinancialAlertType,
} from "./Alerts.types";

const alertVisualConfig: Record<
  FinancialAlertType,
  AlertVisualConfig
> = {
  info: {
    icon: Info,
    label: "Informativo",
    accentClassName: "bg-primary-bright",
    iconClassName: "text-primary-bright",
    iconContainerClassName:
      "border-primary/20 bg-primary/10",
    badgeClassName:
      "border-primary/20 bg-primary/10 text-primary-bright",
  },

  success: {
    icon: BadgeCheck,
    label: "Positivo",
    accentClassName: "bg-success",
    iconClassName: "text-success",
    iconContainerClassName:
      "border-success/20 bg-success/10",
    badgeClassName:
      "border-success/20 bg-success/10 text-success",
  },

  warning: {
    icon: CircleAlert,
    label: "Atenção",
    accentClassName: "bg-warning",
    iconClassName: "text-warning",
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
  },

  danger: {
    icon: AlertCircle,
    label: "Crítico",
    accentClassName: "bg-danger",
    iconClassName: "text-danger",
    iconContainerClassName:
      "border-danger/20 bg-danger/10",
    badgeClassName:
      "border-danger/20 bg-danger/10 text-danger",
  },
};

export function AlertItem({
  alert,
  onAction,
}: Readonly<AlertItemProps>) {
  const config = alertVisualConfig[alert.type];
  const Icon = config.icon;

  const hasAction = Boolean(
    alert.actionLabel && onAction,
  );

  return (
    <article
      className={cn(
        "group relative flex min-h-[156px]",
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
      aria-label={`${config.label}: ${alert.title}`}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          config.accentClassName,
        )}
        aria-hidden="true"
      />

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center",
            "justify-center rounded-[11px] border",
            config.iconContainerClassName,
            config.iconClassName,
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center",
            "rounded-full border px-2 py-1",
            "text-[9px] font-semibold uppercase",
            "tracking-[0.08em]",
            config.badgeClassName,
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-3 min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-5 text-text">
          {alert.title}
        </h4>

        {alert.description && (
          <p className="mt-1.5 text-xs leading-5 text-text-muted">
            {alert.description}
          </p>
        )}
      </div>

      {hasAction && (
        <button
          type="button"
          onClick={() => onAction?.(alert)}
          className={cn(
            "mt-3 inline-flex w-fit items-center gap-1.5",
            "rounded-lg text-xs font-semibold",
            "text-primary-bright",
            "transition-[color,transform]",
            "hover:text-primary",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-primary/40",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          )}
        >
          {alert.actionLabel}

          <ArrowRight
            className={cn(
              "size-3.5 transition-transform",
              "group-hover:translate-x-0.5",
              "motion-reduce:transition-none",
              "motion-reduce:translate-x-0",
            )}
            aria-hidden="true"
          />
        </button>
      )}
    </article>
  );
}