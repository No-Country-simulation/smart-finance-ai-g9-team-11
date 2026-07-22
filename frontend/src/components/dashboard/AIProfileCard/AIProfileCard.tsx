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

import { AIConfidenceGauge } from "./AIConfidenceGauge";

import type {
  AIClassificationVisualConfig,
  AIFinancialClassification,
  AIFinancialIndicatorStatus,
  AIFinancialProfile,
  AIProfileCardProps,
} from "./AIProfileCard.types";

const defaultProfile: AIFinancialProfile = {
  classification: "attention",
  riskLabel: "Risco moderado",
  confidence: 82,
  indicators: [
    {
      id: "debt-level",
      label: "Nível de endividamento",
      value: 25,
      status: "good",
    },
    {
      id: "income-commitment",
      label: "Comprometimento da renda",
      value: 75,
      status: "attention",
    },
    {
      id: "savings-rate",
      label: "Taxa de poupança",
      value: 25,
      status: "good",
    },
  ],
};

const classificationConfig: Record<
  AIFinancialClassification,
  AIClassificationVisualConfig
> = {
  healthy: {
    label: "Saudável",
    description:
      "Sua situação financeira apresenta bons indicadores.",
    accentClassName: "bg-success",
    badgeClassName:
      "border-success/20 bg-success/10 text-success",
    iconContainerClassName:
      "border-success/20 bg-success/10",
    iconClassName: "text-success",
  },

  attention: {
    label: "Em observação",
    description:
      "Alguns indicadores precisam de acompanhamento.",
    accentClassName: "bg-warning",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    iconClassName: "text-warning",
  },

  risk: {
    label: "Em risco",
    description:
      "Existem indicadores financeiros que exigem ação.",
    accentClassName: "bg-danger",
    badgeClassName:
      "border-danger/20 bg-danger/10 text-danger",
    iconContainerClassName:
      "border-danger/20 bg-danger/10",
    iconClassName: "text-danger",
  },
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
    progressClassName: "bg-success",
  },

  attention: {
    label: "Atenção",
    badgeClassName:
      "border-warning/20 bg-warning/10 text-warning",
    progressClassName: "bg-warning",
  },

  critical: {
    label: "Crítico",
    badgeClassName:
      "border-danger/20 bg-danger/10 text-danger",
    progressClassName: "bg-danger",
  },
};

function getClassificationIcon(
  classification: AIFinancialClassification,
) {
  switch (classification) {
    case "healthy":
      return ShieldCheck;

    case "attention":
      return ShieldAlert;

    case "risk":
      return AlertTriangle;
  }
}

export function AIProfileCard({
  title = "Como a IA classificou sua situação?",
  description = "Perfil financeiro gerado pela análise inteligente.",
  profile = defaultProfile,
  onViewDetails,
}: Readonly<AIProfileCardProps>) {
  const safeConfidence = Math.min(
    Math.max(profile.confidence, 0),
    100,
  );

  const classification =
    classificationConfig[
      profile.classification
    ];

  const ClassificationIcon =
    getClassificationIcon(
      profile.classification,
    );

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
            "rounded-[13px] border",
            "border-primary/20",
            "bg-primary/10 text-primary-bright",
          )}
          aria-hidden="true"
        >
          <BrainCircuit size={18} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-[16px] border border-border",
            "bg-surface-elevated/55 p-4",
          )}
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 w-0.5",
              classification.accentClassName,
            )}
            aria-hidden="true"
          />

          <div
            className={cn(
              "grid min-w-0 grid-cols-1",
              "items-center gap-4",
              "sm:grid-cols-[minmax(0,1fr)_auto]",
            )}
          >
            <div className="min-w-0">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0",
                    "items-center justify-center",
                    "rounded-[12px] border",
                    classification.iconContainerClassName,
                    classification.iconClassName,
                  )}
                  aria-hidden="true"
                >
                  <ClassificationIcon size={18} />
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
            </div>

            <AIConfidenceGauge
              value={safeConfidence}
            />
          </div>
        </div>

        <div
          className="mt-4 space-y-2.5"
          aria-label="Indicadores da classificação financeira"
        >
          {profile.indicators.map(
            (indicator) => {
              const safeValue = Math.min(
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
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={cn(
                          "shrink-0",
                          indicator.status === "good"
                            ? "text-success"
                            : indicator.status ===
                                "attention"
                              ? "text-warning"
                              : "text-danger",
                        )}
                        aria-hidden="true"
                      />

                      <span className="truncate text-[11px] font-medium text-text-muted">
                        {indicator.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] font-semibold tabular-nums text-text">
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
                        "transition-[width] duration-500",
                        status.progressClassName,
                      )}
                      style={{
                        width: `${safeValue}%`,
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
            "mt-4 flex items-center",
            "justify-between gap-3",
            "rounded-[12px]",
            "border border-primary/15",
            "bg-primary/5 px-3 py-2.5",
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <BrainCircuit
              size={14}
              className="shrink-0 text-primary-bright"
              aria-hidden="true"
            />

            <span className="text-[10px] leading-4 text-text-muted">
              Resultado gerado pela análise do Finance AI.
            </span>
          </div>

          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-primary-bright">
            {safeConfidence}% confiável
          </span>
        </div>

        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className={cn(
              "mt-4 inline-flex h-10",
              "w-full items-center",
              "justify-center gap-2",
              "rounded-[12px]",
              "border border-primary/15",
              "bg-primary/5",
              "text-xs font-semibold",
              "text-primary-bright",
              "transition-[border-color,background-color]",
              "hover:border-primary/30",
              "hover:bg-primary/10",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/40",
            )}
          >
            Ver detalhes

            <ArrowRight
              size={14}
              aria-hidden="true"
            />
          </button>
        )}
      </CardContent>
    </Card>
  );
}