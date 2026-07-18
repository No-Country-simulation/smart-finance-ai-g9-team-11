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
          "flex size-11 shrink-0 items-center justify-center",
          "rounded-xl border border-border bg-surface",
          "shadow-card transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-elevated",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
        )}
        aria-label={`Abrir menu de ${user.name}`}
      >
        <Avatar className="size-8">
          <AvatarImage
            src={user.avatar}
            alt={`Foto de ${user.name}`}
          />

          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={user.avatar}
                alt={`Foto de ${user.name}`}
              />

              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
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
          className="cursor-pointer gap-2"
        >
          <UserRound size={16} aria-hidden="true" />
          Minha conta
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => handleNavigate("/settings")}
          className="cursor-pointer gap-2"
        >
          <Settings size={16} aria-hidden="true" />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled
          className="gap-2"
        >
          <CircleHelp size={16} aria-hidden="true" />

          <span>Central de ajuda</span>

          <span className="ml-auto text-[10px] text-text-muted">
            Em breve
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleLogout}
          className="cursor-pointer gap-2 text-danger focus:text-danger"
        >
          <LogOut size={16} aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}