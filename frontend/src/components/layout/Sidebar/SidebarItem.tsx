import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation.types";

interface SidebarItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  isCollapsed,
  onNavigate,
}: Readonly<SidebarItemProps>) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group flex min-h-11 w-full min-w-0 items-center",
          "visible opacity-100",
          "rounded-xl px-3 py-2.5",
          "transition-colors duration-200",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          isCollapsed
            ? "justify-center gap-0"
            : "justify-start gap-3",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-muted hover:bg-surface-muted hover:text-text",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={isActive ? 2.25 : 2}
            className={cn(
              "block shrink-0",
              isActive
                ? "text-primary"
                : "text-text-muted group-hover:text-text",
            )}
            aria-hidden="true"
          />

          {!isCollapsed && (
            <span
              className={cn(
                "block min-w-0 truncate text-sm",
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
}