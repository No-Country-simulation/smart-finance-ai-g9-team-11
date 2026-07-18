import type { Transaction } from "@/types/dashboard";

export interface TransactionsTableProps {
  transactions: Transaction[];
}

export interface TransactionsTableSearchProps {
  value: string;
  onChange: (value: string) => void;
}