import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Wallet,
} from "lucide-react";

import type { FinancialAlert } from "@/components/dashboard/Alerts";
import type { DashboardMock } from "@/types/dashboard";

export const dashboardMock: DashboardMock = {
  summary: [
    {
      id: "balance",
      title: "Saldo atual",
      value: "R$ 18.540,25",
      variation: "+8,4% este mês",
      trend: "up",
      icon: (
        <Wallet
          className="size-5"
          aria-hidden="true"
        />
      ),
    },
    {
      id: "income",
      title: "Receitas",
      value: "R$ 24.300,00",
      variation: "+12,8%",
      trend: "up",
      icon: (
        <ArrowUpCircle
          className="size-5"
          aria-hidden="true"
        />
      ),
    },
    {
      id: "expenses",
      title: "Despesas",
      value: "R$ 5.759,75",
      variation: "-3,2%",
      trend: "down",
      icon: (
        <ArrowDownCircle
          className="size-5"
          aria-hidden="true"
        />
      ),
    },
    {
      id: "score",
      title: "Score financeiro",
      value: "91",
      variation: "Excelente",
      trend: "up",
      icon: (
        <DollarSign
          className="size-5"
          aria-hidden="true"
        />
      ),
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
      type: "income",
      status: "completed",
    },
    {
      id: 2,
      description: "Supermercado Mateus",
      category: "Alimentação",
      amount: -350.45,
      date: "2026-07-08",
      type: "expense",
      status: "completed",
    },
    {
      id: 3,
      description: "Netflix",
      category: "Assinatura",
      amount: -39.9,
      date: "2026-07-09",
      type: "expense",
      status: "completed",
    },
    {
      id: 4,
      description: "Posto Shell",
      category: "Transporte",
      amount: -220,
      date: "2026-07-10",
      type: "expense",
      status: "completed",
    },
    {
      id: 5,
      description: "Aluguel",
      category: "Moradia",
      amount: -1800,
      date: "2026-07-01",
      type: "expense",
      status: "completed",
    },
    {
      id: 6,
      description: "Freelance React",
      category: "Receita",
      amount: 2800,
      date: "2026-07-12",
      type: "income",
      status: "completed",
    },
    {
      id: 7,
      description: "Conta de energia",
      category: "Moradia",
      amount: -245.8,
      date: "2026-07-13",
      type: "expense",
      status: "pending",
    },
    {
      id: 8,
      description: "Farmácia",
      category: "Saúde",
      amount: -89.5,
      date: "2026-07-14",
      type: "expense",
      status: "completed",
    },
  ],

  financialHealth: {
    score: 91,
    maxScore: 100,
    classification: "Excelente",
    variation: "+8 pontos este mês",

    insights: [
      "Você reduziu seus gastos com alimentação em 12% neste mês.",
      "Sua renda aumentou 8% em relação ao mês anterior.",
      "Seu score financeiro permanece acima da média dos usuários.",
      "Você pode economizar até R$ 420 reduzindo gastos recorrentes.",
    ],

    alerts: [
      {
        id: 1,
        title: "Despesas recorrentes aumentaram",
        description:
          "Seus gastos recorrentes cresceram 12% em relação ao mês anterior.",
        type: "warning",
        actionLabel: "Ver despesas",
      },
      {
        id: 2,
        title: "Gastos com alimentação acima da média",
        description:
          "A categoria alimentação representa 28% das suas despesas deste mês.",
        type: "danger",
        actionLabel: "Analisar categoria",
      },
      {
        id: 3,
        title: "Receita mensal aumentou",
        description:
          "Sua receita apresentou crescimento de 8% em comparação ao mês anterior.",
        type: "success",
      },
    ] satisfies FinancialAlert[],
  },
};