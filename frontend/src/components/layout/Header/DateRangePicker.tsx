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
      01 Mai - 31 Mai 2026

      <Calendar size={18} />
    </button>
  );
}