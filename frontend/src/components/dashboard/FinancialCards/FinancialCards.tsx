import { dashboardMock } from "@/mocks/dashboard.mock";

import { FinancialCard } from "../FinancialCard";

export function FinancialCards() {
  return (
    <>
      {dashboardMock.summary.map((card) => (
        <FinancialCard
          key={card.id}
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