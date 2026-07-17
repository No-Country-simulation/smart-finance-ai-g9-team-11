import { Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";

import { QuickActionButton } from "./QuickActionButton";
import { dashboardQuickActions } from "./quickActions.data";

import type { QuickActionsProps } from "./QuickActions.types";

export function QuickActions({
  actions = dashboardQuickActions,
  title = "Ações rápidas",
  description = "Acesse os principais recursos do Finance AI.",
  onAction,
}: Readonly<QuickActionsProps>) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">
            {title}
          </CardTitle>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
          aria-hidden="true"
        >
          <Zap className="size-4 text-slate-600 dark:text-slate-300" />
        </div>
      </CardHeader>

      <CardContent>
        {actions.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {actions.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                onAction={onAction}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-800">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              Nenhuma ação rápida está disponível.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}