import { LayoutDashboard, LineChart, Settings, User } from "lucide-react";
import type { NavigationItem } from "@/types/navigation.types";

/**
 * Fonte única dos itens da Sidebar. Adicionar uma página nova ao app =
 * adicionar uma linha aqui (e a rota correspondente em App.tsx).
 *
 * "settings" aponta pra uma rota que ainda não existe (src/pages/Settings
 * só tem index.ts) — o item aparece na sidebar mas não navega pra lugar
 * nenhum até a SettingsPage ser criada e a rota ser registrada.
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    id: "analysis",
    label: "Análise",
    path: "/analysis",
    icon: LineChart,
  },
  {
    id: "profile",
    label: "Perfil",
    path: "/profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/settings",
    icon: Settings,
  },
];
