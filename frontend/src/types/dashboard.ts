import type { FinancialAlert } from "@/components/dashboard/Alerts";
import type { BalanceChartData } from "@/components/dashboard/BalanceChart";
import type { ExpenseCategory } from "@/components/dashboard/ExpenseChart/ExpenseChart.types";
import type { FinancialCardProps } from "@/components/dashboard/FinancialCard";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  status: "completed" | "pending";
}

export interface FinancialScore {
  score: number;
  maxScore: number;
  classification:
    | "Excelente"
    | "Bom"
    | "Regular"
    | "Baixo";
  variation: string;
}

export interface FinancialHealth
  extends FinancialScore {
  insights: string[];
  alerts: FinancialAlert[];
}

export interface DashboardMock {
  summary: FinancialCardProps[];
  cashFlow: BalanceChartData[];
  categories: ExpenseCategory[];
  transactions: Transaction[];
  financialHealth: FinancialHealth;
}