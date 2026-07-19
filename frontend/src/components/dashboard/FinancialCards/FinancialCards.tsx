import { dashboardMock } from "@/mocks/dashboard.mock";

import { FinancialCard } from "../FinancialCard";

function isScoreCard(card: {
  id?: string;
  title: string;
}): boolean {
  const normalizedId = String(
    card.id ?? "",
  ).toLocaleLowerCase("pt-BR");

  const normalizedTitle =
    card.title.toLocaleLowerCase("pt-BR");

  return (
    normalizedId.includes("score") ||
    normalizedTitle.includes("score")
  );
}

export function FinancialCards() {
  const summaryCards = dashboardMock.summary.filter(
    (card) => !isScoreCard(card),
  );

  return (
    <>
      {summaryCards.map((card) => (
        <FinancialCard
          key={card.id ?? card.title}
          id={card.id}
          title={card.title}
          value={card.value}
          variation={card.variation}
          trend={card.trend}
          icon={card.icon}
        />
      ))}
    </>
  );
}