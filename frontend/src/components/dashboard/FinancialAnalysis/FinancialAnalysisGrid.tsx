import {
  Activity,
  BrainCircuit,
  ChartNoAxesCombined,
  PieChart,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { cn } from "@/lib/utils";

import {
  AIProfileCard,
} from "../AIProfileCard";

import {
  ExpenseDistribution,
} from "../ExpenseDistribution";

import {
  FinancialHealthRadar,
} from "../FinancialHealthRadar";

import type {
  AIFinancialIndicatorStatus,
  AIFinancialProfile,
} from "../AIProfileCard";

import type {
  FinancialHealthMetric,
} from "../FinancialHealthRadar";

import type {
  FinancialAnalysis,
  FinancialProfile,
  SavingFrequency,
} from "@/types/financial-analysis";

interface FinancialAnalysisGridProps {
  analysis?: FinancialAnalysis | null;
  onViewDetails?: () => void;
}

function normalizePercentage(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    Math.max(
      Math.round(value),
      0,
    ),
    100,
  );
}

function normalizeProbability(
  probability: number,
): number {
  if (
    !Number.isFinite(
      probability,
    )
  ) {
    return 0;
  }

  const percentage =
    probability <= 1
      ? probability * 100
      : probability;

  return normalizePercentage(
    percentage,
  );
}

function mapClassification(
  profile: FinancialProfile,
): AIFinancialProfile["classification"] {
  switch (profile) {
    case "Saudável":
      return "healthy";

    case "Em observação":
      return "attention";

    case "Em risco":
      return "risk";
  }
}

function getDebtStatus(
  debtLevel: number,
): AIFinancialIndicatorStatus {
  if (debtLevel < 30) {
    return "good";
  }

  if (debtLevel < 50) {
    return "attention";
  }

  return "critical";
}

function getSavingsValue(
  frequency: SavingFrequency,
): number {
  switch (frequency) {
    case "Baixa":
      return 25;

    case "Média":
      return 60;

    case "Alta":
      return 90;
  }
}

function getSavingsStatus(
  frequency: SavingFrequency,
): AIFinancialIndicatorStatus {
  switch (frequency) {
    case "Alta":
      return "good";

    case "Média":
      return "attention";

    case "Baixa":
      return "critical";
  }
}

function getConfidenceStatus(
  confidence: number,
): AIFinancialIndicatorStatus {
  if (confidence >= 70) {
    return "good";
  }

  if (confidence >= 50) {
    return "attention";
  }

  return "critical";
}

function createProfile(
  analysis: FinancialAnalysis,
): AIFinancialProfile {
  const debtLevel =
    normalizePercentage(
      analysis.nivel_endividamento,
    );

  const confidence =
    normalizeProbability(
      analysis.probabilidade,
    );

  return {
    classification:
      mapClassification(
        analysis.perfil_financeiro,
      ),

    riskLabel:
      analysis.perfil_financeiro,

    confidence,

    indicators: [
      {
        id:
          "debt-level",

        label:
          "Nível de endividamento",

        value:
          debtLevel,

        status:
          getDebtStatus(
            debtLevel,
          ),
      },

      {
        id:
          "saving-frequency",

        label:
          "Frequência de poupança",

        value:
          getSavingsValue(
            analysis.frequencia_poupanca,
          ),

        status:
          getSavingsStatus(
            analysis.frequencia_poupanca,
          ),
      },

      {
        id:
          "analysis-confidence",

        label:
          "Confiança da análise",

        value:
          confidence,

        status:
          getConfidenceStatus(
            confidence,
          ),
      },
    ],
  };
}

function createHealthMetrics(
  analysis: FinancialAnalysis,
): FinancialHealthMetric[] {
  const debtLevel =
    normalizePercentage(
      analysis.nivel_endividamento,
    );

  const savingsValue =
    getSavingsValue(
      analysis.frequencia_poupanca,
    );

  const confidence =
    normalizeProbability(
      analysis.probabilidade,
    );

  return [
    {
      id:
        "debt-control",

      subject:
        "Controle de dívidas",

      value:
        normalizePercentage(
          100 - debtLevel,
        ),

      fullMark: 100,

      description:
        "Representa o controle do endividamento a partir do nível identificado pela análise financeira.",
    },

    {
      id:
        "savings",

      subject:
        "Poupança",

      value:
        savingsValue,

      fullMark: 100,

      description:
        "Representação visual da frequência de poupança classificada pela análise financeira.",
    },

    {
      id:
        "confidence",

      subject:
        "Confiança",

      value:
        confidence,

      fullMark: 100,

      description:
        "Indica o nível de confiança associado ao perfil financeiro identificado.",
    },
  ];
}

