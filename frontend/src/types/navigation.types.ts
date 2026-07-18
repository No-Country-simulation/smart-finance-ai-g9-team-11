import type { LucideIcon } from "lucide-react";

/**
 * Representa um item de navegação da Sidebar.
 * `icon` recebe o componente do lucide-react diretamente (não uma string),
 * assim evitamos um switch/case gigante pra resolver qual ícone renderizar.
 */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}