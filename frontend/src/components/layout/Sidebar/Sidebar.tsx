import { useState } from "react";
import { ChevronLeft, TrendingUp } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { NAVIGATION_ITEMS } from "../../../constants/navigation.constants";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * Sidebar principal da aplicação.
 *
 * Dois estados independentes:
 * - isCollapsed: comportamento DESKTOP (usuário encolhe a sidebar pra ganhar espaço)
 * - isMobileOpen: comportamento MOBILE (sidebar vira um drawer que desliza)
 *
 * Por que não usar o componente Sheet do shadcn aqui?
 * Porque a Sheet usa Portal + Dialog por baixo dos panos, o que duplicaria
 * a árvore de navegação (uma pra desktop, outra dentro da Sheet pra mobile).
 * Controlando a posição via CSS puro (translate-x), o MESMO componente
 * serve pros dois cenários — menos código, menos bugs de sincronização.
 */
export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Overlay escuro atrás da sidebar no mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-navy-900 transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[76px]" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-4 py-5">
          <TrendingUp className="shrink-0 text-brand-500" size={22} />
          {!isCollapsed && (
            <span className="text-base font-medium text-white">Finance AI</span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2">
          {NAVIGATION_ITEMS.map((item, index) => (
            <SidebarItem
              key={item.id}
              item={item}
              index={index}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Botão de colapsar — só faz sentido em desktop */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="mx-2 mb-4 hidden items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:flex"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </aside>
    </>
  );
}