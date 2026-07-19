import {
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  ReceiptText,
  SearchX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableRow } from "./TransactionsTableRow";
import { TransactionsTableSearch } from "./TransactionsTableSearch";

import type {
  TransactionsTableProps,
} from "./TransactionsTable.types";

export function TransactionsTable({
  transactions: providedTransactions,
  title = "Transações recentes",
  description = "Acompanhe as movimentações mais recentes da sua conta.",
  onViewAll,
}: Readonly<TransactionsTableProps>) {
  const [search, setSearch] = useState("");

  const serviceTransactions =
    dashboardService.getTransactions();

  const transactions =
    providedTransactions ??
    serviceTransactions;

  const filteredTransactions = useMemo(() => {
    const normalizedTerm = search
      .trim()
      .toLocaleLowerCase("pt-BR");

    if (!normalizedTerm) {
      return transactions;
    }

    return transactions.filter(
      (transaction) => {
        const searchableContent = [
          transaction.description,
          transaction.category,
          transaction.status === "completed"
            ? "concluída"
            : "pendente",
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR");

        return searchableContent.includes(
          normalizedTerm,
        );
      },
    );
  }, [search, transactions]);

  const hasSearch =
    search.trim().length > 0;

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader
        className={cn(
          "flex-col items-stretch gap-4",
          "xl:flex-row xl:items-start",
          "xl:justify-between",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center",
              "justify-center rounded-[13px]",
              "border border-primary/20",
              "bg-primary/10 text-primary-bright",
            )}
            aria-hidden="true"
          >
            <ReceiptText size={18} />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold">
              {title}
            </CardTitle>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              {description}
            </p>

            <p className="mt-1 text-[10px] text-text-subtle">
              {transactions.length}{" "}
              {transactions.length === 1
                ? "movimentação registrada"
                : "movimentações registradas"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-col gap-3",
            "sm:flex-row sm:items-start",
          )}
        >
          <TransactionsTableSearch
            value={search}
            onChange={setSearch}
            resultCount={
              filteredTransactions.length
            }
          />

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className={cn(
                "inline-flex h-10 shrink-0",
                "items-center justify-center gap-2",
                "rounded-[12px] border",
                "border-border bg-surface-elevated",
                "px-3 text-xs font-semibold",
                "text-text-muted",
                "transition-[border-color,color,background-color]",
                "hover:border-border-highlight",
                "hover:bg-card-hover",
                "hover:text-text",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/40",
              )}
            >
              Ver todas

              <ArrowRight
                size={14}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredTransactions.length > 0 ? (
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-[790px] w-full border-collapse">
              <caption className="sr-only">
                Lista de transações financeiras recentes
              </caption>

              <TransactionsTableHeader />

              <tbody className="divide-y divide-border-muted">
                {filteredTransactions.map(
                  (transaction) => (
                    <TransactionsTableRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[300px] flex-col",
              "items-center justify-center",
              "border-t border-border-muted",
              "px-6 text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center",
                "justify-center rounded-[15px]",
                "border border-border",
                "bg-surface-muted text-text-muted",
              )}
              aria-hidden="true"
            >
              <SearchX size={21} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              {hasSearch
                ? "Nenhuma transação encontrada"
                : "Nenhuma transação registrada"}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              {hasSearch
                ? `Não encontramos resultados para “${search.trim()}”.`
                : "As movimentações mais recentes aparecerão aqui."}
            </p>

            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={cn(
                  "mt-4 rounded-[10px]",
                  "border border-primary/20",
                  "bg-primary/10 px-3 py-2",
                  "text-xs font-semibold",
                  "text-primary-bright",
                  "transition-colors",
                  "hover:bg-primary/15",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-primary/40",
                )}
              >
                Limpar pesquisa
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}