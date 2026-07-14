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
      border-slate-200
      bg-white
      px-5
      py-3
      text-sm
      font-medium
      shadow-sm
      transition-all
      hover:-translate-y-0.5
      hover:shadow-md
      "
    >
      <RefreshCw size={18} />

      Sincronizar dados
    </button>
  );
}