import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import type { UserMenuProps } from "./UserMenu.types";

function getUserInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserMenu({
  user,
  isOnline,
  onOpenSidebar,
}: Readonly<UserMenuProps>) {
  const initials = getUserInitials(user.name);
  const statusLabel = isOnline
    ? "Usuário online"
    : "Usuário offline";

  return (
    <button
      type="button"
      onClick={onOpenSidebar}
      className={cn(
        "relative flex size-10 shrink-0 items-center",
        "justify-center rounded-[14px]",
        "border border-border bg-card",
        "shadow-card",
        "transition-[background-color,border-color,transform,box-shadow]",
        "duration-200 ease-out",
        "hover:-translate-y-px",
        "hover:border-border-highlight",
        "hover:bg-card-hover hover:shadow-elevated",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
      )}
      aria-label={`${statusLabel}. Abrir menu lateral.`}
      title={`${statusLabel} — abrir menu lateral`}
    >
      <Avatar className="size-8 border border-border-highlight">
        <AvatarImage
          src={user.avatar}
          alt={`Foto de ${user.name}`}
        />

        <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary-bright">
          {initials}
        </AvatarFallback>
      </Avatar>

      <span
        className={cn(
          "absolute bottom-0.5 right-0.5 size-2.5",
          "rounded-full border-2 border-card",
          isOnline
            ? "bg-success shadow-[0_0_8px_var(--success)]"
            : "bg-text-subtle",
        )}
        aria-hidden="true"
      />

      <span className="sr-only">
        {statusLabel}
      </span>
    </button>
  );
}