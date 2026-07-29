import { RefreshCw } from "lucide-react";

export function SyncButton() {
  return (
    <button
      className="
      flex
      items-center
      gap-2
      rounded-xl
      border
      border-border
      bg-surface
      px-5
      py-3
      text-sm
      font-medium
      text-text
      shadow-card
      transition-all
      duration-200
      ease-out
      hover:-translate-y-0.5
      hover:shadow-elevated
      "
    >
      <RefreshCw size={18} />
      Sincronizar dados
    </button>
  );
}
