export interface BalanceChartData {
  month: string;
  income: number;
  expenses: number;
}

export interface BalanceChartTooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

export interface BalanceChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: readonly BalanceChartTooltipPayload[];
}