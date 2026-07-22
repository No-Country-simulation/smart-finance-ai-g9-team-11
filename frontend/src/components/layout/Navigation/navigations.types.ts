import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}