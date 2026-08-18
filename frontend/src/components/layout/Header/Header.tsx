import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { HeaderActions } from "./HeaderActions";
import { HeaderGreeting } from "./HeaderGreeting";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
  onOpenSidebar?: () => void;
}

export function Header({
  onOpenMobileSidebar,
  onOpenSidebar,
}: Readonly<HeaderProps>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "w-full min-w-0",

        /*
         * Mobile:
         * mantém contraste e legibilidade.
         */
        "border-b border-border-muted",
        "bg-background/82 backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-background/68",

        /*
         * Desktop:
         * mantém o Header no topo,
         * mas deixa o fundo transparente.
         */
        "md:border-b-transparent",
        "md:bg-transparent",
        "md:backdrop-blur-none",
        "md:supports-[backdrop-filter]:bg-transparent",
      )}
    >
      <div
        className={cn(
          "flex min-h-16 w-full min-w-0",
          "items-center justify-between",
          "gap-2 px-4 py-2.5",

          "sm:min-h-[72px]",
          "sm:gap-3 sm:px-5 sm:py-3",

          "lg:min-h-[78px]",
          "lg:px-6",

          "2xl:px-7",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1",
            "items-center gap-2.5",
            "sm:gap-3",
          )}
        >
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className={cn(
                "flex size-10 shrink-0",
                "items-center justify-center",
                "rounded-[14px]",
                "border border-border",
                "bg-card text-text shadow-card",

                "transition-[background-color,border-color,color,transform]",
                "duration-200 ease-out",

                "hover:-translate-y-px",
                "hover:border-border-highlight",
                "hover:bg-card-hover",

                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",

                "motion-reduce:transition-none",
                "motion-reduce:hover:translate-y-0",

                "md:hidden",
              )}
              aria-label="Abrir menu principal"
              aria-haspopup="dialog"
            >
              <Menu
                size={19}
                aria-hidden="true"
              />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <HeaderGreeting />
          </div>
        </div>

        <div className="min-w-0 shrink-0">
          <HeaderActions
            onOpenSidebar={onOpenSidebar}
          />
        </div>
      </div>
    </header>
  );
}