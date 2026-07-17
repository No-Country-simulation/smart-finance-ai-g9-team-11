import type { ReactNode } from "react";

export type CardTone = "default" | "accent" | "accent-2";

export interface CardProps {
  children: ReactNode;
  className?: string;
  /**
   * "default" — plain surface (most cards)
   * "accent"  — tinted background for a highlighted KPI (e.g. "Views")
   * "accent-2" — secondary tint for variety in a KPI row (e.g. "Active Users")
   */
  tone?: CardTone;
}

export interface CardSectionProps {
  children: ReactNode;
  className?: string;
}
