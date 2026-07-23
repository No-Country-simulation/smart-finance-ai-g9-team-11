import { cn } from "@/lib/utils";
import { dashboardMock } from "@/mocks/dashboard.mock";

import { AIInsights } from "../AIInsights";
import { AIProfileCard } from "../AIProfileCard";
import { Alerts } from "../Alerts";
import { BalanceChart } from "../BalanceChart";
import { ExpenseDistribution } from "../ExpenseDistribution";
import { FinancialCards } from "../FinancialCards";
import { FinancialHealthRadar } from "../FinancialHealthRadar";
import {
  QuickActions,
  type QuickAction,
} from "../QuickActions";
import { ScoreCard } from "../ScoreCard";
import { TransactionsTable } from "../TransactionsTable";

export function DashboardGrid() {
  const { alerts } = dashboardMock.financialHealth;

  const handleQuickAction = (
    action: QuickAction,
  ): void => {
    switch (action.id) {
      case "add-transaction":
        console.info(
          "Abrir fluxo de nova transação.",
        );
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
        const exhaustiveCheck: never = action.id;
        return exhaustiveCheck;
      }
    }
  };

  return (
    <section
      className={cn(
        "w-full min-w-0",
        "space-y-4",
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
          "grid w-full min-w-0",
          "grid-cols-1 items-stretch gap-4",
          "sm:grid-cols-2 sm:gap-5",
          "xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(280px,1.35fr)]",
          "2xl:gap-6",
        )}
        aria-label="Resumo financeiro"
      >
        <FinancialCards />

        <div
          className={cn(
            "min-w-0",
            "sm:col-span-2",
            "xl:col-span-1",
          )}
        >
          <ScoreCard />
        </div>
      </div>

      <div
        className="w-full min-w-0"
        aria-label="Fluxo financeiro"
      >
        <BalanceChart />
      </div>

      <div
        className="w-full min-w-0"
        aria-label="Distribuição dos gastos"
      >
        <ExpenseDistribution />
      </div>

      <div
        className="w-full min-w-0"
        aria-label="Saúde financeira"
      >
        <FinancialHealthRadar />
      </div>

      <div
        className="w-full min-w-0"
        aria-label="Classificação financeira pela inteligência artificial"
      >
        <AIProfileCard />
      </div>

      <div
        className={cn(
          "grid w-full min-w-0",
          "grid-cols-1 items-stretch gap-4",
          "sm:gap-5",
          "lg:grid-cols-2",
          "2xl:gap-6",
        )}
        aria-label="Insights e alertas financeiros"
      >
        <div className="min-w-0">
          <AIInsights />
        </div>

        <div className="min-w-0">
          <Alerts
            alerts={alerts}
            maxVisibleAlerts={4}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid w-full min-w-0",
          "grid-cols-1 items-start gap-4",
          "sm:gap-5",
          "xl:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)]",
          "2xl:grid-cols-[minmax(0,3.2fr)_minmax(340px,1fr)]",
          "2xl:gap-6",
        )}
        aria-label="Transações recentes e ações rápidas"
      >
        <div className="min-w-0">
          <TransactionsTable />
        </div>

        <div className="min-w-0">
          <QuickActions
            onAction={handleQuickAction}
          />
        </div>
      </div>
    </section>
  );
}