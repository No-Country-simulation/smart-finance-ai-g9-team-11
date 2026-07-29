import type { ChartTooltipProps } from "./Chart.types";

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md bg-[var(--chart-tooltip-bg)] px-4 py-3 shadow-elevated">
      {label && (
        <p className="mb-2 text-caption font-medium text-[var(--chart-tooltip-text)] opacity-70">
          {label}
        </p>
      )}

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-caption text-[var(--chart-tooltip-text)]"
        >
          <span className="opacity-80">{item.name}</span>
          <span className="font-semibold">
            {typeof item.value === "number"
              ? item.value.toLocaleString("pt-BR")
              : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
