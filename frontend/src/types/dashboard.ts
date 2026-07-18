import type { BalanceChartData } from "@/components/dashboard/BalanceChart/BalanceChart.types";
import type { ExpenseCategory } from "@/components/dashboard/ExpenseChart/ExpenseChart.types";
import type { FinancialAlert } from "@/components/dashboard/Alerts";
import type { FinancialCardProps } from "@/components/dashboard/FinancialCard/FinancialCard.types";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;

  /**
   * Tipo da movimentação.
   * Utilizado para cores, gráficos e indicadores.
   */
  type: "income" | "expense";

  /**
   * Estado da transação.
   * Futuramente virá do backend.
   */
  status: "completed" | "pending";
}

export interface FinancialScore {
  score: number;
  maxScore: number;
  classification: "Excelente" | "Bom" | "Regular" | "Baixo";
  variation: string;
}

export interface FinancialHealth {
  score: number;
  maxScore: number;
  classification: "Excelente" | "Bom" | "Regular" | "Baixo";
  variation: string;
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