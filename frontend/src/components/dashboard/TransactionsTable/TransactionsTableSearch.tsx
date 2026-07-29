import {
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { TransactionsTableSearchProps } from "./TransactionsTable.types";

export function TransactionsTableSearch({
  value,
  onChange,
  resultCount,
}: Readonly<TransactionsTableSearchProps>) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="min-w-0">
      <label
        htmlFor="transactions-search"
        className="sr-only"
      >
        Pesquisar transações
      </label>

      <div className="relative w-full min-w-0 sm:w-72">
        <Search
          size={16}
          className={cn(
            "pointer-events-none absolute",
            "left-3 top-1/2 -translate-y-1/2",
            "text-text-subtle",
          )}
          aria-hidden="true"
        />

        <input
          id="transactions-search"
          type="search"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Pesquisar transações..."
          autoComplete="off"
          className={cn(
            "h-10 w-full min-w-0",
            "rounded-[12px] border border-border",
            "bg-background/45",
            "pl-9 pr-10",
            "text-xs text-text outline-none",
            "placeholder:text-text-subtle",
            "transition-[border-color,box-shadow,background-color]",
            "duration-200",
            "hover:bg-background/65",
            "focus:border-primary/45",
            "focus:ring-4 focus:ring-primary/10",
          )}
        />

        {hasValue && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpar pesquisa"
            title="Limpar pesquisa"
            className={cn(
              "absolute right-2 top-1/2",
              "flex size-7 -translate-y-1/2",
              "items-center justify-center",
              "rounded-lg text-text-subtle",
              "transition-colors",
              "hover:bg-surface-muted",
              "hover:text-text",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/40",
            )}
          >
            <X
              size={14}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {hasValue &&
        resultCount !== undefined && (
          <p
            className="mt-1.5 text-[10px] text-text-subtle"
            aria-live="polite"
          >
            {resultCount}{" "}
            {resultCount === 1
              ? "resultado encontrado"
              : "resultados encontrados"}
          </p>
        )}
    </div>
  );
}