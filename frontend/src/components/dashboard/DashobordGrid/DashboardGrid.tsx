import { cn } from "@/lib/utils";

import { FinancialCards } from "../FinancialCards";
import { BalanceChart } from "../BalanceChart";

export function DashboardGrid() {
  return (
    <section className="mt-8 grid gap-6">
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

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BalanceChart />
        </div>

        <div className="h-96 rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </div>

      {/* Transactions */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-[480px] rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2" />

        <div className="h-[480px] rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </div>
    </section>
  );
}