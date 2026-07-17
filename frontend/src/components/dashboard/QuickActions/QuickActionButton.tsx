import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  QuickActionButtonProps,
  QuickActionVariant,
} from "./QuickActions.types";

const variantStyles: Record<
  QuickActionVariant,
  {
    iconContainer: string;
    icon: string;
    hoverBorder: string;
  }
> = {
  primary: {
    iconContainer:
      "bg-blue-50 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20",
    icon: "text-blue-600 dark:text-blue-400",
    hoverBorder:
      "hover:border-blue-200 dark:hover:border-blue-500/30",
  },

  neutral: {
    iconContainer:
      "bg-slate-100 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700",
    icon: "text-slate-600 dark:text-slate-300",
    hoverBorder:
      "hover:border-slate-300 dark:hover:border-slate-700",
  },

  success: {
    iconContainer:
      "bg-emerald-50 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    hoverBorder:
      "hover:border-emerald-200 dark:hover:border-emerald-500/30",
  },

  warning: {
    iconContainer:
      "bg-amber-50 ring-amber-100 dark:bg-amber-500/10 dark:ring-amber-500/20",
    icon: "text-amber-600 dark:text-amber-400",
    hoverBorder:
      "hover:border-amber-200 dark:hover:border-amber-500/30",
  },
};

export function QuickActionButton({
  action,
  onAction,
}: Readonly<QuickActionButtonProps>) {
  const Icon = action.icon;
  const styles = variantStyles[action.variant];

  const handleClick = (): void => {
    if (action.disabled) {
      return;
    }

    onAction?.(action);
  };

  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={handleClick}
      className={cn(
        "group relative flex min-w-0 flex-col items-start rounded-xl border",
        "border-slate-200/80 bg-white p-3.5 text-left",
        "transition-[border-color,background-color,box-shadow,transform]",
        "duration-200 ease-out",
        "hover:-translate-y-0.5 hover:bg-slate-50/80 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:opacity-60",
        "dark:border-slate-800 dark:bg-slate-950/40",
        "dark:hover:bg-slate-900/60",
        "dark:focus-visible:ring-offset-slate-950",
        styles.hoverBorder,
      )}
      aria-label={
        action.disabled
          ? `${action.title}. Indisponível no momento.`
          : action.title
      }
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            "ring-1 ring-inset",
            styles.iconContainer,
          )}
        >
          <Icon
            className={cn("size-4", styles.icon)}
            aria-hidden="true"
          />
        </div>

        {action.badge ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full",
              "bg-slate-100 px-2 py-0.5",
              "text-[10px] font-semibold text-slate-500",
              "dark:bg-slate-800 dark:text-slate-400",
            )}
          >
            {action.badge}
          </span>
        ) : (
          <ArrowUpRight
            className={cn(
              "size-4 shrink-0 text-slate-400",
              "transition-transform duration-200",
              "group-hover:-translate-y-0.5",
              "group-hover:translate-x-0.5",
              "group-hover:text-slate-700",
              "dark:group-hover:text-slate-200",
            )}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
          {action.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {action.description}
        </p>
      </div>
    </button>
  );
}