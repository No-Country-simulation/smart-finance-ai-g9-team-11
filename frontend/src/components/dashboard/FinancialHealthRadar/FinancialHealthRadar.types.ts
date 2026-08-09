export type FinancialHealthStatus =
  | "excellent"
  | "good"
  | "attention"
  | "critical";

export interface FinancialHealthMetric {
  id: string;
  subject: string;
  value: number;
  fullMark: number;
  description: string;
}

export interface FinancialHealthRadarProps {
  title?: string;
  description?: string;
  metrics?: readonly FinancialHealthMetric[];
  onViewDetails?: () => void;
}

export interface FinancialHealthRadarDetailProps {
  metric: FinancialHealthMetric;
}

export interface FinancialHealthStatusConfig {
  label: string;
  className: string;
  progressClassName: string;
}