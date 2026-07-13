import { dashboardSummaryMock } from "@/mocks/dashboard.mock";

import { FinancialCard } from "../FinancialCard";

export function FinancialCards() {
  return (
    <>
      {dashboardSummaryMock.map((card) => (
        <FinancialCard
          key={card.title}
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