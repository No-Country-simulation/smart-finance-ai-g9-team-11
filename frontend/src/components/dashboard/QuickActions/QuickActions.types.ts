import type { LucideIcon } from "lucide-react";

export type QuickActionId =
  | "add-transaction"
  | "run-analysis"
  | "view-recommendations"
  | "import-transactions";

export type QuickActionVariant =
  | "primary"
  | "neutral"
  | "success"
  | "warning";

export interface QuickAction {
  id: QuickActionId;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: QuickActionVariant;
  disabled?: boolean;
  badge?: string;
}

export interface QuickActionsProps {
  actions?: readonly QuickAction[];
  title?: string;
  description?: string;
  onAction?: (action: QuickAction) => void;
}

export interface QuickActionButtonProps {
  action: QuickAction;
  onAction?: (action: QuickAction) => void;
}