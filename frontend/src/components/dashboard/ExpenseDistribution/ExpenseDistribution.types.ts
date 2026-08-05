export interface ExpenseDistributionCategory {
  name: string;
  value: number;
}

export interface ExpenseDistributionItem
  extends ExpenseDistributionCategory {
  percentage: number;
  color: string;
}

export interface ExpenseDistributionProps {
  title?: string;
  description?: string;
  categories?: readonly ExpenseDistributionCategory[];
  maxVisibleCategories?: number;
  onViewDetails?: () => void;
}

export interface ExpenseDistributionTooltipPayload {
  name?: string;
  value?: number | string;
  payload?: ExpenseDistributionItem;
}

export interface ExpenseDistributionTooltipProps {
  active?: boolean;
  payload?: readonly ExpenseDistributionTooltipPayload[];
}