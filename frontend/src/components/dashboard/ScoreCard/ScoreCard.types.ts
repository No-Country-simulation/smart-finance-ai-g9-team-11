import type {
  FinancialProfile,
} from "@/types/financial-analysis";

export interface ScoreGaugeProps {
  score: number;
  maxScore: number;
}

export interface ScoreCardProps {
  title?: string;
  confidence?: number | null;
  profile?: FinancialProfile | null;
  debtLevel?: number | null;
  analysisDate?: string | null;
  isLoading?: boolean;
}