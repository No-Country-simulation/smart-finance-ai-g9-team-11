import type { ReactNode } from "react";

export interface FinancialCardProps {
  id?: string;
  title: string;
  value: string;
  variation: string;

  trend: "up" | "down" | "neutral";

  icon: ReactNode;

  updatedAt?: string;

  className?: string;
}