function createCategories(
  analysis: FinancialAnalysis,
) {
  return Object.entries(
    analysis.resumo_gastos,
  )
    .map(
      ([name, value]) => ({
        name,
        value:
          Number(value),
      }),
    )
    .filter(
      (category) =>
        Number.isFinite(
          category.value,
        ) &&
        category.value > 0,
    )
    .sort(
      (
        first,
        second,
      ) =>
        second.value -
        first.value,
    );
}

export function FinancialAnalysisGrid({
  analysis = null,
  onViewDetails,
}: Readonly<FinancialAnalysisGridProps>) {
  const profile =
    analysis
      ? createProfile(
          analysis,
        )
      : null;

  const healthMetrics =
    analysis
      ? createHealthMetrics(
          analysis,
        )
      : [];

  const categories =
    analysis
      ? createCategories(
          analysis,
        )
      : [];

  return (
    <section
      className="min-w-0 space-y-4"
      aria-labelledby="financial-analysis-title"
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          "sm:flex-row",
          "sm:items-start",
          "sm:justify-between",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0",
              "items-center justify-center",
              "rounded-[13px] border",
              "border-primary/20",
              "bg-primary/10",
              "text-primary-bright",
            )}
            aria-hidden="true"
          >
            <ChartNoAxesCombined
              size={18}
            />
          </div>

          <div className="min-w-0">
            <h2
              id="financial-analysis-title"
              className="text-base font-semibold text-text"
            >
              Análise financeira
            </h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Acompanhe a distribuição dos dados financeiros,
              os indicadores de saúde e a classificação
              identificada pelo Finance AI.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex w-fit",
            "items-center gap-2",
            "rounded-[12px]",
            "border border-border",
            "bg-surface-elevated/55",
            "px-3 py-2",
            "text-[10px]",
            "font-medium",
            "text-text-muted",
          )}
        >
          <Activity
            size={13}
            aria-hidden="true"
          />

          {analysis
            ? "Análise disponível"
            : "Análise pendente"}
        </div>
      </div>

      <div
        className={cn(
          "grid min-w-0",
          "grid-cols-1",
          "items-stretch gap-4",
          "md:grid-cols-2",
          "xl:grid-cols-3",
        )}
      >
        <div className="min-w-0">
          <ExpenseDistribution
            categories={
              categories
            }
          />
        </div>

        <div className="min-w-0">
          <FinancialHealthRadar
            metrics={
              healthMetrics
            }
            onViewDetails={
              onViewDetails
            }
          />
        </div>

        <div
          className={cn(
            "min-w-0",
            "md:col-span-2",
            "xl:col-span-1",
          )}
        >
          <AIProfileCard
            profile={
              profile
            }
            onViewDetails={
              onViewDetails
            }
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-9",
                "items-center justify-center",
                "rounded-[11px]",
                "border border-primary/20",
                "bg-primary/10",
                "text-primary-bright",
              )}
            >
              <BrainCircuit
                size={17}
                aria-hidden="true"
              />
            </div>

            <div>
              <CardTitle className="text-sm font-semibold">
                Visão consolidada
              </CardTitle>

              <p className="mt-1 text-xs text-text-muted">
                Os indicadores abaixo são construídos a partir
                dos dados retornados pela análise financeira.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className={cn(
              "grid grid-cols-1 gap-3",
              "sm:grid-cols-3",
            )}
          >
            <div
              className={cn(
                "rounded-[12px]",
                "border border-border-muted",
                "bg-background/30",
                "p-3",
              )}
            >
              <PieChart
                size={15}
                className="text-primary-bright"
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-semibold text-text">
                Distribuição financeira
              </p>

              <p className="mt-1 text-[10px] leading-4 text-text-muted">
                Valores agrupados por categoria.
              </p>
            </div>

            <div
              className={cn(
                "rounded-[12px]",
                "border border-border-muted",
                "bg-background/30",
                "p-3",
              )}
            >
              <Activity
                size={15}
                className="text-secondary-bright"
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-semibold text-text">
                Saúde financeira
              </p>

              <p className="mt-1 text-[10px] leading-4 text-text-muted">
                Endividamento, poupança e confiança da análise.
              </p>
            </div>

            <div
              className={cn(
                "rounded-[12px]",
                "border border-border-muted",
                "bg-background/30",
                "p-3",
              )}
            >
              <BrainCircuit
                size={15}
                className="text-success"
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-semibold text-text">
                Perfil financeiro
              </p>

              <p className="mt-1 text-[10px] leading-4 text-text-muted">
                Classificação identificada pelo Finance AI.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}