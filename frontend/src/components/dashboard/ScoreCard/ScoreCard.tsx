import {
  BrainCircuit,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { cn } from "@/lib/utils";

import { ScoreGauge } from "./ScoreGauge";

import type {
  ScoreCardProps,
} from "./ScoreCard.types";

function normalizeProbability(
  probability:
    number | null | undefined,
): number {
  if (
    probability === null ||
    probability === undefined ||
    !Number.isFinite(probability)
  ) {
    return 0;
  }

  const percentage =
    probability <= 1
      ? probability * 100
      : probability;

  return Math.min(
    Math.max(
      Math.round(percentage),
      0,
    ),
    100,
  );
}

function formatAnalysisDate(
  value:
    string | null | undefined,
): string {
  if (!value) {
    return "Nenhuma análise realizada";
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

export function ScoreCard({
  title = "Confiança da análise",
  confidence = null,
  profile = null,
  debtLevel = null,
  analysisDate = null,
  isLoading = false,
}: Readonly<ScoreCardProps>) {
  const score =
    normalizeProbability(
      confidence,
    );

  const hasAnalysis =
    profile !== null;

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
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute right-0 top-0",
          "size-40",
          "translate-x-1/3",
          "-translate-y-1/3",
          "rounded-full",
          "bg-primary/10 blur-3xl",
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
              "flex size-9 shrink-0",
              "items-center justify-center",
              "rounded-[12px]",
              "border border-primary/20",
              "bg-primary/10",
              "text-primary-bright",
            )}
          >
            <ShieldCheck
              size={17}
              aria-hidden="true"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "relative flex flex-1",
          "flex-col justify-between",
          "gap-3 pt-0",
        )}
      >
        {isLoading ? (
          <div
            className={cn(
              "flex flex-1",
              "items-center justify-center",
              "text-xs text-text-muted",
            )}
          >
            Carregando análise...
          </div>
        ) : hasAnalysis ? (
          <>
            <div className="flex min-w-0 items-center gap-4">
              <ScoreGauge
                score={score}
                maxScore={100}
              />

              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-flex",
                    "items-center",
                    "rounded-full",
                    "border",
                    "border-primary/20",
                    "bg-primary/10",
                    "px-2.5 py-1",
                    "text-[10px]",
                    "font-semibold",
                    "text-primary-bright",
                  )}
                >
                  {profile}
                </span>

                <p className="mt-3 text-xs leading-5 text-text-muted">
                  Probabilidade associada
                  ao perfil identificado
                  pelo Finance AI.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="font-medium text-text-muted">
                  Confiança
                </span>

                <span className="font-semibold text-primary-bright">
                  {score}%
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    "bg-gradient-to-r",
                    "from-primary",
                    "via-primary-bright",
                    "to-secondary-bright",
                    "transition-[width]",
                    "duration-700",
                  )}
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-3",
                "rounded-[12px]",
                "border border-border-muted",
                "bg-surface-elevated/70",
                "px-3 py-2",
              )}
            >
              <BrainCircuit
                size={15}
                className="shrink-0 text-primary-bright"
                aria-hidden="true"
              />

              <div className="min-w-0">
                <p className="text-[10px] text-text-muted">
                  Endividamento
                </p>

                <p className="text-[11px] font-semibold text-text">
                  {Math.round(
                    Number(
                      debtLevel ?? 0,
                    ),
                  )}
                  %
                </p>
              </div>

              <div className="ml-auto flex min-w-0 items-center gap-2">
                <CalendarClock
                  size={13}
                  className="shrink-0 text-text-subtle"
                  aria-hidden="true"
                />

                <span className="truncate text-[10px] text-text-subtle">
                  {formatAnalysisDate(
                    analysisDate,
                  )}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div
            className={cn(
              "flex flex-1 flex-col",
              "items-center",
              "justify-center",
              "px-4 text-center",
            )}
          >
            <BrainCircuit
              size={24}
              className="text-primary-bright"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-text">
              Análise pendente
            </p>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Execute uma análise financeira
              para visualizar seu perfil.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}