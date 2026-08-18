import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";

export function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Abrir notificações"
      title="Notificações"
      className={cn(
        "relative flex size-10 shrink-0 items-center",
        "justify-center rounded-[14px]",
        "border border-border bg-card",
        "text-text-muted shadow-card",
        "transition-[background-color,border-color,color,transform,box-shadow]",
        "duration-200 ease-out",
        "hover:-translate-y-px",
        "hover:border-border-highlight",
        "hover:bg-card-hover hover:text-text",
        "hover:shadow-elevated",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
      )}
    >
      <Bell size={18} aria-hidden="true" />

      <span
        className={cn(
          "absolute right-2.5 top-2.5 size-2",
          "rounded-full border-2 border-card",
          "bg-danger",
          "shadow-[0_0_10px_var(--danger)]",
        )}
        aria-hidden="true"
      />

      <span className="sr-only">
        Existem notificações não lidas
      </span>
    </button>
  );
}