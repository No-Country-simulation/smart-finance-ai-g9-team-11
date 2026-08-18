import { cn } from "@/lib/utils";

import type { ExpenseDistributionTooltipProps } from "./ExpenseDistribution.types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function ExpenseDistributionTooltip({
  active,
  payload,
}: Readonly<ExpenseDistributionTooltipProps>) {
  const item = payload?.[0]?.payload;

  if (!active || !item) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-44 rounded-[14px]",
        "border border-border",
        "bg-surface-elevated/95 p-3",
        "shadow-elevated backdrop-blur-xl",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: item.color,
          }}
          aria-hidden="true"
        />

        <p className="truncate text-xs font-semibold text-text">
          {item.name}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-[11px] text-text-muted">
          Valor
        </span>

        <span className="text-[11px] font-semibold tabular-nums text-text">
          {currencyFormatter.format(item.value)}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-4">
        <span className="text-[11px] text-text-muted">
          Participação
        </span>

        <span className="text-[11px] font-semibold tabular-nums text-text">
          {item.percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}