import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { dashboardService } from "@/services/dashboard.service";

import { ScoreGauge } from "./ScoreGauge";
import type { ScoreCardProps } from "./ScoreCard.types";

export function ScoreCard({
  title = "Financial Score",
}: ScoreCardProps) {
  const score = dashboardService.getScore();

  const percentage = Math.round(
    (score.score / score.maxScore) * 100
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <ScoreGauge
          score={score.score}
          maxScore={score.maxScore}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              {score.classification}
            </span>

            <span className="text-slate-500">
              {percentage}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {score.variation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}