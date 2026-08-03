export const TRANSACTION_TYPES = [
  "Receita",
  "Despesa",
] as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_CATEGORIES = [
  "Alimentação",
  "Utilitários",
  "Moradia",
  "Investimento",
  "Compras",
  "Saúde",
  "Entretenimento",
  "Trajeto",
  "Salário",
  "Outros",
] as const;

export type TransactionCategory =
  (typeof TRANSACTION_CATEGORIES)[number];

export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  categoria: TransactionCategory;
  data: string;
  usuarioId: number;
}

export interface CreateTransactionRequest {
  descricao: string;
  valor: number;
  tipo: TransactionType;
  data: string;
}

export type UpdateTransactionRequest =
  CreateTransactionRequest;

export interface TransactionFilters {
  dataInicial?: string;
  dataFinal?: string;
}
