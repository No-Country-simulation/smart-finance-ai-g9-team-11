import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

/**
 * Header fixo no topo da área de conteúdo.
 * Não conhece rotas nem estado global — recebe só o callback pra abrir
 * a sidebar no mobile. Isso é "inversão de controle": o AppLayout decide
 * o que acontece, o Header só avisa que o botão foi clicado.
 */
export function Header({ onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md motion-safe:animate-fade-up md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Buscar transação..."
            className="w-64 border-slate-200 bg-slate-50 pl-9 focus-visible:ring-brand-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notificações"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-brand-600" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-brand-500 transition-transform focus-visible:ring-2 active:scale-95">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-brand-100 text-sm font-medium text-brand-700">
                MJ
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Meu perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}