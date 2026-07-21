import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({
  className,
}: Readonly<SearchBarProps>) {
  return (
    <div
      className={cn(
        "group relative min-w-0",
        className,
      )}
      title="Busca global — Em breve"
    >
      <Search
        size={17}
        className={cn(
          "pointer-events-none absolute left-3.5 top-1/2",
          "-translate-y-1/2 text-text-subtle",
        )}
        aria-hidden="true"
      />

      <input
        type="search"
        disabled
        aria-disabled="true"
        aria-label="Busca global indisponível. Em breve."
        placeholder="Buscar transações, análises..."
        className={cn(
          "h-10 w-full rounded-[14px]",
          "border border-border bg-card",
          "pl-10 pr-16 text-sm text-text",
          "shadow-card outline-none",
          "placeholder:text-text-subtle",
          "disabled:cursor-not-allowed disabled:opacity-90",
        )}
      />

      <span
        className={cn(
          "pointer-events-none absolute right-3 top-1/2",
          "-translate-y-1/2 rounded-md",
          "border border-border bg-surface-elevated",
          "px-1.5 py-0.5 text-[9px] font-semibold",
          "uppercase tracking-wide text-text-subtle",
        )}
      >
        Em breve
      </span>
    </div>
  );
}