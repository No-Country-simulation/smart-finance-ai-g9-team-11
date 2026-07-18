import { Calendar } from "lucide-react";

export function DateRangePicker() {
  return (
    <button
      className="
      flex
      items-center
      gap-3
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
      01 Mai - 31 Mai 2026
      <Calendar size={18} />
    </button>
  );
}
