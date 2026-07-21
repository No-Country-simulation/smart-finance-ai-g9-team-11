import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/useTheme";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Mudar para tema claro"
          : "Mudar para tema escuro"
      }
      title={
        isDark
          ? "Ativar tema claro"
          : "Ativar tema escuro"
      }
      className={cn(
        "flex size-10 shrink-0 items-center justify-center",
        "rounded-[14px] border border-border bg-card",
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
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}