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
        "sticky top-0 z-30 min-w-0",
        "border-b border-border-muted",
        "bg-background/82 backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-background/68",
      )}
    >
      <div
        className={cn(
          "flex min-h-[72px] min-w-0 items-center",
          "justify-between gap-3 px-4 py-3",
          "sm:min-h-[78px] sm:px-5",
          "lg:px-6",
          "2xl:px-7",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center",
                "rounded-[14px] border border-border",
                "bg-card text-text shadow-card",
                "transition-[background-color,border-color,color,transform]",
                "duration-200 ease-out",
                "hover:-translate-y-px",
                "hover:border-border-highlight",
                "hover:bg-card-hover",
                "focus-visible:ring-2 focus-visible:ring-primary",
                "motion-reduce:transition-none",
                "motion-reduce:hover:translate-y-0",
                "md:hidden",
              )}
              aria-label="Abrir menu principal"
            >
              <Menu size={19} aria-hidden="true" />
            </button>
          )}

          <HeaderGreeting />
        </div>

        <HeaderActions />
      </div>
    </header>
  );
}