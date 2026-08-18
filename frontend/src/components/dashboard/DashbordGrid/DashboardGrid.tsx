import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";

import { cn } from "@/lib/utils";

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
  FinancialAlert,
} from "../Alerts";

import type {
  DashboardData,
} from "@/types/dashboard";

import type {
  FinancialAnalysisHistory,
} from "@/types/financial-analysis";

interface DashboardGridProps {
  data: DashboardData;
  analysis:
    FinancialAnalysisHistory | null;
  isAnalysisLoading: boolean;
  onReload: () => Promise<void>;
}

function createAnalysisInsights(
  analysis:
    FinancialAnalysisHistory | null,
): string[] {
  if (!analysis) {
    return [];
  }

  return [
    `Seu perfil financeiro atual é ${analysis.perfilFinanceiro}.`,
    `Seu nível de endividamento está em ${Math.round(
      analysis.nivelEndividamento,
    )}%.`,
    `Sua frequência de poupança foi classificada como ${analysis.frequenciaPoupanca}.`,
    "Abra a análise financeira para consultar recomendações detalhadas.",
  ];
}

function createFinancialAlerts(
  analysis:
    FinancialAnalysisHistory | null,
): FinancialAlert[] {
  if (!analysis) {
    return [];
  }

  const alerts:
    FinancialAlert[] = [];

  if (
    analysis.perfilFinanceiro ===
    "Em risco"
  ) {
    alerts.push({
      id: 1,
      title:
        "Perfil financeiro em risco",
      type: "danger",
      description:
        "Sua última análise identificou indicadores que exigem atenção.",
      actionLabel:
        "Ver análise",
    });
  }

  if (
    analysis.perfilFinanceiro ===
    "Em observação"
  ) {
    alerts.push({
      id: 2,
      title:
        "Perfil em observação",
      type: "warning",
      description:
        "Alguns indicadores financeiros precisam de acompanhamento.",
      actionLabel:
        "Ver detalhes",
    });
  }

  if (
    analysis.nivelEndividamento >=
    50
  ) {
    alerts.push({
      id: 3,
      title:
        "Endividamento elevado",
      type: "danger",
      description:
        `O nível de endividamento atual é de ${Math.round(
          analysis.nivelEndividamento,
        )}%.`,
      actionLabel:
        "Analisar",
    });
  }

  if (
    analysis.frequenciaPoupanca ===
    "Baixa"
  ) {
    alerts.push({
      id: 4,
      title:
        "Baixa frequência de poupança",
      type: "warning",
      description:
        "Sua análise indica baixa recorrência de poupança.",
      actionLabel:
        "Ver recomendações",
    });
  }

  return alerts;
}

export function DashboardGrid({
  data,
  analysis,
  isAnalysisLoading,
  onReload,
}: Readonly<DashboardGridProps>) {
  const navigate =
    useNavigate();

  const [
    isCreateTransactionOpen,
    setIsCreateTransactionOpen,
  ] = useState(false);

  const insights =
    useMemo(
      () =>
        createAnalysisInsights(
          analysis,
        ),
      [analysis],
    );

  const alerts =
    useMemo(
      () =>
        createFinancialAlerts(
          analysis,
        ),
      [analysis],
    );

  const handleQuickAction = (
    action: QuickAction,
  ): void => {
    switch (action.id) {
      case "add-transaction":
        setIsCreateTransactionOpen(
          true,
        );
        break;

      case "run-analysis":
      case "view-recommendations":
        navigate(
          "/app/analysis",
        );
        break;

      case "import-transactions":
        console.info(
          "Importação de transações ainda não disponível.",
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

  const handleViewAnalysis =
    (): void => {
      navigate(
        "/app/analysis",
      );
    };

  return (
    <>
      <section
        className={cn(
          "min-w-0 space-y-4",
          "sm:space-y-5",
          "2xl:space-y-6",
        )}
      >
        <div
          className={cn(
            "grid min-w-0",
            "grid-cols-1",
            "items-stretch gap-4",
            "sm:grid-cols-2",
            "xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,1.35fr)]",
          )}
        >
          <FinancialCards
            summary={data.summary}
          />

          <div className="min-w-0 sm:col-span-2 xl:col-span-1">
            <ScoreCard
              confidence={
                analysis?.probabilidade ??
                null
              }
              profile={
                analysis?.perfilFinanceiro ??
                null
              }
              debtLevel={
                analysis?.nivelEndividamento ??
                null
              }
              analysisDate={
                analysis?.dataAnalise ??
                null
              }
              isLoading={
                isAnalysisLoading
              }
            />
          </div>
        </div>

        <BalanceChart
          data={data.cashFlow}
        />

        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            "xl:grid-cols-2",
          )}
        >
          <ExpenseDistribution
            categories={
              data.categories
            }
          />

          <AIInsights
            insights={insights}
          />
        </div>

        <Alerts
          alerts={alerts}
          maxVisibleAlerts={4}
          onAlertAction={
            handleViewAnalysis
          }
        />

        <div
          className={cn(
            "grid grid-cols-1",
            "items-start gap-4",
            "xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]",
          )}
        >
          <TransactionsTable
            transactions={
              data.transactions
            }
            onViewAll={() => {
              navigate(
                "/app/transactions",
              );
            }}
          />

          <QuickActions
            onAction={
              handleQuickAction
            }
          />
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