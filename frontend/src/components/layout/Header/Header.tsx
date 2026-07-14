import { HeaderActions } from "./HeaderActions";
import { HeaderGreeting } from "./HeaderGreeting";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
      <div className="flex items-center gap-4">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
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
