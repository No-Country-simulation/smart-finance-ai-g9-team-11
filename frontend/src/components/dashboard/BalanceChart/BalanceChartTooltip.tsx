import { cn } from "@/lib/utils";

import type {
  BalanceChartTooltipPayload,
  BalanceChartTooltipProps,
} from "./BalanceChart.types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

function getPayloadLabel(
  item: BalanceChartTooltipPayload,
): string {
  if (item.dataKey === "income") {
    return "Receitas";
  }

  if (item.dataKey === "expenses") {
    return "Despesas";
  }

  return item.name ?? "Valor";
}

function getPayloadKey(
  item: BalanceChartTooltipPayload,
  index: number,
): string {
  return [
    String(item.dataKey ?? "data"),
    String(item.name ?? "valor"),
    index,
  ].join("-");
}

export function BalanceChartTooltip({
  active,
  label,
  payload,
}: Readonly<BalanceChartTooltipProps>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-44 rounded-[14px]",
        "border border-border bg-surface-elevated/95",
        "p-3 text-text shadow-elevated",
        "backdrop-blur-xl",
      )}
    >
      <p className="text-xs font-semibold text-text">
        {label}
      </p>

      <div className="mt-2 space-y-2">
        {payload.map((item, index) => {
          const numericValue = Number(item.value ?? 0);

          return (
            <div
              key={getPayloadKey(item, index)}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      item.color ?? "var(--primary)",
                  }}
                  aria-hidden="true"
                />

                <span className="truncate text-[11px] text-text-muted">
                  {getPayloadLabel(item)}
                </span>
              </div>

              <span className="shrink-0 text-[11px] font-semibold text-text">
                {Number.isFinite(numericValue)
                  ? currencyFormatter.format(numericValue)
                  : currencyFormatter.format(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}