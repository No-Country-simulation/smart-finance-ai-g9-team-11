import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
} from "@/components/common/Chart";

import { dashboardService } from "@/services/dashboard.service";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
];

export function ExpenseChart() {
  const data = dashboardService.getCategories();

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <ChartContainer
      title="Despesas por Categoria"
      subtitle="Últimos 30 dias"
    >
      <div className="flex h-full flex-col">
        <div className="relative flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500">
              Total
            </span>

            <span className="text-xl font-bold">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <ChartLegend
          items={data.map((item, index) => ({
            label: item.name,
            color: COLORS[index % COLORS.length],
          }))}
        />
      </div>
    </ChartContainer>
  );
}