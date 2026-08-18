import {
  ArrowUpRight,
  Bot,
  CreditCard,
  Lightbulb,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { cn } from "@/lib/utils";

import { InsightItem } from "./InsightItem";

import type {
  AIInsightsProps,
  InsightPresentation,
} from "./AIInsights.types";

const DEFAULT_MAX_VISIBLE_INSIGHTS = 4;

const fallbackPresentations:
  readonly InsightPresentation[] = [
    {
      icon: Sparkles,
      tone: "success",
      title: "Situação financeira",
    },
    {
      icon: Lightbulb,
      tone: "warning",
      title: "Ponto de atenção",
    },
    {
      icon: ArrowUpRight,
      tone: "info",
      title: "Comportamento financeiro",
    },
    {
      icon: TriangleAlert,
      tone: "danger",
      title: "Atenção necessária",
    },
  ];

function getInsightPresentation(
  insight: string,
  index: number,
): InsightPresentation {
  const normalizedInsight =
    insight.toLocaleLowerCase(
      "pt-BR",
    );

  if (
    normalizedInsight.includes(
      "risco",
    ) ||
    normalizedInsight.includes(
      "endividamento alto",
    )
  ) {
    return {
      icon: CreditCard,
      tone: "danger",
      title:
        "Atenção necessária",
    };
  }

  if (
    normalizedInsight.includes(
      "poupança baixa",
    ) ||
    normalizedInsight.includes(
      "observação",
    )
  ) {
    return {
      icon: Lightbulb,
      tone: "warning",
      title:
        "Oportunidade de melhoria",
    };
  }

  if (
    normalizedInsight.includes(
      "saudável",
    ) ||
    normalizedInsight.includes(
      "poupança alta",
    )
  ) {
    return {
      icon: ArrowUpRight,
      tone: "success",
      title:
        "Indicador positivo",
    };
  }

  return (
    fallbackPresentations[
      index %
        fallbackPresentations.length
    ] ??
    fallbackPresentations[0]
  );
}

export function AIInsights({
  title = "AI Assistant",
  subtitle =
    "Leitura da sua análise financeira mais recente.",
  insights = [],
  maxVisibleInsights =
    DEFAULT_MAX_VISIBLE_INSIGHTS,
}: Readonly<AIInsightsProps>) {
  const safeMaxVisibleInsights =
    Math.max(
      0,
      maxVisibleInsights,
    );

  const visibleInsights =
    insights.slice(
      0,
      safeMaxVisibleInsights,
    );

  const hiddenInsightsCount =
    Math.max(
      insights.length -
        visibleInsights.length,
      0,
    );

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0",
              "items-center justify-center",
              "rounded-[13px]",
              "border border-primary/25",
              "bg-gradient-to-br",
              "from-primary/20",
              "via-primary/10",
              "to-secondary/15",
              "text-primary-bright",
            )}
          >
            <Bot
              size={20}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="truncate">
                {title}
              </span>

              <Sparkles
                size={14}
                className="shrink-0 text-secondary-bright"
                aria-hidden="true"
              />
            </CardTitle>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              {subtitle}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {visibleInsights.length >
        0 ? (
          <div
            className={cn(
              "grid min-w-0",
              "flex-1 grid-cols-1",
              "gap-3",
              "md:grid-cols-2",
            )}
          >
            {visibleInsights.map(
              (
                insight,
                index,
              ) => {
                const presentation =
                  getInsightPresentation(
                    insight,
                    index,
                  );

                return (
                  <InsightItem
                    key={`${index}-${insight}`}
                    insight={insight}
                    presentation={
                      presentation
                    }
                  />
                );
              },
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[280px]",
              "flex-col",
              "items-center",
              "justify-center",
              "rounded-[16px]",
              "border",
              "border-dashed",
              "border-border",
              "px-6 text-center",
            )}
          >
            <Bot
              size={22}
              className="text-primary-bright"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhum insight disponível
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              Execute uma análise financeira
              para gerar uma leitura do seu
              perfil.
            </p>
          </div>
        )}

        {hiddenInsightsCount >
          0 && (
          <p className="mt-3 text-center text-xs text-text-muted">
            +
            {
              hiddenInsightsCount
            }{" "}
            insights adicionais
          </p>
        )}

        <div
          className={cn(
            "mt-4 flex min-w-0",
            "items-center gap-2",
            "rounded-[14px]",
            "border border-border",
            "bg-background/50",
            "p-1.5",
          )}
        >
          <input
            type="text"
            disabled
            placeholder="Chat financeiro em breve..."
            className={cn(
              "h-9 min-w-0",
              "flex-1 bg-transparent",
              "px-2 text-xs",
              "text-text outline-none",
              "placeholder:text-text-subtle",
              "disabled:cursor-not-allowed",
            )}
          />

          <button
            type="button"
            disabled
            aria-label="Enviar pergunta"
            className={cn(
              "flex size-9",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-[11px]",
              "bg-gradient-to-br",
              "from-primary",
              "to-secondary",
              "text-white",
              "disabled:opacity-50",
            )}
          >
            <Send
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}