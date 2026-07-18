import { NAVIGATION_ITEMS } from "@/constants/navigation.constants";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  isMobileOpen,
  onCloseMobile,
}: Readonly<SidebarProps>) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-72 flex-col gap-4 border-r border-border bg-background p-4",
        "transition-transform duration-300 ease-out md:static md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
      )}
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
          Menu
        </p>

        {onCloseMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="text-sm font-medium text-text-muted hover:text-text md:hidden"
          >
            Fechar
          </button>
        ) : null}
      </div>

      <nav className="flex flex-col gap-2">
        {NAVIGATION_ITEMS.map((item, index) => (
          <SidebarItem
            key={item.id}
            item={item}
            index={index}
            isCollapsed={false}
          />
        ))}
      </nav>
    </aside>
  );
}
