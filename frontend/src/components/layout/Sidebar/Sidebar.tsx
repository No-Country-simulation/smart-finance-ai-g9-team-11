import { NavLink } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation.types";

interface SidebarItemProps {
  item: NavigationItem;
  index: number;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

/**
 * Renderiza um item da navegação principal.
 *
 * O componente recebe a configuração da rota e não possui conhecimento
 * sobre a lista completa de navegação.
 */
export function SidebarItem({
  item,
  index,
  isCollapsed,
  onNavigate,
}: Readonly<SidebarItemProps>) {
  const Icon = item.icon;

  const navigationLink = (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      style={{
        transitionDelay: `${Math.min(index * 30, 150)}ms`,
      }}
      className={({ isActive }) =>
        cn(
          "group flex min-h-11 w-full min-w-0 items-center",
          "rounded-xl px-3 py-2.5",
          "transition-[background-color,color,transform]",
          "duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus-visible:ring-offset-surface",
          isCollapsed
            ? "justify-center gap-0"
            : "justify-start gap-3",
          isActive
            ? "bg-primary/10 text-primary"
            : [
                "text-text-muted",
                "hover:bg-surface-muted hover:text-text",
                "active:scale-[0.98]",
              ],
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={19}
            strokeWidth={isActive ? 2.25 : 2}
            className={cn(
              "shrink-0 transition-colors duration-200",
              isActive
                ? "text-primary"
                : "text-text-muted group-hover:text-text",
            )}
            aria-hidden="true"
          />

          {!isCollapsed && (
            <span
              className={cn(
                "min-w-0 truncate text-sm",
                isActive ? "font-semibold" : "font-medium",
              )}
            >
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!isCollapsed) {
    return navigationLink;
  }

  return (
    <Tooltip>
      <TooltipTrigger className="block w-full">
        {navigationLink}
      </TooltipTrigger>

      <TooltipContent side="right">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}