import { BellRing } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/Card";

import { AlertItem } from "./AlertItem";

import type { AlertsProps } from "./Alerts.types";

const DEFAULT_MAX_VISIBLE_ALERTS = 4;

export function Alerts({
  alerts,
  title = "Alertas financeiros",
  description = "Pontos que merecem sua atenção.",
  maxVisibleAlerts = DEFAULT_MAX_VISIBLE_ALERTS,
  onAlertAction,
}: Readonly<AlertsProps>) {
  const safeMaxVisibleAlerts = Math.max(0, maxVisibleAlerts);
  const visibleAlerts = alerts.slice(0, safeMaxVisibleAlerts);
  const hiddenAlertsCount = Math.max(
    alerts.length - visibleAlerts.length,
    0,
  );

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
          <BellRing className="size-4 text-slate-600 dark:text-slate-300" />
        </div>
      </CardHeader>

      <CardContent>
        {visibleAlerts.length > 0 ? (
          <div className="space-y-2.5">
            {visibleAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAction={onAlertAction}
              />
            ))}

            {hiddenAlertsCount > 0 && (
              <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                +{hiddenAlertsCount}{" "}
                {hiddenAlertsCount === 1
                  ? "alerta adicional"
                  : "alertas adicionais"}
              </p>
            )}
          </div>
        ) : (
          <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-800">
            <div
              className="flex size-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10"
              aria-hidden="true"
            >
              <BellRing className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Nenhum alerta no momento
            </p>

            <p className="mt-1 max-w-60 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Sua situação financeira não apresenta pontos críticos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}