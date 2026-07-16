import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/common/Card";

import type { FinancialCardProps } from "./FinancialCard.types";

export function FinancialCard({
  title,
  value,
  variation,
  trend,
  icon,
  updatedAt = "Atualizado agora",
}: FinancialCardProps) {
  const trendColor = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-100",
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="items-start">
        <div className="flex w-full items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            {icon}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${trendColor[trend]}`}
          >
            {variation}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </h2>

        {/* Sparkline fake */}
        <div className="mt-6">
          <svg
            width="100%"
            height="42"
            viewBox="0 0 180 42"
            fill="none"
          >
            <path
              d="M0 30 L20 28 L40 20 L60 22 L80 16 L100 18 L120 10 L140 12 L160 6 L180 8"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-xs text-slate-400">
          {updatedAt}
        </span>
      </CardFooter>
    </Card>
  );
}