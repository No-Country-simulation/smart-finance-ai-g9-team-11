import type { ReactNode } from "react";

export type Trend = "up" | "down" | "neutral";

export interface FinancialCardProps {
  title: string;
  value: string;
  variation: string;
  trend: Trend;
  icon: ReactNode;}