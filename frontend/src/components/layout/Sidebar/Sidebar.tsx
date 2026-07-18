import { useState } from "react";
import {
  ChevronLeft,
  TrendingUp,
  X,
} from "lucide-react";

import { NAVIGATION_ITEMS } from "@/constants/navigation.constants";
import { cn } from "@/lib/utils";

import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  isMobileOpen,
  onCloseMobile,
}: Readonly<SidebarProps>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = (): void => {
    setIsCollapsed((currentState) => !currentState);
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
          aria-label="Fechar menu principal"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "flex flex-col",
          "border-r border-border bg-surface",
          "transition-[width,transform] duration-300 ease-out",
          "w-[min(18rem,calc(100vw-2rem))]",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
          "md:static md:translate-x-0",
          isCollapsed ? "md:w-[76px]" : "md:w-64",
        )}
        aria-label="Menu principal"
      >
        <div
          className={cn(
            "flex min-h-[72px] items-center",
            "border-b border-border",
            isCollapsed
              ? "justify-between px-4 md:justify-center md:px-2"
              : "justify-between px-5",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center",
                "rounded-xl bg-primary/10 text-primary",
              )}
            >
              <TrendingUp size={20} aria-hidden="true" />
            </div>

            <span
              className={cn(
                "truncate text-base font-bold text-text",
                isCollapsed && "md:hidden",
              )}
            >
              Finance AI
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center",
              "rounded-lg text-text-muted",
              "transition-colors",
              "hover:bg-surface-muted hover:text-text",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary",
              "md:hidden",
            )}
            aria-label="Fechar menu principal"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <nav
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            "gap-1 overflow-y-auto px-3 py-4",
          )}
          aria-label="Navegação da aplicação"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              onNavigate={onCloseMobile}
            />
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "hidden min-h-10 w-full items-center",
              "rounded-xl text-sm font-medium text-text-muted",
              "transition-colors duration-200",
              "hover:bg-surface-muted hover:text-text",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary",
              "md:flex",
              isCollapsed
                ? "justify-center px-2"
                : "justify-start gap-3 px-3",
            )}
            aria-label={
              isCollapsed
                ? "Expandir menu lateral"
                : "Recolher menu lateral"
            }
            aria-expanded={!isCollapsed}
          >
            <ChevronLeft
              size={17}
              className={cn(
                "shrink-0 transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
              aria-hidden="true"
            />

            {!isCollapsed && <span>Recolher menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
}