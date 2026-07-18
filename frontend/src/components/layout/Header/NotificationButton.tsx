import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      aria-label="Notificações"
      className="
      relative
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-xl
      border
      border-border
      bg-surface
      text-text
      shadow-card
      transition-all
      duration-200
      ease-out
      hover:-translate-y-0.5
      hover:shadow-elevated
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
        bg-danger
        "
      />
    </button>
  );
}
