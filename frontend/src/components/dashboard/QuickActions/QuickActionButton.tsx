import {
  ArrowUpRight,
  LockKeyhole,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  QuickActionButtonProps,
  QuickActionVariant,
  QuickActionVisualConfig,
} from "./QuickActions.types";

const variantStyles: Record<
  QuickActionVariant,
  QuickActionVisualConfig
> = {
  primary: {
    accentClassName: "bg-primary-bright",
    iconContainerClassName:
      "border-primary/20 bg-primary/10",
    iconClassName: "text-primary-bright",
    badgeClassName:
      "border-primary/20 bg-primary/10 text-primary-bright",
    hoverBorderClassName:
      "hover:border-primary/35",
  },

  neutral: {
    accentClassName: "bg-text-subtle",
    iconContainerClassName:
      "border-border bg-surface-muted",
    iconClassName: "text-text-muted",
    badgeClassName:
      "border-border bg-surface-muted text-text-muted",
    hoverBorderClassName:
      "hover:border-border-highlight",
  },

  success: {
    accentClassName: "bg-success",
    iconContainerClassName:
      "border-success/20 bg-success/10",
    iconClassName: "text-success",
    badgeClassName:
      "border-success/20 bg-success/10 text-success",
    hoverBorderClassName:
      "hover:border-success/35",
  },

  warning: {
    accentClassName: "bg-warning",
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    iconClassName: "text-warning",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
    hoverBorderClassName:
      "hover:border-warning/35",
  },
};

export function QuickActionButton({
  action,
  onAction,
}: Readonly<QuickActionButtonProps>) {
  const Icon = action.icon;
  const styles =
    variantStyles[action.variant];

  const isDisabled =
    action.disabled === true;

  const handleClick = (): void => {
    if (isDisabled) {
      return;
    }

    onAction?.(action);
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        "group relative flex min-h-[158px]",
        "min-w-0 flex-col items-start",
        "overflow-hidden rounded-[16px]",
        "border border-border",
        "bg-surface-elevated/55 p-4",
        "text-left",
        "transition-[border-color,background-color,box-shadow,transform]",
        "duration-200 ease-out",
        "hover:-translate-y-px",
        "hover:bg-card-hover",
        "hover:shadow-card",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary/40",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
        styles.hoverBorderClassName,
      )}
      aria-label={
        isDisabled
          ? `${action.title}. Indisponível no momento.`
          : action.title
      }
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-0.5",
          styles.accentClassName,
        )}
        aria-hidden="true"
      />

      <div className="flex w-full items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[12px] border",
            styles.iconContainerClassName,
            styles.iconClassName,
          )}
          aria-hidden="true"
        >
          <Icon className="size-[18px]" />
        </div>

        {isDisabled ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5",
              "rounded-full border",
              "border-border bg-surface-muted",
              "px-2 py-1",
              "text-[9px] font-semibold",
              "uppercase tracking-[0.08em]",
              "text-text-muted",
            )}
          >
            <LockKeyhole
              size={10}
              aria-hidden="true"
            />

            {action.badge ?? "Indisponível"}
          </span>
        ) : action.badge ? (
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full border",
              "px-2 py-1 text-[9px]",
              "font-semibold uppercase",
              "tracking-[0.08em]",
              styles.badgeClassName,
            )}
          >
            {action.badge}
          </span>
        ) : (
          <ArrowUpRight
            className={cn(
              "size-4 shrink-0 text-text-subtle",
              "transition-[color,transform]",
              "duration-200",
              "group-hover:-translate-y-0.5",
              "group-hover:translate-x-0.5",
              "group-hover:text-text",
              "motion-reduce:transition-none",
              "motion-reduce:transform-none",
            )}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-5 text-text">
          {action.title}
        </h4>

        <p className="mt-1.5 text-xs leading-5 text-text-muted">
          {action.description}
        </p>
      </div>

      <div
        className={cn(
          "mt-3 flex w-full items-center",
          "justify-between gap-3",
          "border-t border-border-muted pt-3",
        )}
      >
        <span className="text-[10px] font-medium text-text-subtle">
          {isDisabled
            ? "Recurso em desenvolvimento"
            : "Abrir recurso"}
        </span>

        {!isDisabled && (
          <ArrowUpRight
            size={13}
            className={cn(
              "text-text-subtle",
              "transition-transform duration-200",
              "group-hover:-translate-y-0.5",
              "group-hover:translate-x-0.5",
            )}
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
}