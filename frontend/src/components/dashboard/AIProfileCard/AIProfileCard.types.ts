export type AIFinancialClassification =
  | "healthy"
  | "attention"
  | "risk";

export type AIFinancialIndicatorStatus =
  | "good"
  | "attention"
  | "critical";

export interface AIFinancialIndicator {
  id: string;
  label: string;
  value: number;
  status: AIFinancialIndicatorStatus;
}

export interface AIFinancialProfile {
  classification: AIFinancialClassification;
  riskLabel: string;
  confidence: number;
  indicators: readonly AIFinancialIndicator[];
}

export interface AIProfileCardProps {
  title?: string;
  description?: string;
  profile?: AIFinancialProfile;
  onViewDetails?: () => void;
}

export interface AIConfidenceGaugeProps {
  value: number;
  size?: number;
}

export interface AIClassificationVisualConfig {
  label: string;
  description: string;
  accentClassName: string;
  badgeClassName: string;
  iconContainerClassName: string;
  iconClassName: string;
}