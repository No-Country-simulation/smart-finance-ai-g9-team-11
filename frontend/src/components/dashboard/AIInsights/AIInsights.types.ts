import type { LucideIcon } from "lucide-react";

export type InsightTone =
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface AIInsightsProps {
  title?: string;
  subtitle?: string;
  maxVisibleInsights?: number;
}

export interface InsightPresentation {
  icon: LucideIcon;
  tone: InsightTone;
  title: string;
}

export interface InsightItemProps {
  insight: string;
  presentation: InsightPresentation;
}