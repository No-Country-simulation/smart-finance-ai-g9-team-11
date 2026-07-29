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
import { dashboardService } from "@/services/dashboard.service";

import { InsightItem } from "./InsightItem";

import type {
  AIInsightsProps,
  InsightPresentation,
} from "./AIInsights.types";

const DEFAULT_MAX_VISIBLE_INSIGHTS = 4;

const fallbackPresentations: readonly InsightPresentation[] =
  [
    {
      icon: Sparkles,
      tone: "success",
      title: "Seu desempenho melhorou",
    },
    {
      icon: Lightbulb,
      tone: "warning",
      title: "Oportunidade de economia",
    },
    {
      icon: ArrowUpRight,
      tone: "info",
      title: "Movimentação financeira",
    },
    {
      icon: TriangleAlert,
      tone: "danger",
      title: "Ponto de atenção",
    },
  ];

function getInsightPresentation(
  insight: string,
  index: number,
): InsightPresentation {
  const normalizedInsight =
    insight.toLocaleLowerCase("pt-BR");

  if (
    normalizedInsight.includes("assinatura") ||
    normalizedInsight.includes("atenção") ||
    normalizedInsight.includes("risco")
  ) {
    return {
      icon: CreditCard,
      tone: "danger",
      title: "Atenção necessária",
    };
  }

  if (
    normalizedInsight.includes("economizar") ||
    normalizedInsight.includes("gasto") ||
    normalizedInsight.includes("despesa") ||
    normalizedInsight.includes("reduziu")
  ) {
    return {
      icon: Lightbulb,
      tone: "warning",
      title: "Oportunidade de economia",
    };
  }

  if (
    normalizedInsight.includes("aument") ||
    normalizedInsight.includes("crescimento") ||
    normalizedInsight.includes("receita") ||
    normalizedInsight.includes("renda") ||
    normalizedInsight.includes("score")
  ) {
    return {
      icon: ArrowUpRight,
      tone: "success",
      title: "Evolução positiva",
    };
  }

  return (
    fallbackPresentations[
      index % fallbackPresentations.length
    ] ?? fallbackPresentations[0]
  );
}

export function AIInsights({
  title = "AI Assistant",
  subtitle = "Insights e recomendações inteligentes para suas finanças.",
  maxVisibleInsights = DEFAULT_MAX_VISIBLE_INSIGHTS,
}: Readonly<AIInsightsProps>) {
  const insights: readonly string[] =
    dashboardService.getInsights();

  const safeMaxVisibleInsights = Math.max(
    0,
    maxVisibleInsights,
  );

  const visibleInsights = insights.slice(
    0,
    safeMaxVisibleInsights,
  );

  const hiddenInsightsCount = Math.max(
    insights.length - visibleInsights.length,
    0,
  );

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center",
              "justify-center rounded-[13px]",
              "border border-primary/25",
              "bg-gradient-to-br from-primary/20",
              "via-primary/10 to-secondary/15",
              "text-primary-bright",
              "shadow-[0_0_24px_-12px_var(--glow-primary)]",
            )}
            aria-hidden="true"
          >
            <Bot size={20} />
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

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5",
            "rounded-full border border-success/20",
            "bg-success/10 px-2.5 py-1",
            "text-[10px] font-semibold text-success",
          )}
        >
          <span
            className="relative flex size-1.5"
            aria-hidden="true"
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />

            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>

          Online
        </span>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {visibleInsights.length > 0 ? (
          <div
            className={cn(
              "grid min-w-0 flex-1 grid-cols-1 gap-3",
              "md:grid-cols-2",
            )}
            aria-label="Insights do assistente financeiro"
          >
            {visibleInsights.map(
              (
                insight: string,
                index: number,
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
                    presentation={presentation}
                  />
                );
              },
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[280px] flex-col",
              "items-center justify-center",
              "rounded-[16px] border",
              "border-dashed border-border",
              "px-6 text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center",
                "justify-center rounded-[15px]",
                "border border-primary/20",
                "bg-primary/10 text-primary-bright",
              )}
              aria-hidden="true"
            >
              <Bot size={22} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhum insight disponível
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              Uma nova análise financeira poderá gerar
              recomendações personalizadas.
            </p>
          </div>
        )}

        {hiddenInsightsCount > 0 && (
          <p className="mt-3 text-center text-xs text-text-muted">
            +{hiddenInsightsCount}{" "}
            {hiddenInsightsCount === 1
              ? "insight adicional"
              : "insights adicionais"}
          </p>
        )}

        <div
          className={cn(
            "mt-4 flex min-w-0 items-center gap-2",
            "rounded-[14px] border border-border",
            "bg-background/50 p-1.5",
            "transition-colors duration-200",
            "focus-within:border-primary/40",
          )}
        >
          <label
            htmlFor="ai-financial-question"
            className="sr-only"
          >
            Pergunte algo sobre suas finanças
          </label>

          <input
            id="ai-financial-question"
            type="text"
            disabled
            placeholder="Pergunte algo sobre suas finanças..."
            className={cn(
              "h-9 min-w-0 flex-1 bg-transparent px-2",
              "text-xs text-text outline-none",
              "placeholder:text-text-subtle",
              "disabled:cursor-not-allowed",
              "disabled:opacity-80",
            )}
          />

          <button
            type="button"
            disabled
            aria-label="Enviar pergunta"
            title="Disponível após a integração com o backend"
            className={cn(
              "flex size-9 shrink-0 items-center",
              "justify-center rounded-[11px]",
              "bg-gradient-to-br from-primary",
              "to-secondary text-white",
              "shadow-sm transition-opacity",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
            )}
          >
            <Send
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-text-subtle">
          <Sparkles
            size={11}
            aria-hidden="true"
          />

          <span>
            Chat disponível após a integração com o backend.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}