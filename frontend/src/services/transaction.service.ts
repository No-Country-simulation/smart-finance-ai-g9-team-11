import { api } from "@/services/api";

import type {
  CreateTransactionRequest,
  Transaction,
  TransactionFilters,
  UpdateTransactionRequest,
} from "@/types/transaction";

const TRANSACTIONS_RESOURCE =
  "/classificar-transacoes";

function validateFilters(
  filters?: TransactionFilters,
): void {
  if (!filters) {
    return;
  }

  const hasInitialDate =
    Boolean(filters.dataInicial);

  const hasFinalDate =
    Boolean(filters.dataFinal);

  if (
    hasInitialDate !== hasFinalDate
  ) {
    throw new Error(
      "Informe a data inicial e a data final.",
    );
  }
}

export const transactionService = {
  async findAll(
    filters?: TransactionFilters,
  ): Promise<Transaction[]> {
    validateFilters(filters);

    const response =
      await api.get<Transaction[]>(
        TRANSACTIONS_RESOURCE,
        {
          params: filters,
        },
      );

    return response.data;
  },

  async findById(
    transactionId: number,
  ): Promise<Transaction> {
    const response =
      await api.get<Transaction>(
        `${TRANSACTIONS_RESOURCE}/${transactionId}`,
      );

    return response.data;
  },

  async create(
    request: CreateTransactionRequest,
  ): Promise<Transaction> {
    const response =
      await api.post<Transaction>(
        TRANSACTIONS_RESOURCE,
        request,
      );

    return response.data;
  },

  async createBatch(
    requests:
      CreateTransactionRequest[],
  ): Promise<Transaction[]> {
    const response =
      await api.post<Transaction[]>(
        `${TRANSACTIONS_RESOURCE}/batch`,
        requests,
      );

    return response.data;
  },

  async update(
    transactionId: number,
    request: UpdateTransactionRequest,
  ): Promise<Transaction> {
    const response =
      await api.put<Transaction>(
        `${TRANSACTIONS_RESOURCE}/${transactionId}`,
        request,
      );

    return response.data;
  },

  async remove(
    transactionId: number,
  ): Promise<void> {
    await api.delete(
      `${TRANSACTIONS_RESOURCE}/${transactionId}`,
    );
  },
};