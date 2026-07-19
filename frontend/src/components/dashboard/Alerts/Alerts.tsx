import { cn } from "@/lib/utils";
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
  const safeMaxVisibleAlerts = Math.max(
    0,
    maxVisibleAlerts,
  );

  const visibleAlerts = alerts.slice(
    0,
    safeMaxVisibleAlerts,
  );

  const hiddenAlertsCount = Math.max(
    alerts.length - visibleAlerts.length,
    0,
  );

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
        </div>

        <div
          className={cn(
            "flex size-9 shrink-0 items-center",
            "justify-center rounded-lg",
            "bg-surface-muted text-text-muted",
          )}
          aria-hidden="true"
        >
          <BellRing className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {visibleAlerts.length > 0 ? (
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
            {visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className="min-w-0"
              >
                <AlertItem
                  alert={alert}
                  onAction={onAlertAction}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-48 flex-col items-center",
              "justify-center rounded-xl",
              "border border-dashed border-border",
              "px-4 py-6 text-center",
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center",
                "rounded-full bg-success/10",
              )}
              aria-hidden="true"
            >
              <BellRing className="size-4 text-success" />
            </div>

            <p className="mt-3 text-sm font-semibold text-text">
              Nenhum alerta no momento
            </p>

            <p className="mt-1 max-w-60 text-xs leading-5 text-text-muted">
              Sua situação financeira não apresenta pontos
              críticos.
            </p>
          </div>
        )}

        {hiddenAlertsCount > 0 && (
          <p className="mt-3 text-center text-xs text-text-muted">
            +{hiddenAlertsCount}{" "}
            {hiddenAlertsCount === 1
              ? "alerta adicional"
              : "alertas adicionais"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}