import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from "lucide-react";

import {
  FinancialCard,
  type FinancialCardProps,
} from "../FinancialCard";

import type {
  DashboardSummary,
} from "@/types/dashboard";

interface FinancialCardsProps {
  summary: DashboardSummary;
}

const currencyFormatter =
  new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

export function FinancialCards({
  summary,
}: Readonly<FinancialCardsProps>) {
  const cards: FinancialCardProps[] = [
    {
      id: "balance",
      title: "Saldo atual",
      value:
        currencyFormatter.format(
          summary.balance,
        ),
      variation:
        `${summary.transactionCount} ${
          summary.transactionCount === 1
            ? "movimentação"
            : "movimentações"
        }`,
      trend:
        summary.balance > 0
          ? "up"
          : summary.balance < 0
            ? "down"
            : "neutral",
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
      value:
        currencyFormatter.format(
          summary.income,
        ),
      variation:
        "Total registrado",
      trend:
        summary.income > 0
          ? "up"
          : "neutral",
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
      value:
        currencyFormatter.format(
          summary.expenses,
        ),
      variation:
        "Total registrado",
      trend:
        summary.expenses > 0
          ? "down"
          : "neutral",
      icon: (
        <ArrowDownCircle
          className="size-5"
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <FinancialCard
          key={card.id ?? card.title}
          id={card.id}
          title={card.title}
          value={card.value}
          variation={card.variation}
          trend={card.trend}
          icon={card.icon}
          updatedAt={
            card.updatedAt
          }
          className={
            card.className
          }
        />
      ))}
    </>
  );
}