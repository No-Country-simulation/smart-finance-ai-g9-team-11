import { Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { cn } from "@/lib/utils";

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

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "flex size-9 shrink-0 items-center",
            "justify-center rounded-lg",
            "bg-surface-muted text-text-muted",
          )}
          aria-hidden="true"
        >
          <Zap className="size-4" />
        </div>
      </CardHeader>

      <CardContent>
        {actions.length > 0 ? (
          <div
            className={cn(
              "grid min-w-0 grid-cols-1 gap-3",
              "sm:grid-cols-2",
              "xl:grid-cols-2",
            )}
          >
            {actions.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                onAction={onAction}
              />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-28 items-center justify-center",
              "rounded-xl border border-dashed",
              "border-border px-4 py-6 text-center",
            )}
          >
            <p className="text-xs leading-5 text-text-muted">
              Nenhuma ação rápida está disponível.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}