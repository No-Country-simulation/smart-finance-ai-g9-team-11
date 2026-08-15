import type {
  DashboardTransaction,
} from "@/types/dashboard";

export interface TransactionsTableProps {
  transactions?: readonly DashboardTransaction[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
}

export interface TransactionsTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export interface TransactionsTableRowProps {
  transaction: DashboardTransaction;
}