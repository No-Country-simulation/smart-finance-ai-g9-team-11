import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { dashboardService } from "@/services/dashboard.service";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableRow } from "./TransactionsTableRow";
import { TransactionsTableSearch } from "./TransactionsTableSearch";

export function TransactionsTable() {
  const [search, setSearch] = useState("");

  const transactions = dashboardService.getTransactions();

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter(
      ({ description, category }) =>
        description.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term),
    );
  }, [search, transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Transações Recentes</CardTitle>

        <TransactionsTableSearch
          value={search}
          onChange={setSearch}
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <TransactionsTableHeader />

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionsTableRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}