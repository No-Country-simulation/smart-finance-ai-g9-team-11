import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/common/Chart";

import { dashboardService } from "@/services/dashboard.service";

export function BalanceChart() {
  const data = dashboardService.getCashFlow();

  return (
    <ChartContainer
      title="Fluxo Financeiro"
      subtitle="Receitas x Despesas nos últimos 6 meses"
    >
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="incomeGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>

            <linearGradient
              id="expenseGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `R$ ${(value / 1000).toFixed(0)}k`
            }
          />

          <Tooltip
            content={<ChartTooltip />}
          />

          <Area
            type="monotone"
            dataKey="income"
            name="Receitas"
            stroke="#2563eb"
            fill="url(#incomeGradient)"
            strokeWidth={3}
            animationDuration={900}
          />

          <Area
            type="monotone"
            dataKey="expenses"
            name="Despesas"
            stroke="#ef4444"
            fill="url(#expenseGradient)"
            strokeWidth={3}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ChartLegend
        items={[
          {
            label: "Receitas",
            color: "#2563eb",
          },
          {
            label: "Despesas",
            color: "#ef4444",
          },
        ]}
      />
    </ChartContainer>
  );
}