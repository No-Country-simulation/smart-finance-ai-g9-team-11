import type { LucideIcon } from "lucide-react";

export type FinancialAlertType =
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface FinancialAlert {
  id: number;
  title: string;
  type: FinancialAlertType;
  description?: string;
  actionLabel?: string;
}

export interface AlertsProps {
  alerts: readonly FinancialAlert[];
  title?: string;
  description?: string;
  maxVisibleAlerts?: number;
  onAlertAction?: (alert: FinancialAlert) => void;
}

export interface AlertItemProps {
  alert: FinancialAlert;
  onAction?: (alert: FinancialAlert) => void;
}

export interface AlertVisualConfig {
  icon: LucideIcon;
  label: string;
  accentClassName: string;
  iconClassName: string;
  iconContainerClassName: string;
  badgeClassName: string;
}