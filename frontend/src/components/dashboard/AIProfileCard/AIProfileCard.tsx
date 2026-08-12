import type {
  LucideIcon,
} from "lucide-react";

import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { cn } from "@/lib/utils";

import {
  AIConfidenceGauge,
} from "./AIConfidenceGauge";

import type {
  AIClassificationVisualConfig,
  AIFinancialClassification,
  AIFinancialIndicatorStatus,
  AIProfileCardProps,
} from "./AIProfileCard.types";

const classificationConfig: Record<
  AIFinancialClassification,
  AIClassificationVisualConfig
> = {
  healthy: {
    label: "Saudável",
    description:
      "Sua situação financeira apresenta bons indicadores.",
    accentClassName:
      "bg-success",
    badgeClassName:
      "border-success/20 bg-success/10 text-success",
    iconContainerClassName:
      "border-success/20 bg-success/10",
    iconClassName:
      "text-success",
  },

  attention: {
    label: "Em observação",
    description:
      "Alguns indicadores precisam de acompanhamento.",
    accentClassName:
      "bg-warning",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    iconClassName:
      "text-warning",
  },

  risk: {
    label: "Em risco",
    description:
      "Existem indicadores financeiros que exigem atenção.",
    accentClassName:
      "bg-danger",
    badgeClassName:
      "border-danger/20 bg-danger/10 text-danger",
    iconContainerClassName:
      "border-danger/20 bg-danger/10",
    iconClassName:
      "text-danger",
  },
};

const classificationIcons: Record<
  AIFinancialClassification,
  LucideIcon
> = {
  healthy:
    ShieldCheck,
  attention:
    ShieldAlert,
  risk:
    AlertTriangle,
};

const indicatorStatusConfig: Record<
  AIFinancialIndicatorStatus,
  {
    label: string;
    badgeClassName: string;
    progressClassName: string;
  }
> = {
  good: {
    label: "Bom",
    badgeClassName:
      "border-success/20 bg-success/10 text-success",
    progressClassName:
      "bg-success",
  },

  attention: {
    label: "Atenção",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
    progressClassName:
      "bg-warning",
  },

  critical: {
    label: "Crítico",
    badgeClassName:
      "border-danger/20 bg-danger/10 text-danger",
    progressClassName:
      "bg-danger",
  },
};

export function AIProfileCard({
  title =
    "Como a IA classificou sua situação?",
  description =
    "Perfil financeiro gerado pela análise inteligente.",
  profile = null,
  onViewDetails,
}: Readonly<AIProfileCardProps>) {
  if (!profile) {
    return (
      <Card className="flex h-full min-w-0 flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {title}
          </CardTitle>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        </CardHeader>

        <CardContent
          className={cn(
            "flex min-h-[360px]",
            "flex-1 flex-col",
            "items-center justify-center",
            "px-6 text-center",
          )}
        >
          <div
            className={cn(
              "flex size-12",
              "items-center justify-center",
              "rounded-[15px]",
              "border border-primary/20",
              "bg-primary/10",
              "text-primary-bright",
            )}
          >
            <BrainCircuit
              size={21}
              aria-hidden="true"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-text">
            Perfil ainda não analisado
          </p>

          <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
            Execute uma análise financeira para visualizar a classificação gerada pelo Finance AI.
          </p>
        </CardContent>
      </Card>
    );
  }

  const safeConfidence =
    Math.min(
      Math.max(
        profile.confidence,
        0,
      ),
      100,
    );

  const classification =
    classificationConfig[
      profile.classification
    ];

  const ClassificationIcon =
    classificationIcons[
      profile.classification
    ];

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">
            {title}
          </CardTitle>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[13px]",
            "border border-primary/20",
            "bg-primary/10",
            "text-primary-bright",
          )}
        >
          <BrainCircuit
            size={18}
            aria-hidden="true"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-[16px]",
            "border border-border",
            "bg-surface-elevated/55",
            "p-4",
          )}
        >
          <span
            className={cn(
              "absolute inset-y-0",
              "left-0 w-0.5",
              classification.accentClassName,
            )}
          />

          <div
            className={cn(
              "grid grid-cols-1",
              "items-center gap-4",
              "sm:grid-cols-[minmax(0,1fr)_auto]",
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0",
                  "items-center justify-center",
                  "rounded-[12px] border",
                  classification.iconContainerClassName,
                  classification.iconClassName,
                )}
              >
                <ClassificationIcon
                  size={18}
                />
              </div>

              <div className="min-w-0">
                <span
                  className={cn(
                    "inline-flex rounded-full border",
                    "px-2.5 py-1",
                    "text-[9px] font-semibold",
                    "uppercase tracking-[0.08em]",
                    classification.badgeClassName,
                  )}
                >
                  {classification.label}
                </span>

                <p className="mt-2 text-xs font-semibold text-text">
                  {profile.riskLabel}
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  {classification.description}
                </p>
              </div>
            </div>

            <AIConfidenceGauge
              value={
                safeConfidence
              }
            />
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {profile.indicators.map(
            (indicator) => {
              const safeValue =
                Math.min(
                  Math.max(
                    indicator.value,
                    0,
                  ),
                  100,
                );

              const status =
                indicatorStatusConfig[
                  indicator.status
                ];

              return (
                <div
                  key={indicator.id}
                  className={cn(
                    "rounded-[12px]",
                    "border border-border-muted",
                    "bg-background/30",
                    "px-3 py-2.5",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={cn(
                          indicator.status ===
                          "good"
                            ? "text-success"
                            : indicator.status ===
                                "attention"
                              ? "text-warning"
                              : "text-danger",
                        )}
                      />

                      <span className="truncate text-[11px] font-medium text-text-muted">
                        {indicator.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] font-semibold text-text">
                        {safeValue}%
                      </span>

                      <span
                        className={cn(
                          "rounded-full border",
                          "px-2 py-0.5",
                          "text-[9px] font-semibold",
                          status.badgeClassName,
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        status.progressClassName,
                      )}
                      style={{
                        width:
                          `${safeValue}%`,
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>

        <div
          className={cn(
            "mt-4 flex",
            "items-center justify-between",
            "gap-3 rounded-[12px]",
            "border border-primary/15",
            "bg-primary/5",
            "px-3 py-2.5",
          )}
        >
          <span className="text-[10px] leading-4 text-text-muted">
            Resultado gerado pelo Finance AI.
          </span>

          <span className="shrink-0 text-[10px] font-semibold text-primary-bright">
            {safeConfidence}% de confiança
          </span>
        </div>

        {onViewDetails && (
          <button
            type="button"
            onClick={
              onViewDetails
            }
            className={cn(
              "mt-4 inline-flex",
              "h-10 w-full",
              "items-center justify-center",
              "gap-2 rounded-[12px]",
              "border border-primary/15",
              "bg-primary/5",
              "text-xs font-semibold",
              "text-primary-bright",
            )}
          >
            Ver detalhes

            <ArrowRight
              size={14}
            />
          </button>
        )}
      </CardContent>
    </Card>
  );
}