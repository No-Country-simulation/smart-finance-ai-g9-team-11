import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  UserRound,
  WalletCards,
} from "lucide-react";

import type {
  NavigationItem,
} from "@/types/navigation.types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/app",
    icon: LayoutDashboard,
  },
  {
    id: "transactions",
    label: "Transações",
    path: "/app/transactions",
    icon: WalletCards,
  },
  {
    id: "analysis",
    label: "Análise",
    path: "/app/analysis",
    icon: ChartNoAxesCombined,
  },
  {
    id: "profile",
    label: "Perfil",
    path: "/app/profile",
    icon: UserRound,
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/app/settings",
    icon: Settings,
  },
];