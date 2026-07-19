import {
  BellRing,
  CheckCircle2,
  Eye,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/Card";
import { cn } from "@/lib/utils";

import { AlertItem } from "./AlertItem";

import type {
  AlertsProps,
  FinancialAlertType,
} from "./Alerts.types";

const DEFAULT_MAX_VISIBLE_ALERTS = 4;

function countAlertsByType(
  alerts: AlertsProps["alerts"],
  type: FinancialAlertType,
): number {
  return alerts.filter(
    (alert) => alert.type === type,
  ).length;
}

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

  const dangerCount = countAlertsByType(
    alerts,
    "danger",
  );

  const warningCount = countAlertsByType(
    alerts,
    "warning",
  );

  const attentionCount =
    dangerCount + warningCount;

  const shouldShowSummary =
    visibleAlerts.length > 0 &&
    visibleAlerts.length < 4;

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
            "relative flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-[13px] border",
            "border-warning/20 bg-warning/10",
            "text-warning",
          )}
          aria-hidden="true"
        >
          <BellRing className="size-4" />

          {alerts.length > 0 && (
            <span
              className={cn(
                "absolute -right-1 -top-1",
                "flex size-5 items-center justify-center",
                "rounded-full border-2 border-card",
                "bg-danger text-[9px]",
                "font-bold text-white",
              )}
            >
              {alerts.length}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        {visibleAlerts.length > 0 ? (
          <div
            className={cn(
              "grid min-w-0 flex-1",
              "grid-cols-1 gap-3",
              "md:grid-cols-2",
            )}
            aria-label="Lista de alertas financeiros"
          >
            {visibleAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAction={onAlertAction}
              />
            ))}

            {shouldShowSummary && (
              <article
                className={cn(
                  "relative flex min-h-[156px]",
                  "min-w-0 flex-col overflow-hidden",
                  "rounded-[16px] border border-border",
                  "bg-gradient-to-br",
                  "from-primary/5 via-surface-elevated/55",
                  "to-secondary/5 p-4",
                )}
                aria-label="Resumo do monitoramento financeiro"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5",
                    attentionCount > 0
                      ? "bg-warning"
                      : "bg-success",
                  )}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center",
                      "justify-center rounded-[11px]",
                      "border border-primary/20",
                      "bg-primary/10 text-primary-bright",
                    )}
                    aria-hidden="true"
                  >
                    <ShieldCheck className="size-4" />
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      "rounded-full border",
                      "border-success/20 bg-success/10",
                      "px-2 py-1 text-[9px]",
                      "font-semibold uppercase",
                      "tracking-[0.08em] text-success",
                    )}
                  >
                    <span
                      className="size-1.5 rounded-full bg-success"
                      aria-hidden="true"
                    />

                    Ativo
                  </span>
                </div>

                <div className="mt-3 min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-text">
                    Monitoramento financeiro
                  </h4>

                  <p className="mt-1.5 text-xs leading-5 text-text-muted">
                    O Finance AI acompanha suas movimentações
                    e identifica alterações relevantes.
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-3 flex items-center justify-between",
                    "gap-3 rounded-[11px]",
                    "border border-border-muted",
                    "bg-background/40 px-3 py-2",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Eye
                      className="size-3.5 text-text-muted"
                      aria-hidden="true"
                    />

                    <span className="text-[10px] font-medium text-text-muted">
                      Alertas ativos
                    </span>
                  </div>

                  <span className="text-xs font-bold text-text">
                    {alerts.length}
                  </span>
                </div>
              </article>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[330px] flex-col",
              "items-center justify-center",
              "rounded-[16px] border",
              "border-dashed border-border",
              "px-6 text-center",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center justify-center",
                "rounded-[15px]",
                "border border-success/20",
                "bg-success/10 text-success",
              )}
              aria-hidden="true"
            >
              <CheckCircle2 className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              Nenhum alerta no momento
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
              Sua situação financeira não apresenta pontos
              críticos ou mudanças relevantes.
            </p>
          </div>
        )}

        {hiddenAlertsCount > 0 && (
          <div
            className={cn(
              "mt-3 flex items-center justify-center",
              "rounded-[11px] border",
              "border-border-muted bg-background/35",
              "px-3 py-2",
            )}
          >
            <p className="text-xs text-text-muted">
              +{hiddenAlertsCount}{" "}
              {hiddenAlertsCount === 1
                ? "alerta adicional"
                : "alertas adicionais"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}