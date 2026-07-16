import { createElement } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Wallet,
} from "lucide-react";

import type { FinancialCardProps } from "@/components/dashboard/FinancialCard/FinancialCard.types";
import type { BalanceChartData } from "@/components/dashboard/BalanceChart/BalanceChart.types";

export const dashboardMock: {
  summary: FinancialCardProps[];
  cashFlow: BalanceChartData[];
} = {
  summary: [
    {
      id: "balance",
      title: "Saldo Atual",
      value: "R$ 18.540,25",
      variation: "+8,4% este mês",
      trend: "up",
      icon: createElement(Wallet, { className: "h-6 w-6 text-slate-700" }),
    },
    {
      id: "income",
      title: "Receitas",
      value: "R$ 24.300,00",
      variation: "+12,8%",
      trend: "up",
      icon: createElement(ArrowUpCircle, { className: "h-6 w-6 text-emerald-600" }),
    },
    {
      id: "expenses",
      title: "Despesas",
      value: "R$ 5.759,75",
      variation: "-3,2%",
      trend: "down",
      icon: createElement(ArrowDownCircle, { className: "h-6 w-6 text-red-600" }),
    },
    {
      id: "score",
      title: "Score Financeiro",
      value: "91",
      variation: "Excelente",
      trend: "up",
      icon: createElement(DollarSign, { className: "h-6 w-6 text-blue-600" }),
    },
  ],
  cashFlow: [
    { month: "Jan", income: 42000, expenses: 21000 },
    { month: "Fev", income: 38000, expenses: 19000 },
    { month: "Mar", income: 45000, expenses: 22000 },
    { month: "Abr", income: 47000, expenses: 24000 },
    { month: "Mai", income: 50000, expenses: 26000 },
    { month: "Jun", income: 52000, expenses: 28000 },
  ],
};