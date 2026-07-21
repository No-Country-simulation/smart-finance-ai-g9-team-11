import {
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";

import type { NavigationItem } from "@/types/navigation.types";

export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Meu perfil",
    path: "/profile",
    icon: UserRound,
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/settings",
    icon: Settings,
  },
] satisfies readonly NavigationItem[];