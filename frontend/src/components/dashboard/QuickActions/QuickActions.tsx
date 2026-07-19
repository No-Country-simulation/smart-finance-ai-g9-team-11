import {
  CheckCircle2,
  Zap,
} from "lucide-react";

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
  const availableActionsCount =
    actions.filter(
      (action) => !action.disabled,
    ).length;

  const disabledActionsCount =
    actions.length -
    availableActionsCount;

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">
            {title}
          </CardTitle>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "text-[10px] font-medium",
                "text-success",
              )}
            >
              <CheckCircle2
                size={12}
                aria-hidden="true"
              />

              {availableActionsCount}{" "}
              {availableActionsCount === 1
                ? "ação disponível"
                : "ações disponíveis"}
            </span>

            {disabledActionsCount > 0 && (
              <span className="text-[10px] font-medium text-text-subtle">
                {disabledActionsCount}{" "}
                {disabledActionsCount === 1
                  ? "em desenvolvimento"
                  : "em desenvolvimento"}
              </span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "relative flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[13px] border",
            "border-primary/20",
            "bg-primary/10",
            "text-primary-bright",
          )}
          aria-hidden="true"
        >
          <Zap className="size-[18px]" />

          <span
            className={cn(
              "absolute -right-1 -top-1",
              "flex size-5 items-center",
              "justify-center rounded-full",
              "border-2 border-card",
              "bg-primary-bright",
              "text-[9px] font-bold text-white",
            )}
          >
            {availableActionsCount}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {actions.length > 0 ? (
          <div
            className={cn(
              "grid min-w-0 flex-1",
              "grid-cols-1 gap-3",
              "sm:grid-cols-2",
              "xl:grid-cols-2",
            )}
            aria-label="Lista de ações rápidas"
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
              "flex min-h-[330px]",
              "flex-col items-center",
              "justify-center rounded-[16px]",
              "border border-dashed",
              "border-border px-6",
              "text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center",
                "justify-center rounded-[15px]",
                "border border-border",
                "bg-surface-muted",
                "text-text-muted",
              )}
              aria-hidden="true"
            >
              <Zap size={21} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhuma ação disponível
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              Os principais recursos do Finance AI aparecerão
              aqui quando estiverem disponíveis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}