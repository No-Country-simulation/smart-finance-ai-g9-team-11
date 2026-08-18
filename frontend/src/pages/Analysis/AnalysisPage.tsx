import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  BrainCircuit,
  CalendarDays,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  getApiErrorMessage,
} from "@/services/api";

import {
  financialAnalysisService,
} from "@/services/financial-analysis.service";

import type {
  ExpenseSummary,
  FinancialAnalysis,
  FinancialAnalysisHistory,
  FinancialAnalysisRequest,
  FinancialProfile,
} from "@/types/financial-analysis";

const currencyFormatter =
  new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

const percentageFormatter =
  new Intl.NumberFormat(
    "pt-BR",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

const dateFormatter =
  new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

function getToday(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function getMonthStart(): string {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  return `${year}-${month}-01`;
}

function parseLocalDate(
  value: string,
): Date {
  return new Date(
    `${value}T00:00:00`,
  );
}

function getProfileClasses(
  profile: FinancialProfile,
): string {
  switch (profile) {
    case "Saudável":
      return "border-success/20 bg-success/10 text-success";

    case "Em observação":
      return "border-warning/20 bg-warning/10 text-warning";

    case "Em risco":
      return "border-danger/20 bg-danger/10 text-danger";

    default:
      return "border-border bg-surface-muted text-text-muted";
  }
}

function getExpenseEntries(
  summary: ExpenseSummary,
) {
  return Object.entries(
    summary,
  )
    .map(
      ([category, value]) => ({
        category,
        value: Number(value),
      }),
    )
    .filter(
      (item) =>
        Number.isFinite(
          item.value,
        ) &&
        item.value > 0,
    )
    .sort(
      (first, second) =>
        second.value -
        first.value,
    );
}

function AnalysisPage() {
  const [
    initialDate,
    setInitialDate,
  ] = useState(
    getMonthStart,
  );

  const [
    finalDate,
    setFinalDate,
  ] = useState(
    getToday,
  );

  const [
    analysis,
    setAnalysis,
  ] =
    useState<FinancialAnalysis | null>(
      null,
    );

  const [
    history,
    setHistory,
  ] = useState<
    FinancialAnalysisHistory[]
  >([]);

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isLoadingHistory,
    setIsLoadingHistory,
  ] = useState(true);

  const [
    deletingAnalysisId,
    setDeletingAnalysisId,
  ] = useState<number | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const loadHistory =
    useCallback(
      async (): Promise<void> => {
        setIsLoadingHistory(true);

        try {
          const response =
            await financialAnalysisService.findAll();

          setHistory(response);
        }
        catch (requestError) {
          setError(
            getApiErrorMessage(
              requestError,
              "Não foi possível carregar o histórico de análises.",
            ),
          );
        }
        finally {
          setIsLoadingHistory(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const expenseEntries =
    useMemo(
      () =>
        analysis
          ? getExpenseEntries(
              analysis.resumo_gastos,
            )
          : [],
      [analysis],
    );

  const totalExpenses =
    useMemo(
      () =>
        expenseEntries.reduce(
          (total, item) =>
            total +
            item.value,
          0,
        ),
      [expenseEntries],
    );

  const handleAnalyze =
    async (): Promise<void> => {
      setError(null);

      const request: FinancialAnalysisRequest =
        {
          data_inicial:
            initialDate,
          data_final:
            finalDate,
        };

      setIsAnalyzing(true);

      try {
        const response =
          await financialAnalysisService.create(
            request,
          );

        setAnalysis(response);

        await loadHistory();
      }
      catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível gerar a análise financeira.",
          ),
        );
      }
      finally {
        setIsAnalyzing(false);
      }
    };

  const handleDeleteAnalysis =
    async (
      analysisId: number,
    ): Promise<void> => {
      setDeletingAnalysisId(
        analysisId,
      );

      setError(null);

      try {
        await financialAnalysisService.remove(
          analysisId,
        );

        setHistory(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                analysisId,
            ),
        );
      }
      catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível excluir a análise.",
          ),
        );
      }
      finally {
        setDeletingAnalysisId(
          null,
        );
      }
    };

  return (
    <main
      className={cn(
        "min-w-0 space-y-6",
        "pb-8",
      )}
    >
      <header
        className={cn(
          "flex flex-col gap-4",
          "lg:flex-row",
          "lg:items-start",
          "lg:justify-between",
        )}
      >
        <div>
          <p
            className={cn(
              "text-xs font-semibold",
              "uppercase",
              "tracking-[0.12em]",
              "text-primary-bright",
            )}
          >
            Finance AI
          </p>

          <h1
            className={cn(
              "mt-2 text-2xl",
              "font-bold tracking-tight",
              "text-text",
              "sm:text-3xl",
            )}
          >
            Análise financeira
          </h1>

          <p
            className={cn(
              "mt-2 max-w-2xl",
              "text-sm leading-6",
              "text-text-muted",
            )}
          >
            Analise suas movimentações,
            identifique seu perfil
            financeiro e receba
            recomendações personalizadas.
          </p>
        </div>

        <div
          className={cn(
            "inline-flex w-fit",
            "items-center gap-2",
            "rounded-[12px]",
            "border border-border",
            "bg-card px-3 py-2",
            "text-[10px]",
            "font-medium",
            "text-text-muted",
          )}
        >
          <BrainCircuit
            size={14}
            className="text-primary-bright"
            aria-hidden="true"
          />

          Análise inteligente
        </div>
      </header>

      <section
        className={cn(
          "rounded-[20px]",
          "border border-border",
          "bg-card p-5",
        )}
        aria-label="Período da análise"
      >
        <div
          className={cn(
            "grid grid-cols-1",
            "gap-4",
            "lg:grid-cols-[1fr_1fr_auto]",
            "lg:items-end",
          )}
        >
          <div>
            <label
              htmlFor="analysis-start-date"
              className="text-xs font-semibold text-text"
            >
              Data inicial
            </label>

            <input
              id="analysis-start-date"
              type="date"
              value={initialDate}
              max={getToday()}
              onChange={(event) => {
                setInitialDate(
                  event.target.value,
                );
              }}
              className={cn(
                "mt-2 h-11 w-full",
                "rounded-[12px]",
                "border border-border",
                "bg-background px-3",
                "text-sm text-text",
                "outline-none",
                "focus:border-primary/60",
                "focus:ring-2",
                "focus:ring-primary/10",
              )}
            />
          </div>

          <div>
            <label
              htmlFor="analysis-end-date"
              className="text-xs font-semibold text-text"
            >
              Data final
            </label>

            <input
              id="analysis-end-date"
              type="date"
              value={finalDate}
              max={getToday()}
              onChange={(event) => {
                setFinalDate(
                  event.target.value,
                );
              }}
              className={cn(
                "mt-2 h-11 w-full",
                "rounded-[12px]",
                "border border-border",
                "bg-background px-3",
                "text-sm text-text",
                "outline-none",
                "focus:border-primary/60",
                "focus:ring-2",
                "focus:ring-primary/10",
              )}
            />
          </div>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={() => {
              void handleAnalyze();
            }}
            className={cn(
              "inline-flex h-11",
              "items-center",
              "justify-center",
              "gap-2 rounded-[12px]",
              "bg-primary px-5",
              "text-xs font-semibold",
              "text-white",
              "transition-opacity",
              "hover:opacity-90",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            )}
          >
            {isAnalyzing ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />

                Analisando...
              </>
            ) : (
              <>
                <Sparkles
                  size={16}
                  aria-hidden="true"
                />

                Executar análise
              </>
            )}
          </button>
        </div>

        <div
          className={cn(
            "mt-4 flex",
            "items-start gap-2",
            "rounded-[12px]",
            "border border-border-muted",
            "bg-background/30",
            "px-3 py-2.5",
          )}
        >
          <CalendarDays
            size={14}
            className="mt-0.5 shrink-0 text-text-subtle"
            aria-hidden="true"
          />

          <p
            className={cn(
              "text-[10px]",
              "leading-4",
              "text-text-muted",
            )}
          >
            O período precisa possuir
            pelo menos 3 transações
            registradas para que uma
            análise seja gerada.
          </p>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className={cn(
            "flex items-start",
            "gap-3 rounded-[16px]",
            "border border-danger/20",
            "bg-danger/5",
            "px-4 py-3",
          )}
        >
          <TriangleAlert
            size={17}
            className="mt-0.5 shrink-0 text-danger"
            aria-hidden="true"
          />

          <p
            className={cn(
              "text-xs leading-5",
              "text-danger",
            )}
          >
            {error}
          </p>
        </div>
      )}

      {analysis ? (
        <section
          className="space-y-4"
          aria-labelledby="analysis-result-title"
        >
          <div
            className={cn(
              "flex items-center",
              "justify-between",
              "gap-4",
            )}
          >
            <div>
              <h2
                id="analysis-result-title"
                className="text-base font-semibold text-text"
              >
                Resultado atual
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                Resultado da análise do
                período selecionado.
              </p>
            </div>

            <span
              className={cn(
                "inline-flex rounded-full",
                "border px-3 py-1.5",
                "text-[10px]",
                "font-semibold",
                getProfileClasses(
                  analysis.perfil_financeiro,
                ),
              )}
            >
              {
                analysis.perfil_financeiro
              }
            </span>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              "sm:grid-cols-2",
              "xl:grid-cols-4",
            )}
          >
            <article
              className={cn(
                "rounded-[18px]",
                "border border-border",
                "bg-card p-4",
              )}
            >
              <ShieldCheck
                size={18}
                className="text-primary-bright"
                aria-hidden="true"
              />

              <p className="mt-3 text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                Perfil
              </p>

              <p className="mt-1 text-sm font-bold text-text">
                {
                  analysis.perfil_financeiro
                }
              </p>
            </article>

            <article
              className={cn(
                "rounded-[18px]",
                "border border-border",
                "bg-card p-4",
              )}
            >
              <Activity
                size={18}
                className="text-warning"
                aria-hidden="true"
              />

              <p className="mt-3 text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                Endividamento
              </p>

              <p className="mt-1 text-sm font-bold text-text">
                {percentageFormatter.format(
                  analysis.nivel_endividamento,
                )}
                %
              </p>
            </article>

            <article
              className={cn(
                "rounded-[18px]",
                "border border-border",
                "bg-card p-4",
              )}
            >
              <WalletCards
                size={18}
                className="text-success"
                aria-hidden="true"
              />

              <p className="mt-3 text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                Poupança
              </p>

              <p className="mt-1 text-sm font-bold text-text">
                {
                  analysis.frequencia_poupanca
                }
              </p>
            </article>

            <article
              className={cn(
                "rounded-[18px]",
                "border border-border",
                "bg-card p-4",
              )}
            >
              <BrainCircuit
                size={18}
                className="text-secondary-bright"
                aria-hidden="true"
              />

              <p className="mt-3 text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                Confiança
              </p>

              <p className="mt-1 text-sm font-bold text-text">
                {percentageFormatter.format(
                  Number(
                    analysis.probabilidade,
                  ) <= 1
                    ? Number(
                        analysis.probabilidade,
                      ) * 100
                    : Number(
                        analysis.probabilidade,
                      ),
                )}
                %
              </p>
            </article>
          </div>

          <div
            className={cn(
              "grid grid-cols-1",
              "gap-4",
              "xl:grid-cols-2",
            )}
          >
            <article
              className={cn(
                "rounded-[20px]",
                "border border-border",
                "bg-card p-5",
              )}
            >
              <h3 className="text-sm font-semibold text-text">
                Gastos por categoria
              </h3>

              <p className="mt-1 text-xs text-text-muted">
                Distribuição calculada
                para o período analisado.
              </p>

              {expenseEntries.length >
              0 ? (
                <div className="mt-5 space-y-3">
                  {expenseEntries.map(
                    (item) => {
                      const percentage =
                        totalExpenses > 0
                          ? (item.value /
                              totalExpenses) *
                            100
                          : 0;

                      return (
                        <div
                          key={
                            item.category
                          }
                        >
                          <div
                            className={cn(
                              "flex items-center",
                              "justify-between",
                              "gap-3",
                            )}
                          >
                            <span className="text-xs font-medium text-text-muted">
                              {
                                item.category
                              }
                            </span>

                            <span className="text-xs font-semibold tabular-nums text-text">
                              {currencyFormatter.format(
                                item.value,
                              )}
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(
                                  percentage,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <p className="mt-5 text-xs text-text-muted">
                  Nenhuma despesa
                  registrada no período.
                </p>
              )}
            </article>

            <article
              className={cn(
                "rounded-[20px]",
                "border border-border",
                "bg-card p-5",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10",
                    "items-center",
                    "justify-center",
                    "rounded-[13px]",
                    "border border-primary/20",
                    "bg-primary/10",
                    "text-primary-bright",
                  )}
                >
                  <Sparkles
                    size={18}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text">
                    Recomendações
                  </h3>

                  <p className="mt-1 text-xs text-text-muted">
                    Orientações geradas
                    para sua situação.
                  </p>
                </div>
              </div>

              {analysis.recomendacoes
                .length > 0 ? (
                <div className="mt-5 space-y-3">
                  {analysis.recomendacoes.map(
                    (
                      recommendation,
                      index,
                    ) => (
                      <div
                        key={`${index}-${recommendation}`}
                        className={cn(
                          "rounded-[14px]",
                          "border border-border-muted",
                          "bg-background/30",
                          "px-4 py-3",
                        )}
                      >
                        <p className="text-xs leading-5 text-text-muted">
                          {
                            recommendation
                          }
                        </p>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-5 text-xs text-text-muted">
                  Nenhuma recomendação
                  foi retornada.
                </p>
              )}
            </article>
          </div>
        </section>
      ) : (
        <section
          className={cn(
            "flex min-h-[260px]",
            "flex-col",
            "items-center",
            "justify-center",
            "rounded-[20px]",
            "border border-dashed",
            "border-border",
            "bg-card/40",
            "px-6 text-center",
          )}
        >
          <BrainCircuit
            size={26}
            className="text-primary-bright"
            aria-hidden="true"
          />

          <h2 className="mt-4 text-sm font-semibold text-text">
            Gere sua primeira análise
          </h2>

          <p
            className={cn(
              "mt-2 max-w-md",
              "text-xs leading-5",
              "text-text-muted",
            )}
          >
            Escolha um período com pelo
            menos três transações para
            descobrir seu perfil e receber
            recomendações.
          </p>
        </section>
      )}

      <section
        className={cn(
          "overflow-hidden",
          "rounded-[20px]",
          "border border-border",
          "bg-card",
        )}
        aria-labelledby="analysis-history-title"
      >
        <header
          className={cn(
            "flex items-center",
            "justify-between",
            "gap-4 border-b",
            "border-border",
            "px-5 py-4",
          )}
        >
          <div>
            <h2
              id="analysis-history-title"
              className="text-sm font-semibold text-text"
            >
              Histórico de análises
            </h2>

            <p className="mt-1 text-[10px] text-text-subtle">
              Resultados anteriormente
              gerados.
            </p>
          </div>

          <button
            type="button"
            disabled={
              isLoadingHistory
            }
            onClick={() => {
              void loadHistory();
            }}
            aria-label="Atualizar histórico"
            className={cn(
              "flex size-9",
              "items-center",
              "justify-center",
              "rounded-[11px]",
              "text-text-muted",
              "hover:bg-surface-elevated",
              "hover:text-text",
              "disabled:opacity-50",
            )}
          >
            <RefreshCw
              size={15}
              className={cn(
                isLoadingHistory &&
                  "animate-spin",
              )}
              aria-hidden="true"
            />
          </button>
        </header>

        {isLoadingHistory ? (
          <div
            className={cn(
              "flex min-h-[180px]",
              "items-center",
              "justify-center",
            )}
          >
            <LoaderCircle
              size={22}
              className="animate-spin text-primary-bright"
              aria-hidden="true"
            />
          </div>
        ) : history.length > 0 ? (
          <div className="divide-y divide-border-muted">
            {history.map(
              (item) => (
                <article
                  key={item.id}
                  className={cn(
                    "flex flex-col",
                    "gap-4 px-5 py-4",
                    "lg:flex-row",
                    "lg:items-center",
                    "lg:justify-between",
                  )}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={cn(
                        "flex size-9",
                        "shrink-0",
                        "items-center",
                        "justify-center",
                        "rounded-[11px]",
                        "border border-border",
                        "bg-surface-elevated",
                        "text-text-muted",
                      )}
                    >
                      <Clock3
                        size={15}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full",
                            "border px-2 py-1",
                            "text-[9px]",
                            "font-semibold",
                            getProfileClasses(
                              item.perfilFinanceiro,
                            ),
                          )}
                        >
                          {
                            item.perfilFinanceiro
                          }
                        </span>

                        <time
                          dateTime={
                            item.dataAnalise
                          }
                          className="text-[10px] text-text-subtle"
                        >
                          {dateFormatter.format(
                            parseLocalDate(
                              item.dataAnalise,
                            ),
                          )}
                        </time>
                      </div>

                      <p className="mt-2 text-xs text-text-muted">
                        Endividamento:{" "}
                        <strong className="text-text">
                          {percentageFormatter.format(
                            item.nivelEndividamento,
                          )}
                          %
                        </strong>
                        {" · "}
                        Poupança:{" "}
                        <strong className="text-text">
                          {
                            item.frequenciaPoupanca
                          }
                        </strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={
                      deletingAnalysisId ===
                      item.id
                    }
                    onClick={() => {
                      void handleDeleteAnalysis(
                        item.id,
                      );
                    }}
                    className={cn(
                      "inline-flex h-9",
                      "items-center",
                      "justify-center gap-2",
                      "rounded-[10px]",
                      "border border-danger/20",
                      "bg-danger/5 px-3",
                      "text-[10px]",
                      "font-semibold",
                      "text-danger",
                      "hover:bg-danger/10",
                      "disabled:opacity-50",
                    )}
                  >
                    {deletingAnalysisId ===
                    item.id ? (
                      <LoaderCircle
                        size={13}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2
                        size={13}
                      />
                    )}

                    Excluir
                  </button>
                </article>
              ),
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[180px]",
              "items-center",
              "justify-center",
              "px-6 text-center",
            )}
          >
            <p className="text-xs text-text-muted">
              Nenhuma análise foi gerada
              até o momento.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AnalysisPage;