import { useState } from "react";

import { cn } from "@/lib/utils";

import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";

import { AIInsights } from "../AIInsights";
import { Alerts } from "../Alerts";
import { BalanceChart } from "../BalanceChart";
import { ExpenseDistribution } from "../ExpenseDistribution";
import { FinancialCards } from "../FinancialCards";

import {
  QuickActions,
  type QuickAction,
} from "../QuickActions";

import { ScoreCard } from "../ScoreCard";
import { TransactionsTable } from "../TransactionsTable";

import type {
  DashboardData,
} from "@/types/dashboard";

interface DashboardGridProps {
  data: DashboardData;
  onReload: () => Promise<void>;
}

export function DashboardGrid({
  data,
  onReload,
}: Readonly<DashboardGridProps>) {
  const [
    isCreateTransactionOpen,
    setIsCreateTransactionOpen,
  ] = useState(false);

  const handleQuickAction = (
    action: QuickAction,
  ): void => {
    switch (action.id) {
      case "add-transaction":
        setIsCreateTransactionOpen(true);
        break;

      case "run-analysis":
        console.info(
          "Executar nova análise financeira.",
        );
        break;

      case "view-recommendations":
        console.info(
          "Abrir recomendações financeiras.",
        );
        break;

      case "import-transactions":
        console.info(
          "Importação de transações indisponível.",
        );
        break;

      default: {
        const exhaustiveCheck: never =
          action.id;

        return exhaustiveCheck;
      }
    }
  };

  const handleTransactionCreated =
    async (): Promise<void> => {
      await onReload();
    };

  return (
    <>
      <section
        className={cn(
          "min-w-0 space-y-4",
          "sm:space-y-5",
          "2xl:space-y-6",
        )}
        aria-labelledby="dashboard-overview-title"
      >
        <h2
          id="dashboard-overview-title"
          className="sr-only"
        >
          Visão geral financeira
        </h2>

        <div
          className={cn(
            "grid min-w-0 grid-cols-1 items-stretch gap-4",
            "sm:grid-cols-2 sm:gap-5",
            "xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,1.35fr)]",
            "2xl:gap-6",
          )}
          aria-label="Resumo financeiro"
        >
          <FinancialCards
            summary={data.summary}
          />

          <div className="min-w-0 sm:col-span-2 xl:col-span-1">
            <ScoreCard />
          </div>
        </div>

        <div
          className="min-w-0"
          aria-label="Fluxo financeiro"
        >
          <BalanceChart
            data={data.cashFlow}
          />
        </div>

        <div
          className={cn(
            "grid min-w-0 grid-cols-1 items-stretch gap-4",
            "sm:gap-5",
            "xl:grid-cols-2",
            "2xl:gap-6",
          )}
        >
          <div
            className="min-w-0"
            aria-label="Distribuição das despesas"
          >
            <ExpenseDistribution
              categories={
                data.categories
              }
            />
          </div>

          <div
            className="min-w-0"
            aria-label="Insights financeiros"
          >
            <AIInsights />
          </div>
        </div>

        <div
          className="min-w-0"
          aria-label="Alertas financeiros"
        >
          <Alerts
            alerts={[]}
            maxVisibleAlerts={4}
          />
        </div>

        <div
          className={cn(
            "grid min-w-0 grid-cols-1 items-start gap-4",
            "sm:gap-5",
            "xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]",
            "2xl:grid-cols-[minmax(0,3.2fr)_minmax(360px,1fr)]",
            "2xl:gap-6",
          )}
          aria-label="Transações recentes e ações rápidas"
        >
          <div className="min-w-0">
            <TransactionsTable
              transactions={
                data.transactions
              }
            />
          </div>

          <div className="min-w-0">
            <QuickActions
              onAction={
                handleQuickAction
              }
            />
          </div>
        </div>
      </section>

      <CreateTransactionModal
        isOpen={
          isCreateTransactionOpen
        }
        onClose={() => {
          setIsCreateTransactionOpen(
            false,
          );
        }}
        onCreated={
          handleTransactionCreated
        }
      />
    </>
  );
}