import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      className="
      relative
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-xl
      border
      border-slate-200
      bg-white
      shadow-sm
      transition-all
      hover:-translate-y-0.5
      hover:shadow-md
      "
    >
      <Bell size={20} />

      <span
        className="
        absolute
        right-3
        top-3
        h-2
        w-2
        rounded-full
        bg-red-500
        "
      />
    </button>
  );
}