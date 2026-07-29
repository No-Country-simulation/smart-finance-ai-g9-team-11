import { dashboardMock } from "@/mocks/dashboard.mock";

import {
  FinancialCard,
  type FinancialCardProps,
} from "../FinancialCard";

function isScoreCard(
  card: FinancialCardProps,
): boolean {
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
  const summaryCards: FinancialCardProps[] =
    dashboardMock.summary.filter(
      (card: FinancialCardProps) =>
        !isScoreCard(card),
    );

  return (
    <>
      {summaryCards.map(
        (card: FinancialCardProps) => (
          <FinancialCard
            key={card.id ?? card.title}
            id={card.id}
            title={card.title}
            value={card.value}
            variation={card.variation}
            trend={card.trend}
            icon={card.icon}
            updatedAt={card.updatedAt}
            className={card.className}
          />
        ),
      )}
    </>
  );
}