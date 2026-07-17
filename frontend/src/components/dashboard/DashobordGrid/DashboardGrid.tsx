import { cn } from "@/lib/utils";

import { AIInsights } from "../AIInsights";
import { BalanceChart } from "../BalanceChart";
import { FinancialCards } from "../FinancialCards";
import { TransactionsTable } from "../TransactionsTable";
import { ScoreCard } from "../ScoreCard";

// Será implementado na próxima sprint
// import { ScoreCard } from "../ScoreCard";

export function DashboardGrid() {
  return (
    <section className="mt-8 space-y-6">
      {/* Financial Cards */}
      <div
        className={cn(
          "grid gap-6",
          "grid-cols-1",
          "md:grid-cols-2",
          "xl:grid-cols-4"
        )}
      >
        <FinancialCards />
      </div>

      {/* Balance + AI */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BalanceChart />
        </div>

        <AIInsights />
      </div>

      {/* Transactions + Sidebar Widgets */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TransactionsTable />
        </div>

        <div className="space-y-6">
          {/* Próxima Sprint */}

          <ScoreCard />

          <div className="min-h-[320px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
          
          {/* Alerts */}
          <div className="min-h-[140px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
        </div>
      </div>
    </section>
  );
}