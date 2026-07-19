import type { LucideIcon } from "lucide-react";
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

import type { AIInsightsProps } from "./AIInsights.types";

type InsightTone =
  | "success"
  | "warning"
  | "danger"
  | "info";

interface InsightPresentation {
  icon: LucideIcon;
  tone: InsightTone;
  title: string;
}

interface InsightToneStyles {
  iconContainer: string;
  icon: string;
  accent: string;
}

const MAX_VISIBLE_INSIGHTS = 4;

const toneStyles: Record<
  InsightTone,
  InsightToneStyles
> = {
  success: {
    iconContainer:
      "border-success/20 bg-success/10",
    icon: "text-success",
    accent: "bg-success",
  },

  warning: {
    iconContainer:
      "border-warning/20 bg-warning/10",
    icon: "text-warning",
    accent: "bg-warning",
  },

  danger: {
    iconContainer:
      "border-danger/20 bg-danger/10",
    icon: "text-danger",
    accent: "bg-danger",
  },

  info: {
    iconContainer:
      "border-primary/20 bg-primary/10",
    icon: "text-primary-bright",
    accent: "bg-primary-bright",
  },
};

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
    normalizedInsight.includes("despesa")
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
    normalizedInsight.includes("score")
  ) {
    return {
      icon: ArrowUpRight,
      tone: "success",
      title: "Evolução positiva",
    };
  }

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
        title: "Você pode economizar",
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

  return (
    fallbackPresentations[
      index % fallbackPresentations.length
    ] ?? fallbackPresentations[0]
  );
}

export function AIInsights({
  title = "AI Assistant",
  subtitle = "Insights e recomendações para você",
}: Readonly<AIInsightsProps>) {
  const insights: readonly string[] =
    dashboardService.getInsights();

  const visibleInsights: readonly string[] =
    insights.slice(0, MAX_VISIBLE_INSIGHTS);

  const hiddenInsightsCount = Math.max(
    insights.length - visibleInsights.length,
    0,
  );

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center",
              "justify-center rounded-[13px]",
              "border border-primary/25",
              "bg-gradient-to-br from-primary/20",
              "via-primary/10 to-secondary/15",
              "text-primary-bright",
            )}
            aria-hidden="true"
          >
            <Bot size={20} />
          </div>

          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2">
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
            className="size-1.5 rounded-full bg-success"
            aria-hidden="true"
          />

          Online
        </span>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {visibleInsights.length > 0 ? (
          <div
            className={cn(
              "grid min-w-0 flex-1 grid-cols-1 gap-3",
              "md:grid-cols-2",
            )}
            aria-label="Mensagens do assistente financeiro"
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

                const Icon = presentation.icon;
                const styles =
                  toneStyles[presentation.tone];

                return (
                  <article
                    key={`${index}-${insight}`}
                    className={cn(
                      "relative flex min-h-[150px]",
                      "min-w-0 flex-col overflow-hidden",
                      "rounded-[16px] border border-border",
                      "bg-card/70 p-4 shadow-card",
                      "transition-[background-color,border-color,transform]",
                      "duration-200",
                      "hover:-translate-y-px",
                      "hover:border-border-highlight",
                      "hover:bg-card-hover",
                      "motion-reduce:transition-none",
                      "motion-reduce:hover:translate-y-0",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 w-0.5",
                        styles.accent,
                      )}
                      aria-hidden="true"
                    />

                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center",
                          "justify-center rounded-[11px]",
                          "border",
                          styles.iconContainer,
                          styles.icon,
                        )}
                        aria-hidden="true"
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">
                          {presentation.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          {insight}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-48 flex-col items-center",
              "justify-center rounded-xl",
              "border border-dashed border-border",
              "px-4 py-6 text-center",
            )}
          >
            <Bot
              size={22}
              className="text-primary-bright"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-semibold text-text">
              Nenhum insight disponível
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Uma nova análise financeira poderá gerar
              recomendações.
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
            "bg-background/60 p-1.5",
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
              "disabled:cursor-not-allowed",
              "disabled:opacity-55",
            )}
          >
            <Send
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-text-subtle">
          Chat interativo disponível após a integração com o
          backend.
        </p>
      </CardContent>
    </Card>
  );
}