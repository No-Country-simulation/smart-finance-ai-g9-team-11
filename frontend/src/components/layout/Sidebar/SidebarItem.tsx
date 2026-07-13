import { NavLink } from "react-router-dom";
import type { NavigationItem } from "../../../types/navigation.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";

interface SidebarItemProps {
  item: NavigationItem;
  index: number;
  isCollapsed: boolean;
}

/**
 * Item individual de navegação.
 * Componente pequeno de propósito: só sabe renderizar UM item.
 * Quem decide QUAIS itens existem é o array em navigation.constants.ts.
 */
export function SidebarItem({ item, index, isCollapsed }: SidebarItemProps) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      style={{ animationDelay: `${index * 60}ms` }}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2.5 opacity-0 motion-safe:animate-slide-in transition-colors duration-200 ${
          isActive
            ? "bg-brand-600/20 text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`shrink-0 transition-colors duration-200 ${
              isActive ? "text-brand-500" : "text-slate-400 group-hover:text-white"
            }`}
          />
          {!isCollapsed && (
            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  // Quando a sidebar está colapsada, o label some — então precisamos
  // de um Tooltip pra não perder a informação de qual ícone é qual.
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}