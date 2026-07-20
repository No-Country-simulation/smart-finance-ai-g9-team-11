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
      aria-label={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex min-h-12 w-full min-w-0",
          "items-center overflow-hidden rounded-[14px]",
          "border px-3 py-2.5",
          "transition-[background-color,border-color,color,box-shadow]",
          "duration-200 motion-reduce:transition-none",
          "focus-visible:ring-2 focus-visible:ring-primary",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-surface",
          isCollapsed
            ? "justify-start gap-3 md:justify-center md:gap-0 md:px-2"
            : "justify-start gap-3",
          isActive
            ? [
                "border-primary/35 text-text",
                "bg-gradient-to-r from-primary/30",
                "via-primary/15 to-secondary/10",
                "shadow-[0_0_26px_-12px_var(--glow-primary)]",
              ]
            : [
                "border-transparent text-text-muted",
                "hover:border-border",
                "hover:bg-surface-elevated/75",
                "hover:text-text",
              ],
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className={cn(
                "absolute inset-y-2 left-0 w-0.5",
                "rounded-r-full bg-primary-bright",
                "shadow-[0_0_12px_var(--glow-primary)]",
              )}
              aria-hidden="true"
            />
          )}

          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center",
              "rounded-[10px] transition-colors duration-200",
              "motion-reduce:transition-none",
              isActive
                ? "bg-primary/20 text-primary-bright"
                : [
                    "bg-surface-elevated/55 text-text-muted",
                    "group-hover:bg-surface-elevated",
                    "group-hover:text-text",
                  ],
            )}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.25 : 2}
              aria-hidden="true"
            />
          </span>

          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              "transition-[opacity,transform] duration-200",
              "motion-reduce:transition-none",
              isActive ? "font-semibold" : "font-medium",
              isCollapsed && "md:hidden",
            )}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}