import {
  mapTransactionToDashboard,
  type DashboardCashFlowItem,
  type DashboardData,
  type DashboardExpenseCategory,
  type DashboardMonthlyAccumulator,
  type DashboardSummary,
} from "@/types/dashboard";

import {
  isExpenseTransaction,
  isIncomeTransaction,
  type Transaction,
  type TransactionCategory,
  type TransactionFilters,
} from "@/types/transaction";

import { transactionService } from "@/services/transaction.service";

const MONTH_FORMATTER =
  new Intl.DateTimeFormat(
    "pt-BR",
    {
      month: "short",
    },
  );

const MAX_CASH_FLOW_MONTHS = 6;
const MAX_RECENT_TRANSACTIONS = 8;

function createSummary(
  transactions: readonly Transaction[],
): DashboardSummary {
  const income = transactions
    .filter(isIncomeTransaction)
    .reduce(
      (total, transaction) =>
        total + Number(transaction.valor),
      0,
    );

  const expenses = transactions
    .filter(isExpenseTransaction)
    .reduce(
      (total, transaction) =>
        total + Number(transaction.valor),
      0,
    );

  return {
    balance: income - expenses,
    income,
    expenses,
    transactionCount:
      transactions.length,
  };
}

function createExpenseCategories(
  transactions: readonly Transaction[],
): DashboardExpenseCategory[] {
  const categoryTotals =
    new Map<TransactionCategory, number>();

  transactions
    .filter(isExpenseTransaction)
    .forEach((transaction) => {
      const currentValue =
        categoryTotals.get(
          transaction.categoria,
        ) ?? 0;

      categoryTotals.set(
        transaction.categoria,
        currentValue +
          Number(transaction.valor),
      );
    });

  return Array.from(
    categoryTotals.entries(),
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort(
      (first, second) =>
        second.value - first.value,
    );
}

function getMonthKey(
  year: number,
  monthNumber: number,
): string {
  return `${year}-${String(
    monthNumber,
  ).padStart(2, "0")}`;
}

function createCashFlow(
  transactions: readonly Transaction[],
): DashboardCashFlowItem[] {
  const monthlyData =
    new Map<
      string,
      DashboardMonthlyAccumulator
    >();

  transactions.forEach(
    (transaction) => {
      const date = new Date(
        `${transaction.data}T00:00:00`,
      );

      if (
        Number.isNaN(
          date.getTime(),
        )
      ) {
        return;
      }

      const year =
        date.getFullYear();

      const monthNumber =
        date.getMonth() + 1;

      const key =
        getMonthKey(
          year,
          monthNumber,
        );

      const current =
        monthlyData.get(key) ?? {
          year,
          monthNumber,
          income: 0,
          expenses: 0,
        };

      const value =
        Number(transaction.valor);

      if (
        transaction.tipo ===
        "Receita"
      ) {
        current.income += value;
      }
      else {
        current.expenses += value;
      }

      monthlyData.set(
        key,
        current,
      );
    },
  );

  return Array.from(
    monthlyData.values(),
  )
    .sort((first, second) => {
      if (
        first.year !== second.year
      ) {
        return (
          first.year -
          second.year
        );
      }

      return (
        first.monthNumber -
        second.monthNumber
      );
    })
    .slice(
      -MAX_CASH_FLOW_MONTHS,
    )
    .map((item) => {
      const referenceDate =
        new Date(
          item.year,
          item.monthNumber - 1,
          1,
        );

      const formattedMonth =
        MONTH_FORMATTER
          .format(referenceDate)
          .replace(".", "");

      return {
        month:
          formattedMonth
            .charAt(0)
            .toLocaleUpperCase(
              "pt-BR",
            ) +
          formattedMonth.slice(1),
        year: item.year,
        monthNumber:
          item.monthNumber,
        income:
          item.income,
        expenses:
          item.expenses,
      };
    });
}

function createRecentTransactions(
  transactions: readonly Transaction[],
) {
  return [...transactions]
    .sort((first, second) => {
      const dateComparison =
        second.data.localeCompare(
          first.data,
        );

      if (
        dateComparison !== 0
      ) {
        return dateComparison;
      }

      return second.id - first.id;
    })
    .slice(
      0,
      MAX_RECENT_TRANSACTIONS,
    )
    .map(
      mapTransactionToDashboard,
    );
}

function createDashboardData(
  transactions: readonly Transaction[],
): DashboardData {
  return {
    summary:
      createSummary(transactions),

    cashFlow:
      createCashFlow(transactions),

    categories:
      createExpenseCategories(
        transactions,
      ),

    transactions:
      createRecentTransactions(
        transactions,
      ),
  };
}

export const dashboardService = {
  async getDashboardData(
    filters?: TransactionFilters,
  ): Promise<DashboardData> {
    const transactions =
      await transactionService.findAll(
        filters,
      );

    return createDashboardData(
      transactions,
    );
  },

  /*
   * Compatibilidade temporária.
   *
   * Estes métodos serão removidos conforme
   * migrarmos os componentes restantes para
   * receber dados por props.
   */

  getCashFlow() {
    return [];
  },

  getCategories() {
    return [];
  },

  getTransactions() {
    return [];
  },

  getInsights(): string[] {
    return [];
  },

  getScore() {
    return {
      score: 0,
      maxScore: 100,
      classification:
        "Regular" as const,
      variation:
        "Análise financeira pendente",
    };
  },

  getAlerts() {
    return [];
  },
};