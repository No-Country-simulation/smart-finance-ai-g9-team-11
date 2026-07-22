import {
  useId,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";

import { FinancialHealthRadarTooltip } from "./FinancialHealthRadarTooltip";

import type {
  FinancialHealthMetric,
  FinancialHealthRadarProps,
} from "./FinancialHealthRadar.types";

const defaultMetrics: readonly FinancialHealthMetric[] = [
  {
    id: "savings",
    subject: "Poupança",
    value: 80,
    fullMark: 100,
    description:
      "Avalia sua capacidade de reservar parte da renda mensal.",
  },
  {
    id: "planning",
    subject: "Planejamento",
    value: 70,
    fullMark: 100,
    description:
      "Mede a organização do orçamento e a previsão dos gastos.",
  },
  {
    id: "control",
    subject: "Controle",
    value: 85,
    fullMark: 100,
    description:
      "Representa o acompanhamento e o controle das movimentações.",
  },
  {
    id: "investments",
    subject: "Investimentos",
    value: 60,
    fullMark: 100,
    description:
      "Analisa a diversificação e a regularidade dos investimentos.",
  },
  {
    id: "debt-control",
    subject: "Dívidas",
    value: 40,
    fullMark: 100,
    description:
      "Avalia o controle do endividamento e a capacidade de pagamento.",
  },
];

function sanitizeMetrics(
  metrics: readonly FinancialHealthMetric[],
): FinancialHealthMetric[] {
  return metrics.map((metric) => {
    const safeFullMark = Math.max(
      metric.fullMark,
      1,
    );

    return {
      ...metric,
      fullMark: safeFullMark,
      value: Math.min(
        Math.max(metric.value, 0),
        safeFullMark,
      ),
    };
  });
}

function getMetricPercentage(
  metric: FinancialHealthMetric,
): number {
  const safeFullMark = Math.max(
    metric.fullMark,
    1,
  );

  return Math.min(
    Math.max(
      Math.round(
        (metric.value / safeFullMark) * 100,
      ),
      0,
    ),
    100,
  );
}

export function FinancialHealthRadar({
  title = "Quão saudável está sua vida financeira?",
  description = "Análise dos principais pilares financeiros.",
  metrics: providedMetrics = defaultMetrics,
  onViewDetails,
}: Readonly<FinancialHealthRadarProps>) {
  const chartTitleId = useId();

  const metrics = useMemo(
    () => sanitizeMetrics(providedMetrics),
    [providedMetrics],
  );

  const [activeMetricId, setActiveMetricId] =
    useState<string>(
      metrics[0]?.id ?? "",
    );

  const activeMetric =
    metrics.find(
      (metric) =>
        metric.id === activeMetricId,
    ) ?? metrics[0];

  const averageScore = useMemo(() => {
    if (metrics.length === 0) {
      return 0;
    }

    const totalPercentage = metrics.reduce(
      (total, metric) =>
        total +
        (metric.value / metric.fullMark) *
          100,
      0,
    );

    return Math.round(
      totalPercentage / metrics.length,
    );
  }, [metrics]);

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <div id={chartTitleId}>
            <CardTitle className="text-sm font-semibold">
              {title}
            </CardTitle>
          </div>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "relative flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[13px] border",
            "border-secondary/20",
            "bg-secondary/10",
            "text-secondary-bright",
          )}
          aria-hidden="true"
        >
          <HeartPulse size={18} />

          <span
            className={cn(
              "absolute -right-1 -top-1",
              "flex size-6 items-center",
              "justify-center rounded-full",
              "border-2 border-card",
              "bg-secondary-bright",
              "text-[8px] font-bold text-white",
            )}
          >
            {averageScore}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {metrics.length > 0 &&
        activeMetric ? (
          <>
            <div
              className={cn(
                "grid min-w-0 flex-1",
                "grid-cols-1 items-center gap-5",
                "lg:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.05fr)]",
              )}
              aria-labelledby={chartTitleId}
            >
              <div className="min-w-0">
                <div className="relative h-[280px] min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <RadarChart
                      data={metrics}
                      outerRadius="68%"
                      margin={{
                        top: 24,
                        right: 35,
                        bottom: 24,
                        left: 35,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="financial-health-radar-fill"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7c3aed"
                            stopOpacity={0.48}
                          />

                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.18}
                          />
                        </linearGradient>
                      </defs>

                      <PolarGrid
                        stroke="var(--border-muted)"
                        gridType="polygon"
                      />

                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "var(--text-muted)",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                        tickLine={false}
                      />

                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />

                      <Radar
                        name="Saúde financeira"
                        dataKey="value"
                        stroke="#7c3aed"
                        strokeWidth={2.5}
                        fill="url(#financial-health-radar-fill)"
                        fillOpacity={1}
                        dot={{
                          r: 4,
                          fill: "#7c3aed",
                          stroke: "var(--card)",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#3b82f6",
                          stroke: "var(--card)",
                          strokeWidth: 3,
                        }}
                        animationDuration={700}
                      />
                    </RadarChart>
                  </ResponsiveContainer>

                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0",
                      "flex items-center justify-center",
                    )}
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        "flex size-[74px] flex-col",
                        "items-center justify-center",
                        "rounded-full border border-border",
                        "bg-card/90 shadow-card",
                        "backdrop-blur-sm",
                      )}
                    >
                      <Activity
                        size={14}
                        className="text-secondary-bright"
                      />

                      <strong className="mt-1 text-lg font-bold tabular-nums text-text">
                        {averageScore}
                      </strong>

                      <span className="text-[8px] font-medium uppercase tracking-[0.08em] text-text-subtle">
                        média
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="min-w-0 space-y-2"
                aria-label="Pilares da saúde financeira"
              >
                {metrics.map((metric) => {
                  const isActive =
                    metric.id === activeMetric.id;

                  const percentage =
                    getMetricPercentage(metric);

                  return (
                    <button
                      key={metric.id}
                      type="button"
                      onMouseEnter={() =>
                        setActiveMetricId(
                          metric.id,
                        )
                      }
                      onFocus={() =>
                        setActiveMetricId(
                          metric.id,
                        )
                      }
                      onClick={() =>
                        setActiveMetricId(
                          metric.id,
                        )
                      }
                      className={cn(
                        "w-full min-w-0",
                        "rounded-[11px] border",
                        "px-3 py-2.5 text-left",
                        "transition-[border-color,background-color]",
                        isActive
                          ? [
                              "border-secondary/30",
                              "bg-secondary/10",
                            ]
                          : [
                              "border-transparent",
                              "hover:border-border",
                              "hover:bg-surface-elevated/55",
                            ],
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-secondary/40",
                      )}
                    >
                      <div className="flex min-w-0 items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={cn(
                              "size-2.5 shrink-0 rounded-full",
                              isActive
                                ? "bg-secondary-bright"
                                : "bg-text-subtle",
                            )}
                            aria-hidden="true"
                          />

                          <span
                            className={cn(
                              "truncate text-[11px]",
                              "font-medium",
                              isActive
                                ? "text-text"
                                : "text-text-muted",
                            )}
                          >
                            {metric.subject}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[10px] font-semibold tabular-nums text-text">
                            {metric.value}
                          </span>

                          <span
                            className={cn(
                              "min-w-10 rounded-full",
                              "px-1.5 py-0.5",
                              "text-center text-[9px]",
                              "font-semibold tabular-nums",
                              isActive
                                ? [
                                    "bg-secondary/15",
                                    "text-secondary-bright",
                                  ]
                                : [
                                    "bg-surface-muted",
                                    "text-text-muted",
                                  ],
                            )}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            "transition-[width] duration-500",
                            isActive
                              ? "bg-secondary-bright"
                              : "bg-text-subtle",
                          )}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <FinancialHealthRadarTooltip
                metric={activeMetric}
              />
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
                  "border border-secondary/15",
                  "bg-secondary/5",
                  "text-xs font-semibold",
                  "text-secondary-bright",
                  "transition-[border-color,background-color]",
                  "hover:border-secondary/30",
                  "hover:bg-secondary/10",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-secondary/40",
                )}
              >
                Ver detalhes

                <ArrowRight
                  size={14}
                  aria-hidden="true"
                />
              </button>
            )}
          </>
        ) : (
          <div
            className={cn(
              "flex min-h-[360px] flex-1",
              "flex-col items-center",
              "justify-center rounded-[16px]",
              "border border-dashed",
              "border-border px-6",
              "text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center",
                "justify-center rounded-[15px]",
                "border border-border",
                "bg-surface-muted",
                "text-text-muted",
              )}
              aria-hidden="true"
            >
              <HeartPulse size={21} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Análise indisponível
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              Os pilares da saúde financeira serão exibidos
              quando houver dados suficientes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}