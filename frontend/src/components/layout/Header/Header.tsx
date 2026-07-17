import { HeaderActions } from "./HeaderActions";
import { HeaderGreeting } from "./HeaderGreeting";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-8 py-6">
      <div className="flex items-center gap-4">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 text-text hover:bg-surface-muted md:hidden"
            aria-label="Abrir menu"
          >
            ☰
          </button>
        )}

        <HeaderGreeting />
      </div>

      <HeaderActions />
    </header>
  );
}
