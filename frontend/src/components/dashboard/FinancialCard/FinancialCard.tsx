import {
  useId,
  type ReactNode,
} from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";

type FinancialCardTrend =
  | "up"
  | "down"
  | "neutral";

interface FinancialCardProps {
  id?: string;
  title: string;
  value: string;
  variation: string;
  trend: FinancialCardTrend;
  icon: ReactNode;
  updatedAt?: string;
  className?: string;
}

type FinancialCardTone =
  | "balance"
  | "income"
  | "expenses"
  | "neutral";

interface FinancialCardVisual {
  iconContainer: string;
  badge: string;
  lineColor: string;
  glowColor: string;
}

const visualStyles: Record<
  FinancialCardTone,
  FinancialCardVisual
> = {
  balance: {
    iconContainer:
      "border-primary/20 bg-primary/10 text-primary-bright",
    badge:
      "border-success/15 bg-success/10 text-success",
    lineColor: "#7c3aed",
    glowColor: "#7c3aed",
  },

  income: {
    iconContainer:
      "border-success/20 bg-success/10 text-success",
    badge:
      "border-success/15 bg-success/10 text-success",
    lineColor: "#10b981",
    glowColor: "#10b981",
  },

  expenses: {
    iconContainer:
      "border-danger/20 bg-danger/10 text-danger",
    badge:
      "border-danger/15 bg-danger/10 text-danger",
    lineColor: "#f43f5e",
    glowColor: "#f43f5e",
  },

  neutral: {
    iconContainer:
      "border-border bg-surface-muted text-text-muted",
    badge:
      "border-border bg-surface-muted text-text-muted",
    lineColor: "#3b82f6",
    glowColor: "#3b82f6",
  },
};

function getCardTone(
  id: string | undefined,
  trend: FinancialCardTrend,
): FinancialCardTone {
  switch (id) {
    case "balance":
      return "balance";

    case "income":
      return "income";

    case "expenses":
      return "expenses";

    default:
      return trend === "down"
        ? "expenses"
        : trend === "up"
          ? "income"
          : "neutral";
  }
}

function getSparklinePath(
  tone: FinancialCardTone,
): string {
  switch (tone) {
    case "income":
      return [
        "M2 36",
        "C18 36 26 33 40 27",
        "C55 19 63 18 76 22",
        "C91 28 104 28 118 19",
        "C132 10 144 15 158 7",
        "C166 3 174 4 178 4",
      ].join(" ");

    case "expenses":
      return [
        "M2 34",
        "C18 33 26 29 39 27",
        "C54 24 62 28 75 29",
        "C91 30 102 25 116 25",
        "C132 25 140 15 153 16",
        "C165 17 170 12 178 11",
      ].join(" ");

    case "balance":
      return [
        "M2 35",
        "C14 35 23 32 34 29",
        "C47 25 55 29 68 28",
        "C82 27 90 20 103 22",
        "C117 24 126 18 139 16",
        "C152 14 163 18 178 14",
      ].join(" ");

    case "neutral":
      return [
        "M2 35",
        "C17 35 26 31 39 28",
        "C52 25 63 27 76 23",
        "C91 18 102 20 116 17",
        "C130 14 142 16 155 10",
        "C164 7 172 8 178 7",
      ].join(" ");
  }
}

export function FinancialCard({
  id,
  title,
  value,
  variation,
  trend,
  icon,
  updatedAt = "Atualizado agora",
  className,
}: Readonly<FinancialCardProps>) {
  const gradientId = useId().replaceAll(
    ":",
    "",
  );

  const tone = getCardTone(id, trend);
  const visual = visualStyles[tone];
  const sparklinePath =
    getSparklinePath(tone);

  return (
    <Card
      className={cn(
        "group relative flex min-h-[228px] min-w-0",
        "flex-col overflow-hidden",
        "border-border bg-card",
        "transition-[border-color,transform,box-shadow]",
        "duration-200 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-border-highlight",
        "hover:shadow-elevated",
        "motion-reduce:transition-none",
        "motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0",
          "h-24 opacity-0 transition-opacity duration-300",
          "bg-[radial-gradient(circle_at_top_right,var(--glow-primary),transparent_70%)]",
          "group-hover:opacity-30",
        )}
        aria-hidden="true"
      />

      <CardHeader className="relative shrink-0 pb-3">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center",
              "justify-center rounded-[13px] border",
              "[&_svg]:size-5",
              visual.iconContainer,
            )}
            aria-hidden="true"
          >
            {icon}
          </div>

          <span
            className={cn(
              "inline-flex shrink-0 items-center",
              "rounded-full border px-2.5 py-1",
              "text-[10px] font-semibold leading-none",
              visual.badge,
            )}
          >
            {variation}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-1 flex-col pb-3 pt-0">
        <p className="text-xs font-medium text-text-muted">
          {title}
        </p>

        <p
          className={cn(
            "mt-2 min-w-0 break-words",
            "text-[clamp(1.35rem,2vw,1.75rem)]",
            "font-bold leading-tight tracking-[-0.035em]",
            "text-text",
          )}
        >
          {value}
        </p>

        <div className="mt-auto pt-5">
          <svg
            width="100%"
            height="48"
            viewBox="0 0 180 48"
            preserveAspectRatio="none"
            fill="none"
            role="img"
            aria-label={`Tendência de ${title}`}
          >
            <defs>
              <linearGradient
                id={`${gradientId}-area`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={visual.glowColor}
                  stopOpacity="0.28"
                />

                <stop
                  offset="100%"
                  stopColor={visual.glowColor}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <path
              d={`${sparklinePath} L178 48 L2 48 Z`}
              fill={`url(#${gradientId}-area)`}
            />

            <path
              d={sparklinePath}
              stroke={visual.lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "relative shrink-0 border-t border-border-muted",
          "pb-4 pt-3",
        )}
      >
        <span className="text-[10px] font-medium text-text-subtle">
          {updatedAt}
        </span>
      </CardFooter>
    </Card>
  );
}