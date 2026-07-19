import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  WalletCards,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

import { BalanceChartTooltip } from "./BalanceChartTooltip";

const compactCurrencyFormatter = new Intl.NumberFormat(
  "pt-BR",
  {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
  },
);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

function formatAxisValue(value: number): string {
  return `R$ ${compactCurrencyFormatter.format(value)}`;
}

export function BalanceChart() {
  const data = dashboardService.getCashFlow();

  const summary = useMemo(() => {
    const latest = data.at(-1);

    if (!latest) {
      return null;
    }

    const balance = latest.income - latest.expenses;

    const expensePercentage =
      latest.income > 0
        ? Math.round(
            (latest.expenses / latest.income) * 100,
          )
        : 0;

    return {
      month: latest.month,
      income: latest.income,
      expenses: latest.expenses,
      balance,
      expensePercentage,
    };
  }, [data]);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader
        className={cn(
          "flex flex-col gap-4",
          "lg:flex-row lg:items-start",
          "lg:justify-between",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center",
              "justify-center rounded-[13px]",
              "border border-primary/20",
              "bg-primary/10 text-primary-bright",
            )}
            aria-hidden="true"
          >
            <BarChart3 size={19} />
          </div>

          <div className="min-w-0">
            <CardTitle>
              Fluxo financeiro
            </CardTitle>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Comparativo entre receitas e despesas nos
              últimos seis meses.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex w-fit items-center gap-2",
            "rounded-[12px] border border-border",
            "bg-surface-elevated/65 px-3 py-2",
            "text-[11px] font-medium text-text-muted",
          )}
        >
          <CalendarDays
            size={15}
            aria-hidden="true"
          />

          Últimos 6 meses
        </div>
      </CardHeader>

      <CardContent>
        {data.length > 0 && summary ? (
          <>
            <div
              className={cn(
                "mb-5 grid min-w-0 grid-cols-1 gap-3",
                "sm:grid-cols-3",
              )}
            >
              <div
                className={cn(
                  "min-w-0 rounded-[14px]",
                  "border border-success/15",
                  "bg-success/5 px-4 py-3",
                )}
              >
                <div className="flex items-center gap-2 text-success">
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Receitas em {summary.month}
                  </span>
                </div>

                <p className="mt-2 truncate text-sm font-bold text-text">
                  {currencyFormatter.format(
                    summary.income,
                  )}
                </p>
              </div>

              <div
                className={cn(
                  "min-w-0 rounded-[14px]",
                  "border border-danger/15",
                  "bg-danger/5 px-4 py-3",
                )}
              >
                <div className="flex items-center gap-2 text-danger">
                  <ArrowDownRight
                    size={15}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Despesas em {summary.month}
                  </span>
                </div>

                <p className="mt-2 truncate text-sm font-bold text-text">
                  {currencyFormatter.format(
                    summary.expenses,
                  )}
                </p>
              </div>

              <div
                className={cn(
                  "min-w-0 rounded-[14px]",
                  "border border-primary/15",
                  "bg-primary/5 px-4 py-3",
                )}
              >
                <div className="flex items-center gap-2 text-primary-bright">
                  <WalletCards
                    size={15}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Resultado mensal
                  </span>
                </div>

                <p className="mt-2 truncate text-sm font-bold text-text">
                  {currencyFormatter.format(
                    summary.balance,
                  )}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "min-w-0 rounded-[16px]",
                "border border-border-muted",
                "bg-background/25 px-2 pb-2 pt-5",
                "sm:px-4",
              )}
            >
              <div className="h-[280px] min-w-0 sm:h-[320px] lg:h-[350px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={data}
                    margin={{
                      top: 8,
                      right: 8,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="balance-income-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity={0.34}
                        />

                        <stop
                          offset="92%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="balance-expense-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f43f5e"
                          stopOpacity={0.24}
                        />

                        <stop
                          offset="92%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="var(--border-muted)"
                      strokeDasharray="4 6"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "var(--text-muted)",
                        fontSize: 11,
                      }}
                      tickMargin={12}
                    />

                    <YAxis
                      width={62}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "var(--text-muted)",
                        fontSize: 10,
                      }}
                      tickFormatter={formatAxisValue}
                    />

                    <Tooltip
                      cursor={{
                        stroke: "var(--border-highlight)",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                      content={
                        <BalanceChartTooltip />
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Receitas"
                      stroke="#10b981"
                      fill="url(#balance-income-gradient)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 3,
                        stroke: "var(--card)",
                        fill: "#10b981",
                      }}
                      animationDuration={700}
                    />

                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="Despesas"
                      stroke="#f43f5e"
                      fill="url(#balance-expense-gradient)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 3,
                        stroke: "var(--card)",
                        fill: "#f43f5e",
                      }}
                      animationDuration={850}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              className={cn(
                "mt-4 flex flex-col gap-3",
                "sm:flex-row sm:items-center",
                "sm:justify-between",
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full bg-success"
                    aria-hidden="true"
                  />

                  <span className="text-xs font-medium text-text-muted">
                    Receitas
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full bg-danger"
                    aria-hidden="true"
                  />

                  <span className="text-xs font-medium text-text-muted">
                    Despesas
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-muted">
                Despesas representam{" "}
                <strong className="font-semibold text-text">
                  {summary.expensePercentage}%
                </strong>{" "}
                das receitas em {summary.month}.
              </p>
            </div>
          </>
        ) : (
          <div
            className={cn(
              "flex min-h-[340px] flex-col",
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
                "bg-primary/10 text-primary-bright",
              )}
            >
              <BarChart3
                size={22}
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhum dado financeiro disponível
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              O gráfico será exibido quando houver receitas
              e despesas registradas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}