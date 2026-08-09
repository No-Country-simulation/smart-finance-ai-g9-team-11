import {
  useId,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  PieChart as PieChartIcon,
  ReceiptText,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

import type {
  ExpenseDistributionItem,
  ExpenseDistributionProps,
} from "./ExpenseDistribution.types";

const DEFAULT_MAX_VISIBLE_CATEGORIES = 6;

const chartColors = [
  "#7c3aed",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#8b5cf6",
  "#84cc16",
] as const;

const currencyFormatter = new Intl.NumberFormat(
  "pt-BR",
  {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  },
);

function buildDistributionItems(
  categories: readonly {
    name: string;
    value: number;
  }[],
  maxVisibleCategories: number,
): ExpenseDistributionItem[] {
  const safeCategories = [...categories]
    .filter((category) => category.value > 0)
    .sort(
      (first, second) =>
        second.value - first.value,
    );

  const visibleCategories = safeCategories.slice(
    0,
    maxVisibleCategories,
  );

  const hiddenCategories = safeCategories.slice(
    maxVisibleCategories,
  );

  const hiddenValue = hiddenCategories.reduce(
    (total, category) =>
      total + category.value,
    0,
  );

  const groupedCategories =
    hiddenValue > 0
      ? [
          ...visibleCategories,
          {
            name: "Outros",
            value: hiddenValue,
          },
        ]
      : visibleCategories;

  const total = groupedCategories.reduce(
    (sum, category) =>
      sum + category.value,
    0,
  );

  return groupedCategories.map(
    (category, index) => ({
      ...category,
      percentage:
        total > 0
          ? (category.value / total) * 100
          : 0,
      color:
        chartColors[
          index % chartColors.length
        ] ?? chartColors[0],
    }),
  );
}

export function ExpenseDistribution({
  title = "Para onde está indo seu dinheiro?",
  description = "Distribuição dos gastos por categoria.",
  categories: providedCategories,
  maxVisibleCategories =
    DEFAULT_MAX_VISIBLE_CATEGORIES,
  onViewDetails,
}: Readonly<ExpenseDistributionProps>) {
  const chartTitleId = useId();

  const [activeIndex, setActiveIndex] =
    useState(0);

  const serviceCategories =
    dashboardService.getCategories();

  const categories =
    providedCategories ??
    serviceCategories;

  const safeMaxVisibleCategories =
    Math.max(
      1,
      maxVisibleCategories,
    );

  const distributionItems = useMemo(
    () =>
      buildDistributionItems(
        categories,
        safeMaxVisibleCategories,
      ),
    [
      categories,
      safeMaxVisibleCategories,
    ],
  );

  const total = useMemo(
    () =>
      distributionItems.reduce(
        (sum, item) =>
          sum + item.value,
        0,
      ),
    [distributionItems],
  );

  const activeItem =
    distributionItems[activeIndex] ??
    distributionItems[0];

  const handleSliceEnter = (
    _data: unknown,
    index: number,
  ): void => {
    setActiveIndex(index);
  };

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
            "flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[13px] border",
            "border-primary/20",
            "bg-primary/10 text-primary-bright",
          )}
          aria-hidden="true"
        >
          <PieChartIcon size={18} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {distributionItems.length > 0 &&
        activeItem ? (
          <>
            <div
              className={cn(
                "grid min-w-0 flex-1",
                "grid-cols-1 items-center gap-5",
                "lg:grid-cols-[minmax(200px,0.9fr)_minmax(0,1.1fr)]",
              )}
              aria-labelledby={chartTitleId}
            >
              <div className="min-w-0">
                <div className="relative mx-auto size-[220px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          distributionItems
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="84%"
                        paddingAngle={2}
                        cornerRadius={5}
                        stroke="var(--card)"
                        strokeWidth={2}
                        animationDuration={700}
                        onMouseEnter={
                          handleSliceEnter
                        }
                      >
                        {distributionItems.map(
                          (item, index) => (
                            <Cell
                              key={item.name}
                              fill={item.color}
                              opacity={
                                index ===
                                activeIndex
                                  ? 1
                                  : 0.62
                              }
                              className="cursor-pointer transition-opacity duration-200"
                            />
                          ),
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div
                    className={cn(
                      "pointer-events-none",
                      "absolute inset-0",
                      "flex flex-col",
                      "items-center justify-center",
                      "text-center",
                    )}
                  >
                    <ReceiptText
                      size={15}
                      className="mb-1.5 text-text-subtle"
                      aria-hidden="true"
                    />

                    <span
                      className={cn(
                        "text-[10px]",
                        "font-medium uppercase",
                        "tracking-[0.08em]",
                        "text-text-subtle",
                      )}
                    >
                      Total
                    </span>

                    <strong
                      className={cn(
                        "mt-1 max-w-[150px]",
                        "text-base font-bold",
                        "leading-tight",
                        "tracking-[-0.035em]",
                        "tabular-nums text-text",
                      )}
                    >
                      {currencyFormatter.format(
                        total,
                      )}
                    </strong>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 rounded-[14px]",
                    "border border-border",
                    "bg-surface-elevated/55",
                    "p-4",
                  )}
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          activeItem.color,
                      }}
                      aria-hidden="true"
                    />

                    <span className="text-xs font-semibold text-text">
                      {activeItem.name}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-text-subtle">
                        Valor
                      </p>

                      <p className="mt-1 text-xs font-semibold tabular-nums text-text">
                        {currencyFormatter.format(
                          activeItem.value,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-text-subtle">
                        Participação
                      </p>

                      <p className="mt-1 text-xs font-semibold tabular-nums text-text">
                        {activeItem.percentage.toFixed(
                          1,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="min-w-0 space-y-2"
                aria-label="Categorias de despesas"
              >
                {distributionItems.map(
                  (item, index) => {
                    const isActive =
                      index === activeIndex;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onMouseEnter={() =>
                          setActiveIndex(
                            index,
                          )
                        }
                        onFocus={() =>
                          setActiveIndex(
                            index,
                          )
                        }
                        onClick={() =>
                          setActiveIndex(
                            index,
                          )
                        }
                        className={cn(
                          "grid w-full min-w-0",
                          "grid-cols-[minmax(0,1fr)_auto]",
                          "items-center gap-3",
                          "rounded-[11px]",
                          "border px-3 py-2",
                          "text-left",
                          "transition-[border-color,background-color]",
                          isActive
                            ? [
                                "border-border-highlight",
                                "bg-surface-elevated",
                              ]
                            : [
                                "border-transparent",
                                "hover:border-border",
                                "hover:bg-surface-elevated/55",
                              ],
                          "focus-visible:outline-none",
                          "focus-visible:ring-2",
                          "focus-visible:ring-primary/40",
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                item.color,
                            }}
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
                            {item.name}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[10px] font-medium tabular-nums text-text">
                            {currencyFormatter.format(
                              item.value,
                            )}
                          </span>

                          <span
                            className={cn(
                              "min-w-9 rounded-full",
                              "px-1.5 py-0.5",
                              "text-center text-[9px]",
                              "font-semibold tabular-nums",
                              isActive
                                ? [
                                    "bg-primary/10",
                                    "text-primary-bright",
                                  ]
                                : [
                                    "bg-surface-muted",
                                    "text-text-muted",
                                  ],
                            )}
                          >
                            {item.percentage.toFixed(
                              0,
                            )}
                            %
                          </span>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
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
          </>
        ) : (
          <div
            className={cn(
              "flex min-h-[330px]",
              "flex-1 flex-col",
              "items-center justify-center",
              "rounded-[16px]",
              "border border-dashed",
              "border-border px-6",
              "text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center",
                "justify-center",
                "rounded-[15px]",
                "border border-border",
                "bg-surface-muted",
                "text-text-muted",
              )}
              aria-hidden="true"
            >
              <PieChartIcon size={21} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhuma despesa registrada
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              A distribuição por categoria
              aparecerá quando houver despesas
              disponíveis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}