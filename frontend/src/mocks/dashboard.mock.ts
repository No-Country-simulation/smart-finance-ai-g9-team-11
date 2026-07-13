import { createElement } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Wallet,
} from "lucide-react";

import type { FinancialCardProps } from "@/components/dashboard/FinancialCard";

export const dashboardSummaryMock: FinancialCardProps[] = [
  {
    title: "Saldo Atual",
    value: "R$ 18.540,25",
    variation: "+8,4% este mês",
    trend: "up",
    icon: createElement(Wallet, { className: "h-6 w-6 text-slate-700" }),
  },
  {
    title: "Receitas",
    value: "R$ 24.300,00",
    variation: "+12,8%",
    trend: "up",
    icon: createElement(ArrowUpCircle, { className: "h-6 w-6 text-emerald-600" }),
  },
  {
    title: "Despesas",
    value: "R$ 5.759,75",
    variation: "-3,2%",
    trend: "down",
    icon: createElement(ArrowDownCircle, { className: "h-6 w-6 text-red-600" }),
  },
  {
    title: "Score Financeiro",
    value: "91",
    variation: "Excelente",
    trend: "up",
    icon: createElement(DollarSign, { className: "h-6 w-6 text-blue-600" }),
  },
];