import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Wallet,
} from "lucide-react";

import type { DashboardMock } from "@/types/dashboard";

export const dashboardMock: DashboardMock = {
  summary: [
    {
      id: "balance",
      title: "Saldo Atual",
      value: "R$ 18.540,25",
      variation: "+8,4% este mês",
      trend: "up",
      icon: <Wallet className="h-6 w-6 text-slate-700" />,
    },
    {
      id: "income",
      title: "Receitas",
      value: "R$ 24.300,00",
      variation: "+12,8%",
      trend: "up",
      icon: <ArrowUpCircle className="h-6 w-6 text-emerald-600" />,
    },
    {
      id: "expenses",
      title: "Despesas",
      value: "R$ 5.759,75",
      variation: "-3,2%",
      trend: "down",
      icon: <ArrowDownCircle className="h-6 w-6 text-red-600" />,
    },
    {
      id: "score",
      title: "Score Financeiro",
      value: "91",
      variation: "Excelente",
      trend: "up",
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
    },
  ],

  cashFlow: [
    {
      month: "Jan",
      income: 42000,
      expenses: 21000,
    },
    {
      month: "Fev",
      income: 38000,
      expenses: 19000,
    },
    {
      month: "Mar",
      income: 45000,
      expenses: 22000,
    },
    {
      month: "Abr",
      income: 47000,
      expenses: 24000,
    },
    {
      month: "Mai",
      income: 50000,
      expenses: 26000,
    },
    {
      month: "Jun",
      income: 52000,
      expenses: 28000,
    },
  ],

  categories: [
    {
      name: "Moradia",
      value: 24000,
    },
    {
      name: "Alimentação",
      value: 16000,
    },
    {
      name: "Educação",
      value: 12000,
    },
    {
      name: "Transporte",
      value: 8000,
    },
    {
      name: "Lazer",
      value: 6000,
    },
  ],

  transactions: [
    {
      id: 1,
      description: "Salário",
      category: "Receita",
      amount: 12000,
      date: "2026-07-05",
    },
    {
      id: 2,
      description: "Supermercado Mateus",
      category: "Alimentação",
      amount: -350.45,
      date: "2026-07-08",
    },
    {
      id: 3,
      description: "Netflix",
      category: "Assinatura",
      amount: -39.90,
      date: "2026-07-09",
    },
    {
      id: 4,
      description: "Posto Shell",
      category: "Transporte",
      amount: -220,
      date: "2026-07-10",
    },
    {
      id: 5,
      description: "Aluguel",
      category: "Moradia",
      amount: -1800,
      date: "2026-07-01",
    },
  ],

  insights: [
    "Você reduziu seus gastos com alimentação em 12% neste mês.",
    "Sua renda aumentou 8% em relação ao mês anterior.",
    "Seu Score Financeiro permanece acima da média dos usuários.",
    "Você pode economizar até R$ 420 reduzindo gastos recorrentes.",
  ],
};