import {
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

import { ScoreGauge } from "./ScoreGauge";
import type { ScoreCardProps } from "./ScoreCard.types";

export function ScoreCard({
  title = "Pontuação financeira",
}: Readonly<ScoreCardProps>) {
  const score = dashboardService.getScore();

  const safeMaxScore = Math.max(
    score.maxScore,
    1,
  );

  const percentage = Math.min(
    Math.max(
      Math.round(
        (score.score / safeMaxScore) * 100,
      ),
      0,
    ),
    100,
  );

  return (
    <Card
      className={cn(
        "group relative flex min-h-[228px] min-w-0",
        "flex-col overflow-hidden",
        "border-border bg-card",
        "transition-[border-color,transform,box-shadow]",
        "duration-200 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-border-highlight",
        "hover:shadow-elevated",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0",
          "size-40 translate-x-1/3 -translate-y-1/3",
          "rounded-full bg-primary/10 blur-3xl",
        )}
        aria-hidden="true"
      />

      <CardHeader className="relative shrink-0 pb-2">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <CardTitle className="truncate text-sm font-semibold">
            {title}
          </CardTitle>

          <div
            className={cn(
              "flex size-9 shrink-0 items-center",
              "justify-center rounded-[12px]",
              "border border-primary/20",
              "bg-primary/10 text-primary-bright",
            )}
            aria-hidden="true"
          >
            <ShieldCheck size={17} />
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "relative flex flex-1 flex-col",
          "justify-between gap-3 pt-0",
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <ScoreGauge
            score={score.score}
            maxScore={score.maxScore}
          />

          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full",
                "border border-success/20",
                "bg-success/10 px-2.5 py-1",
                "text-[10px] font-semibold text-success",
              )}
            >
              {score.classification}
            </span>

            <p className="mt-3 text-xs leading-5 text-text-muted">
              Seu desempenho financeiro está acima da média.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-[10px]">
            <span className="font-medium text-text-muted">
              Progresso do score
            </span>

            <span className="font-semibold text-primary-bright">
              {percentage}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn(
                "h-full rounded-full",
                "bg-gradient-to-r from-primary",
                "via-primary-bright to-secondary-bright",
                "transition-[width] duration-700 ease-out",
              )}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-[12px]",
            "border border-border-muted",
            "bg-surface-elevated/70 px-3 py-2",
          )}
        >
          <div
            className={cn(
              "flex size-7 shrink-0 items-center",
              "justify-center rounded-lg",
              "bg-success/10 text-success",
            )}
            aria-hidden="true"
          >
            <ArrowUpRight size={15} />
          </div>

          <p className="min-w-0 text-[11px] font-medium text-text-muted">
            {score.variation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}