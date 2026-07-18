import { cn } from "@/lib/utils";
import { dashboardMock } from "@/mocks/dashboard.mock";

import { AIInsights } from "../AIInsights";
import { Alerts } from "../Alerts";
import { BalanceChart } from "../BalanceChart";
import { FinancialCards } from "../FinancialCards";
import {
  QuickActions,
  type QuickAction,
} from "../QuickActions";
import { ScoreCard } from "../ScoreCard";
import { TransactionsTable } from "../TransactionsTable";

export function DashboardGrid() {
  const { alerts } = dashboardMock.financialHealth;

  const handleQuickAction = (action: QuickAction): void => {
    switch (action.id) {
      case "add-transaction":
        console.info("Abrir fluxo de nova transação.");
        break;

      case "run-analysis":
        console.info("Executar nova análise financeira.");
        break;

      case "view-recommendations":
        console.info("Abrir recomendações financeiras.");
        break;

      case "import-transactions":
        console.info("Importação de transações indisponível.");
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
        "mt-6 min-w-0 space-y-5",
        "sm:mt-8 sm:space-y-6",
      )}
      aria-labelledby="dashboard-overview-title"
    >
      <h2
        id="dashboard-overview-title"
        className="sr-only"
      >
        Visão geral financeira
      </h2>

      {/* Resumo financeiro */}
      <div
        className={cn(
          "grid min-w-0 grid-cols-1 gap-4",
          "sm:gap-5",
          "md:grid-cols-2",
          "xl:grid-cols-4 xl:gap-6",
        )}
      >
        <FinancialCards />
      </div>

      {/* Fluxo financeiro e análises da IA */}
      <div
        className={cn(
          "grid min-w-0 grid-cols-1 items-start gap-4",
          "sm:gap-5",
          "xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]",
          "xl:gap-6",
        )}
      >
        <div className="min-w-0">
          <BalanceChart />
        </div>

        <div className="min-w-0">
          <AIInsights />
        </div>
      </div>

      {/* Transações e widgets de saúde financeira */}
      <div
        className={cn(
          "grid min-w-0 grid-cols-1 items-start gap-4",
          "sm:gap-5",
          "xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]",
          "xl:gap-6",
        )}
      >
        <div className="min-w-0">
          <TransactionsTable />
        </div>

        <aside
          className={cn(
            "grid min-w-0 content-start gap-4",
            "sm:gap-5",
            "xl:gap-6",
          )}
          aria-label="Saúde financeira e ações"
        >
          <ScoreCard />

          <Alerts alerts={alerts} />

          <QuickActions onAction={handleQuickAction} />
        </aside>
      </div>
    </section>
  );
}