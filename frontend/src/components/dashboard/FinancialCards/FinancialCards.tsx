import { dashboardMock } from "@/mocks/dashboard.mock";

import {
  FinancialCard,
  type FinancialCardProps,
} from "../FinancialCard";

export function FinancialCards() {
  const summaryCards: FinancialCardProps[] =
    dashboardMock.summary;

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