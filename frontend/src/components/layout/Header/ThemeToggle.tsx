import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * Toggle simples light/dark. O ThemeProvider já suporta "system" também
 * (ver src/providers/ThemeProvider.tsx) — se quiser expor as 3 opções em
 * vez de só alternar entre claro/escuro, troque este botão por um
 * DropdownMenu com as 3 opções chamando setTheme("light"|"dark"|"system").
 */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-xl
      border
      border-border
      bg-surface
      text-text
      shadow-card
      transition-all
      duration-200
      ease-out
      hover:-translate-y-0.5
      hover:shadow-elevated
      "
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
