import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { dashboardService } from "@/services/dashboard.service";

import { InsightItem } from "./InsightItem";
import type { AIInsightsProps } from "./AIInsights.types";

export function AIInsights({
  title = "AI Insights",
}: AIInsightsProps) {
  const insights = dashboardService.getInsights();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {insights.map((insight, index) => (
            <InsightItem
              key={`${index}-${insight}`}
              insight={insight}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}