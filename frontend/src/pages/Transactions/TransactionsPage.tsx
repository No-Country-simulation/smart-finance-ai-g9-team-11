import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  LoaderCircle,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";
import { DeleteTransactionModal } from "@/components/transactions/DeleteTransactionModal";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";

import { cn } from "@/lib/utils";

import {
  getApiErrorMessage,
} from "@/services/api";

import {
  transactionService,
} from "@/services/transaction.service";

import type {
  Transaction,
  TransactionFilters,
} from "@/types/transaction";

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dateFormatter =
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function parseLocalDate(
  date: string,
): Date {
  return new Date(
    `${date}T00:00:00`,
  );
}

function isTransactionEditable(
  transaction: Transaction,
): boolean {
  const transactionDate =
    parseLocalDate(
      transaction.data,
    );

  const editableLimit =
    new Date();

  editableLimit.setHours(
    0,
    0,
    0,
    0,
  );

  editableLimit.setDate(
    editableLimit.getDate() - 30,
  );

  return (
    transactionDate >=
    editableLimit
  );
}

function TransactionsPage() {
  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    initialDate,
    setInitialDate,
  ] = useState("");

  const [
    finalDate,
    setFinalDate,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [
    transactionToEdit,
    setTransactionToEdit,
  ] = useState<Transaction | null>(
    null,
  );

  const [
    transactionToDelete,
    setTransactionToDelete,
  ] = useState<Transaction | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const loadTransactions =
    useCallback(
      async (
        filters?: TransactionFilters,
      ): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
          const response =
            await transactionService.findAll(
              filters,
            );

          setTransactions(response);
        }
        catch (requestError) {
          setError(
            getApiErrorMessage(
              requestError,
              "Não foi possível carregar as transações.",
            ),
          );
        }
        finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const activeFilters =
    useMemo<TransactionFilters | undefined>(
      () => {
        if (
          initialDate &&
          finalDate
        ) {
          return {
            dataInicial:
              initialDate,
            dataFinal:
              finalDate,
          };
        }

        return undefined;
      },
      [
        initialDate,
        finalDate,
      ],
    );

  const filteredTransactions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            "pt-BR",
          );

      if (!normalizedSearch) {
        return transactions;
      }

      return transactions.filter(
        (transaction) => {
          const searchableContent =
            [
              transaction.descricao,
              transaction.categoria,
              transaction.tipo,
            ]
              .join(" ")
              .toLocaleLowerCase(
                "pt-BR",
              );

          return searchableContent.includes(
            normalizedSearch,
          );
        },
      );
    }, [
      search,
      transactions,
    ]);

  const handleApplyPeriod =
    async (): Promise<void> => {
      if (
        !initialDate ||
        !finalDate
      ) {
        setError(
          "Informe a data inicial e a data final.",
        );

        return;
      }

      if (
        initialDate > finalDate
      ) {
        setError(
          "A data inicial não pode ser posterior à data final.",
        );

        return;
      }

      await loadTransactions({
        dataInicial:
          initialDate,
        dataFinal:
          finalDate,
      });
    };

  const handleClearFilters =
    async (): Promise<void> => {
      setInitialDate("");
      setFinalDate("");
      setSearch("");

      await loadTransactions();
    };

  const handleRefresh =
    async (): Promise<void> => {
      await loadTransactions(
        activeFilters,
      );
    };

  const handleCreated =
    async (): Promise<void> => {
      await loadTransactions(
        activeFilters,
      );
    };

  const handleUpdated =
    async (): Promise<void> => {
      await loadTransactions(
        activeFilters,
      );
    };

  const handleDeleted =
    async (): Promise<void> => {
      await loadTransactions(
        activeFilters,
      );
    };

  return (
    <>
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
            "lg:items-center",
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
              Movimentações
            </p>

            <h1
              className={cn(
                "mt-2 text-2xl",
                "font-bold tracking-tight",
                "text-text",
                "sm:text-3xl",
              )}
            >
              Transações
            </h1>

            <p
              className={cn(
                "mt-2 max-w-2xl",
                "text-sm leading-6",
                "text-text-muted",
              )}
            >
              Consulte, registre, edite e
              acompanhe suas receitas e
              despesas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCreateModalOpen(
                true,
              );
            }}
            className={cn(
              "inline-flex h-11",
              "items-center justify-center",
              "gap-2 rounded-[12px]",
              "bg-primary px-4",
              "text-xs font-semibold",
              "text-white",
              "transition-opacity",
              "hover:opacity-90",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/40",
            )}
          >
            <Plus
              size={16}
              aria-hidden="true"
            />

            Nova transação
          </button>
        </header>

        <section
          className={cn(
            "rounded-[20px]",
            "border border-border",
            "bg-card p-4",
            "sm:p-5",
          )}
          aria-label="Filtros de transações"
        >
          <div
            className={cn(
              "grid grid-cols-1",
              "gap-4",
              "xl:grid-cols-[minmax(240px,1fr)_180px_180px_auto]",
              "xl:items-end",
            )}
          >
            <div>
              <label
                htmlFor="transactions-page-search"
                className="text-xs font-semibold text-text"
              >
                Pesquisar
              </label>

              <div className="relative mt-2">
                <Search
                  size={16}
                  className={cn(
                    "pointer-events-none",
                    "absolute left-3",
                    "top-1/2",
                    "-translate-y-1/2",
                    "text-text-subtle",
                  )}
                  aria-hidden="true"
                />

                <input
                  id="transactions-page-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value,
                    );
                  }}
                  placeholder="Descrição, categoria ou tipo..."
                  className={cn(
                    "h-11 w-full",
                    "rounded-[12px]",
                    "border border-border",
                    "bg-background",
                    "pl-10 pr-10",
                    "text-sm text-text",
                    "outline-none",
                    "placeholder:text-text-subtle",
                    "focus:border-primary/60",
                    "focus:ring-2",
                    "focus:ring-primary/10",
                  )}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                    }}
                    aria-label="Limpar pesquisa"
                    className={cn(
                      "absolute right-2",
                      "top-1/2",
                      "flex size-7",
                      "-translate-y-1/2",
                      "items-center",
                      "justify-center",
                      "rounded-lg",
                      "text-text-subtle",
                      "hover:bg-surface-elevated",
                      "hover:text-text",
                    )}
                  >
                    <X
                      size={14}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="initial-date"
                className="text-xs font-semibold text-text"
              >
                Data inicial
              </label>

              <input
                id="initial-date"
                type="date"
                value={initialDate}
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
                htmlFor="final-date"
                className="text-xs font-semibold text-text"
              >
                Data final
              </label>

              <input
                id="final-date"
                type="date"
                value={finalDate}
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

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  void handleApplyPeriod();
                }}
                className={cn(
                  "inline-flex h-11",
                  "items-center",
                  "justify-center gap-2",
                  "rounded-[12px]",
                  "border border-primary/25",
                  "bg-primary/10 px-4",
                  "text-xs font-semibold",
                  "text-primary-bright",
                  "hover:bg-primary/15",
                  "disabled:opacity-50",
                )}
              >
                <CalendarDays
                  size={15}
                  aria-hidden="true"
                />

                Filtrar
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  void handleClearFilters();
                }}
                aria-label="Limpar filtros"
                title="Limpar filtros"
                className={cn(
                  "flex size-11",
                  "items-center",
                  "justify-center",
                  "rounded-[12px]",
                  "border border-border",
                  "text-text-muted",
                  "hover:bg-surface-elevated",
                  "hover:text-text",
                  "disabled:opacity-50",
                )}
              >
                <X
                  size={16}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className={cn(
              "flex items-center",
              "justify-between gap-4",
              "rounded-[16px]",
              "border border-danger/20",
              "bg-danger/5",
              "px-4 py-3",
            )}
          >
            <p
              className={cn(
                "text-xs leading-5",
                "text-danger",
              )}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              className={cn(
                "inline-flex",
                "shrink-0",
                "items-center gap-2",
                "text-xs font-semibold",
                "text-danger",
              )}
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
              />

              Tentar novamente
            </button>
          </div>
        )}

        <section
          className={cn(
            "min-w-0",
            "overflow-hidden",
            "rounded-[20px]",
            "border border-border",
            "bg-card",
          )}
          aria-labelledby="transactions-list-title"
        >
          <header
            className={cn(
              "flex items-center",
              "justify-between",
              "gap-4 px-5 py-5",
              "border-b border-border",
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
                <ReceiptText
                  size={18}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2
                  id="transactions-list-title"
                  className="text-sm font-semibold text-text"
                >
                  Histórico de transações
                </h2>

                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    "text-text-subtle",
                  )}
                >
                  {
                    filteredTransactions.length
                  }{" "}
                  {filteredTransactions.length ===
                  1
                    ? "movimentação"
                    : "movimentações"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                void handleRefresh();
              }}
              aria-label="Atualizar transações"
              title="Atualizar"
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
                size={16}
                className={cn(
                  isLoading &&
                    "animate-spin",
                )}
                aria-hidden="true"
              />
            </button>
          </header>

          {isLoading ? (
            <div
              className={cn(
                "flex min-h-[320px]",
                "flex-col",
                "items-center",
                "justify-center",
                "gap-3",
              )}
            >
              <LoaderCircle
                size={24}
                className={cn(
                  "animate-spin",
                  "text-primary-bright",
                )}
                aria-hidden="true"
              />

              <p className="text-xs text-text-muted">
                Carregando transações...
              </p>
            </div>
          ) : filteredTransactions.length ===
            0 ? (
            <div
              className={cn(
                "flex min-h-[320px]",
                "flex-col",
                "items-center",
                "justify-center",
                "px-6 text-center",
              )}
            >
              <div
                className={cn(
                  "flex size-12",
                  "items-center",
                  "justify-center",
                  "rounded-[15px]",
                  "border border-border",
                  "bg-surface-muted",
                  "text-text-muted",
                )}
              >
                <ReceiptText
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <p
                className={cn(
                  "mt-4 text-sm",
                  "font-semibold",
                  "text-text",
                )}
              >
                Nenhuma transação encontrada
              </p>

              <p
                className={cn(
                  "mt-1 max-w-sm",
                  "text-xs leading-5",
                  "text-text-muted",
                )}
              >
                Registre uma nova movimentação ou altere os filtros utilizados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className={cn(
                  "w-full",
                  "min-w-[980px]",
                  "border-collapse",
                )}
              >
                <thead
                  className={cn(
                    "bg-surface-elevated/80",
                    "text-left",
                  )}
                >
                  <tr>
                    {[
                      "Descrição",
                      "Categoria",
                      "Tipo",
                      "Data",
                      "Valor",
                      "Ações",
                    ].map(
                      (column) => (
                        <th
                          key={column}
                          className={cn(
                            "px-5 py-3.5",
                            "text-[10px]",
                            "font-semibold",
                            "uppercase",
                            "tracking-[0.09em]",
                            "text-text-subtle",
                            (
                              column ===
                                "Valor" ||
                              column ===
                                "Ações"
                            ) &&
                              "text-right",
                          )}
                        >
                          {column}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-muted">
                  {filteredTransactions.map(
                    (transaction) => {
                      const isIncome =
                        transaction.tipo ===
                        "Receita";

                      const canEdit =
                        isTransactionEditable(
                          transaction,
                        );

                      return (
                        <tr
                          key={
                            transaction.id
                          }
                          className={cn(
                            "transition-colors",
                            "hover:bg-surface-elevated/55",
                          )}
                        >
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-xs font-semibold text-text">
                                {
                                  transaction.descricao
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-text-subtle">
                                ID #
                                {
                                  transaction.id
                                }
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex",
                                "rounded-full",
                                "border border-border",
                                "bg-surface-muted",
                                "px-2.5 py-1",
                                "text-[10px]",
                                "font-semibold",
                                "text-text-muted",
                              )}
                            >
                              {
                                transaction.categoria
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex",
                                "items-center",
                                "gap-1.5",
                                "text-xs",
                                "font-semibold",
                                isIncome
                                  ? "text-success"
                                  : "text-danger",
                              )}
                            >
                              {isIncome ? (
                                <ArrowUpRight
                                  size={14}
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowDownRight
                                  size={14}
                                  aria-hidden="true"
                                />
                              )}

                              {
                                transaction.tipo
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <time
                              dateTime={
                                transaction.data
                              }
                              className="whitespace-nowrap text-xs text-text-muted"
                            >
                              {dateFormatter.format(
                                parseLocalDate(
                                  transaction.data,
                                ),
                              )}
                            </time>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span
                              className={cn(
                                "whitespace-nowrap",
                                "text-xs",
                                "font-semibold",
                                "tabular-nums",
                                isIncome
                                  ? "text-success"
                                  : "text-danger",
                              )}
                            >
                              {isIncome
                                ? "+"
                                : "−"}
                              {currencyFormatter.format(
                                Math.abs(
                                  transaction.valor,
                                ),
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            {canEdit ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTransactionToEdit(
                                      transaction,
                                    );
                                  }}
                                  aria-label={`Editar ${transaction.descricao}`}
                                  title="Editar"
                                  className={cn(
                                    "flex size-8",
                                    "items-center justify-center",
                                    "rounded-[10px]",
                                    "border border-border",
                                    "text-text-muted",
                                    "transition-colors",
                                    "hover:border-primary/30",
                                    "hover:bg-primary/10",
                                    "hover:text-primary-bright",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-2",
                                    "focus-visible:ring-primary/40",
                                  )}
                                >
                                  <Pencil
                                    size={14}
                                    aria-hidden="true"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTransactionToDelete(
                                      transaction,
                                    );
                                  }}
                                  aria-label={`Excluir ${transaction.descricao}`}
                                  title="Excluir"
                                  className={cn(
                                    "flex size-8",
                                    "items-center justify-center",
                                    "rounded-[10px]",
                                    "border border-border",
                                    "text-text-muted",
                                    "transition-colors",
                                    "hover:border-danger/30",
                                    "hover:bg-danger/10",
                                    "hover:text-danger",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-2",
                                    "focus-visible:ring-danger/40",
                                  )}
                                >
                                  <Trash2
                                    size={14}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-text-subtle">
                                Bloqueada após 30 dias
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(
            false,
          );
        }}
        onCreated={
          handleCreated
        }
      />

      <EditTransactionModal
        isOpen={
          transactionToEdit !== null
        }
        transaction={
          transactionToEdit
        }
        onClose={() => {
          setTransactionToEdit(
            null,
          );
        }}
        onUpdated={
          handleUpdated
        }
      />

      <DeleteTransactionModal
        isOpen={
          transactionToDelete !== null
        }
        transaction={
          transactionToDelete
        }
        onClose={() => {
          setTransactionToDelete(
            null,
          );
        }}
        onDeleted={
          handleDeleted
        }
      />
    </>
  );
}

export default TransactionsPage;