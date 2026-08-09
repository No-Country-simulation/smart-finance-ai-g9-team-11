import type {
  Transaction as ApiTransaction,
  TransactionCategory,
} from "@/types/transaction";

export interface DashboardSummary {
  balance: number;
  income: number;
  expenses: number;
  transactionCount: number;
}

export interface DashboardCashFlowItem {
  month: string;
  year: number;
  monthNumber: number;
  income: number;
  expenses: number;
}

export interface DashboardExpenseCategory {
  name: TransactionCategory;
  value: number;
}

export type DashboardTransactionType =
  | "income"
  | "expense";

export type DashboardTransactionStatus =
  "completed";

export interface DashboardTransaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: DashboardTransactionType;
  status: DashboardTransactionStatus;
}

export interface DashboardData {
  summary: DashboardSummary;
  cashFlow: DashboardCashFlowItem[];
  categories: DashboardExpenseCategory[];
  transactions: DashboardTransaction[];
}

export interface DashboardPeriod {
  dataInicial?: string;
  dataFinal?: string;
}

export interface DashboardMonthlyAccumulator {
  year: number;
  monthNumber: number;
  income: number;
  expenses: number;
}

export function mapTransactionToDashboard(
  transaction: ApiTransaction,
): DashboardTransaction {
  const isIncome =
    transaction.tipo === "Receita";

  return {
    id: transaction.id,
    description:
      transaction.descricao,
    category:
      transaction.categoria,
    amount: isIncome
      ? transaction.valor
      : -transaction.valor,
    date: transaction.data,
    type: isIncome
      ? "income"
      : "expense",
    status: "completed",
  };
}