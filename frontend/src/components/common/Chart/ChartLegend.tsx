import type { ChartLegendItem } from "./Chart.types";

interface Props {
  items: ChartLegendItem[];
}

export function ChartLegend({ items }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-caption text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
