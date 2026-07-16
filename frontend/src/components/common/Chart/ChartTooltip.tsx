import type { ChartTooltipProps } from "./Chart.types";

export function ChartTooltip({
  active,
  payload,
  label,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="mb-3 text-sm font-semibold">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex justify-between gap-6 text-sm"
        >
          <span>{item.name}</span>

          <span className="font-semibold">
            R$ {Number(item.value).toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}