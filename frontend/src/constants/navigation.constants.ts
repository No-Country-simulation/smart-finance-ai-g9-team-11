import {
  LayoutDashboard,
  Receipt,
  LineChart,
  UserCircle,
  Settings,
} from "lucide-react";
import type { NavigationItem } from "../types/navigation.types";

/**
 * Fonte única de verdade para os itens da Sidebar.
 * Se amanhã precisarmos adicionar uma página nova, mexemos SÓ aqui —
 * a Sidebar não sabe (e não precisa saber) quais páginas existem.
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { id: "transactions", label: "Transações", path: "/transactions", icon: Receipt },
  { id: "analysis", label: "Análise", path: "/analysis", icon: LineChart },
  { id: "profile", label: "Perfil", path: "/profile", icon: UserCircle },
  { id: "settings", label: "Configurações", path: "/settings", icon: Settings },
];