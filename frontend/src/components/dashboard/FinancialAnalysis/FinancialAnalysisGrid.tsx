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

import { AIProfileCard } from "../AIProfileCard";
import { ExpenseDistribution } from "../ExpenseDistribution";
import { FinancialHealthRadar } from "../FinancialHealthRadar";

export function FinancialAnalysisGrid() {
  return (
    <section
      className="min-w-0 space-y-4"
      aria-labelledby="financial-analysis-title"
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          "sm:flex-row sm:items-start sm:justify-between",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
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
            <ChartNoAxesCombined size={18} />
          </div>

          <div className="min-w-0">
            <h2
              id="financial-analysis-title"
              className="text-base font-semibold text-text"
            >
              Análise financeira
            </h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Acompanhe a distribuição dos gastos, a saúde
              financeira e a classificação gerada pela IA.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex w-fit items-center gap-2",
            "rounded-[12px] border border-border",
            "bg-surface-elevated/55 px-3 py-2",
            "text-[10px] font-medium text-text-muted",
          )}
        >
          <Activity
            size={13}
            aria-hidden="true"
          />

          Atualizado agora
        </div>
      </div>

      <div
        className={cn(
          "grid min-w-0 grid-cols-1",
          "items-stretch gap-4",
          "md:grid-cols-2",
          "xl:grid-cols-3",
        )}
      >
        <div className="min-w-0">
          <ExpenseDistribution />
        </div>

        <div className="min-w-0">
          <FinancialHealthRadar />
        </div>

        <div
          className={cn(
            "min-w-0",
            "md:col-span-2",
            "xl:col-span-1",
          )}
        >
          <AIProfileCard />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0",
                "items-center justify-center",
                "rounded-[11px]",
                "border border-primary/20",
                "bg-primary/10 text-primary-bright",
              )}
              aria-hidden="true"
            >
              <BrainCircuit size={16} />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">
                Visão consolidada
              </CardTitle>

              <p className="mt-1 text-xs text-text-muted">
                Os três blocos representam diferentes dimensões
                da situação financeira atual.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div
            className={cn(
              "grid grid-cols-1 gap-3",
              "sm:grid-cols-3",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                "rounded-[12px] border",
                "border-border-muted",
                "bg-background/30 px-3 py-3",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0",
                  "items-center justify-center",
                  "rounded-[10px]",
                  "bg-primary/10 text-primary-bright",
                )}
                aria-hidden="true"
              >
                <PieChart size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium text-text-subtle">
                  Gastos
                </p>

                <p className="mt-0.5 text-xs font-semibold text-text">
                  Distribuição por categoria
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-3",
                "rounded-[12px] border",
                "border-border-muted",
                "bg-background/30 px-3 py-3",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0",
                  "items-center justify-center",
                  "rounded-[10px]",
                  "bg-secondary/10 text-secondary-bright",
                )}
                aria-hidden="true"
              >
                <Activity size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium text-text-subtle">
                  Saúde
                </p>

                <p className="mt-0.5 text-xs font-semibold text-text">
                  Pilares financeiros
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-3",
                "rounded-[12px] border",
                "border-border-muted",
                "bg-background/30 px-3 py-3",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0",
                  "items-center justify-center",
                  "rounded-[10px]",
                  "bg-success/10 text-success",
                )}
                aria-hidden="true"
              >
                <BrainCircuit size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium text-text-subtle">
                  IA
                </p>

                <p className="mt-0.5 text-xs font-semibold text-text">
                  Classificação do perfil
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}