import { cn } from "@/lib/utils";
import { dashboardMock } from "@/mocks/dashboard.mock";

import { AIInsights } from "../AIInsights";
import { AIProfileCard } from "../AIProfileCard";
import { Alerts } from "../Alerts";
import { BalanceChart } from "../BalanceChart";
import { ExpenseDistribution } from "../ExpenseDistribution";
import { FinancialCards } from "../FinancialCards";
import { FinancialHealthRadar } from "../FinancialHealthRadar";
import { QuickActions, type QuickAction } from "../QuickActions";
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
      className={cn("w-full min-w-0 space-y-4 sm:space-y-5 lg:space-y-6")}
      aria-labelledby="dashboard-overview-title"
    >
      <h2 id="dashboard-overview-title" className="sr-only">
        Visão geral financeira
      </h2>

      {/* 1. TOPO: 4 Cards de Métricas + 1 ScoreCard alinhados na mesma linha no XL */}
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-1 gap-4",
          "sm:grid-cols-2 sm:gap-5",
          "lg:grid-cols-4",
          "xl:grid-cols-5 xl:gap-5",
        )}
        aria-label="Resumo financeiro"
      >
        <FinancialCards />
        <div className="min-w-0 sm:col-span-2 lg:col-span-4 xl:col-span-1">
          <ScoreCard />
        </div>
      </div>

      {/* 2. FLUXO FINANCEIRO (Gráfico Principal) */}
      <div className="w-full min-w-0" aria-label="Fluxo financeiro">
        <BalanceChart />
      </div>

      {/* 3. DIAGNÓSTICOS E ANÁLISES (Lado a lado em telas grandes para evitar espaço vago) */}
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-1 gap-4",
          "sm:gap-5",
          "lg:grid-cols-2",
          "xl:grid-cols-3 xl:gap-5",
        )}
      >
        <div className="min-w-0" aria-label="Distribuição dos gastos">
          <ExpenseDistribution />
        </div>

        <div className="min-w-0" aria-label="Saúde financeira">
          <FinancialHealthRadar />
        </div>

        <div
          className="min-w-0 lg:col-span-2 xl:col-span-1"
          aria-label="Classificação financeira pela inteligência artificial"
        >
          <AIProfileCard />
        </div>
      </div>

      {/* 4. INSIGHTS E ALERTAS */}
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-1 items-stretch gap-4",
          "sm:gap-5 lg:grid-cols-2 xl:gap-5",
        )}
        aria-label="Insights e alertas financeiros"
      >
        <div className="min-w-0">
          <AIInsights />
        </div>
        <div className="min-w-0">
          <Alerts alerts={alerts} maxVisibleAlerts={4} />
        </div>
      </div>

      {/* 5. TRANSAÇÕES RECENTES E AÇÕES RÁPIDAS */}
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-1 items-start gap-4",
          "sm:gap-5",
          "xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-5",
        )}
        aria-label="Transações recentes e ações rápidas"
      >
        <div className="min-w-0">
          <TransactionsTable />
        </div>
        <div className="min-w-0">
          <QuickActions onAction={handleQuickAction} />
        </div>
      </div>
    </section>
  );
}