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
    iconClassName: "text-blue-600 dark:text-blue-400",
    iconContainerClassName:
      "bg-blue-50 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20",
    badgeClassName:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },

  success: {
    icon: BadgeCheck,
    label: "Positivo",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    iconContainerClassName:
      "bg-emerald-50 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20",
    badgeClassName:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },

  warning: {
    icon: CircleAlert,
    label: "Atenção",
    iconClassName: "text-amber-600 dark:text-amber-400",
    iconContainerClassName:
      "bg-amber-50 ring-amber-100 dark:bg-amber-500/10 dark:ring-amber-500/20",
    badgeClassName:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },

  danger: {
    icon: AlertCircle,
    label: "Crítico",
    iconClassName: "text-red-600 dark:text-red-400",
    iconContainerClassName:
      "bg-red-50 ring-red-100 dark:bg-red-500/10 dark:ring-red-500/20",
    badgeClassName:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  },
};

export function AlertItem({
  alert,
  onAction,
}: Readonly<AlertItemProps>) {
  const config = alertVisualConfig[alert.type];
  const Icon = config.icon;

  const hasAction = Boolean(alert.actionLabel && onAction);

  return (
    <article
      className={cn(
        "group flex min-w-0 items-start gap-3 rounded-xl border",
        "border-slate-200/80 bg-white p-3.5",
        "transition-colors duration-200",
        "hover:bg-slate-50/80",
        "dark:border-slate-800 dark:bg-slate-950/40",
        "dark:hover:bg-slate-900/60",
      )}
      aria-label={`${config.label}: ${alert.title}`}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          "ring-1 ring-inset",
          config.iconContainerClassName,
        )}
      >
        <Icon
          className={cn("size-4", config.iconClassName)}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="min-w-0 text-sm font-semibold text-slate-950 dark:text-slate-50">
            {alert.title}
          </h3>

          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full",
              "px-2 py-0.5 text-[10px] font-medium",
              config.badgeClassName,
            )}
          >
            {config.label}
          </span>
        </div>

        {alert.description && (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {alert.description}
          </p>
        )}

        {hasAction && (
          <button
            type="button"
            onClick={() => onAction?.(alert)}
            className={cn(
              "mt-2 inline-flex items-center gap-1.5",
              "text-xs font-semibold text-slate-700",
              "transition-colors hover:text-slate-950",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              "dark:text-slate-300 dark:hover:text-white",
              "dark:focus-visible:ring-offset-slate-950",
            )}
          >
            {alert.actionLabel}

            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </article>
  );
}