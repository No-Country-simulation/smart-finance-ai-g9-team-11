import type { FinancialCardProps } from "@/components/dashboard/FinancialCard/FinancialCard.types";
import type { BalanceChartData } from "@/components/dashboard/BalanceChart/BalanceChart.types";
import type { ExpenseCategory } from "@/components/dashboard/ExpenseChart/ExpenseChart.types";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export interface DashboardMock {
  summary: FinancialCardProps[];

  cashFlow: BalanceChartData[];

  categories: ExpenseCategory[];

  transactions: Transaction[];

  insights: string[];
}