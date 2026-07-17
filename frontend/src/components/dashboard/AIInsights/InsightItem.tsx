import { Sparkles } from "lucide-react";

import type { InsightItemProps } from "./AIInsights.types";

export function InsightItem({ insight }: InsightItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Sparkles size={18} />
      </div>

      <p className="text-sm leading-6 text-slate-600">
        {insight}
      </p>
    </div>
  );
}