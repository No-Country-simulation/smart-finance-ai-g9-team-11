import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FinancialCardProps } from "./FinancialCard.types";

export function FinancialCard({
  title,
  value,
  variation,
  trend,
  icon,
}: FinancialCardProps) {
  const TrendIcon =
    trend === "up"
      ? ArrowUpRight
      : trend === "down"
      ? ArrowDownRight
      : Minus;

  return (
    <article
      className={cn(
        "rounded-2xl",
        "border",
        "border-slate-200",
        "bg-white",
        "p-6",
        "shadow-sm",
        "transition-all",
        "duration-200",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>
      </div>

      <div
        className={cn(
          "mt-6 flex items-center gap-2 text-sm font-medium",
          trend === "up" && "text-emerald-600",
          trend === "down" && "text-red-600",
          trend === "neutral" && "text-slate-500"
        )}
      >
        <TrendIcon className="h-4 w-4" />

        <span>{variation}</span>
      </div>
    </article>
  );
}