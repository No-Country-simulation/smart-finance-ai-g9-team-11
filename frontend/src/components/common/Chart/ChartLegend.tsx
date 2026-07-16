import type { ChartLegendItem } from "./Chart.types";

interface Props {
  items: ChartLegendItem[];
}

export function ChartLegend({ items }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />

          <span className="text-sm text-slate-600">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}