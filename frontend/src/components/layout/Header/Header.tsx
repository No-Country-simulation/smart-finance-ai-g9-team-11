import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { HeaderActions } from "./HeaderActions";
import { HeaderGreeting } from "./HeaderGreeting";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({
  onOpenMobileSidebar,
}: Readonly<HeaderProps>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-w-0 items-center",
        "justify-between gap-3 border-b border-border",
        "bg-surface/95 px-4 py-4 backdrop-blur",
        "supports-[backdrop-filter]:bg-surface/80",
        "sm:px-6 sm:py-5",
        "lg:px-8 lg:py-6",
      )}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {onOpenMobileSidebar && (
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center",
              "rounded-xl border border-border bg-surface",
              "text-text shadow-card transition-colors",
              "hover:bg-surface-muted",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary",
              "md:hidden",
            )}
            aria-label="Abrir menu principal"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        )}

        <HeaderGreeting />
      </div>

      <HeaderActions />
    </header>
  );
}