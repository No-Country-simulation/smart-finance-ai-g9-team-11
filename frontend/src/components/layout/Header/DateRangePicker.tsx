import { CalendarDays, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function DateRangePicker() {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Filtro de período — Em breve"
      className={cn(
        "flex h-10 items-center gap-2.5",
        "rounded-[14px] border border-border",
        "bg-card px-3.5 text-xs font-medium",
        "text-text-muted shadow-card",
        "disabled:cursor-not-allowed disabled:opacity-90",
      )}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center",
          "rounded-[10px] bg-surface-elevated",
          "text-secondary-bright",
        )}
      >
        <CalendarDays size={15} aria-hidden="true" />
      </span>

      <span className="whitespace-nowrap">
        01 Mai – 31 Mai 2026
      </span>

      <ChevronDown
        size={14}
        className="text-text-subtle"
        aria-hidden="true"
      />
    </button>
  );
}