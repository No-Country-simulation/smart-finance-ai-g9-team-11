import {
  CircleHelp,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onLogout,
}: Readonly<UserMenuProps>) {
  const navigate = useNavigate();
  const initials = getUserInitials(user.name);

  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  const handleLogout = (): void => {
    if (onLogout) {
      onLogout();
      return;
    }

    console.info(
      "Logout será integrado ao fluxo de autenticação.",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex size-10 shrink-0 items-center justify-center",
          "rounded-[14px] border border-border bg-card",
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
        aria-label={`Abrir menu de ${user.name}`}
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
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={cn(
          "w-64 rounded-[16px]",
          "border-border bg-surface-elevated",
          "text-text shadow-elevated",
        )}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0 border border-border-highlight">
              <AvatarImage
                src={user.avatar}
                alt={`Foto de ${user.name}`}
              />

              <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary-bright">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">
                {user.name}
              </p>

              <p className="truncate text-xs text-text-muted">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => handleNavigate("/profile")}
          className="cursor-pointer gap-2 rounded-[10px]"
        >
          <UserRound size={16} aria-hidden="true" />
          Minha conta
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => handleNavigate("/settings")}
          className="cursor-pointer gap-2 rounded-[10px]"
        >
          <Settings size={16} aria-hidden="true" />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled
          className="gap-2 rounded-[10px]"
        >
          <CircleHelp size={16} aria-hidden="true" />

          <span>Central de ajuda</span>

          <span className="ml-auto text-[10px] text-text-subtle">
            Em breve
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleLogout}
          className={cn(
            "cursor-pointer gap-2 rounded-[10px]",
            "text-danger focus:text-danger",
          )}
        >
          <LogOut size={16} aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}