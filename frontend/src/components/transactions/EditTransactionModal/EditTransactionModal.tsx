import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Pencil,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  getApiErrorMessage,
} from "@/services/api";

import {
  transactionService,
} from "@/services/transaction.service";

import type {
  TransactionType,
  UpdateTransactionRequest,
} from "@/types/transaction";

import type {
  EditTransactionModalProps,
} from "./EditTransactionModal.types";

export function EditTransactionModal({
  isOpen,
  transaction,
  onClose,
  onUpdated,
}: Readonly<EditTransactionModalProps>) {
  const [
    form,
    setForm,
  ] = useState<UpdateTransactionRequest>({
    descricao: "",
    valor: 0,
    tipo: "Despesa",
    data: "",
  });

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isOpen ||
      !transaction
    ) {
      return;
    }

    setForm({
      descricao:
        transaction.descricao,
      valor:
        transaction.valor,
      tipo:
        transaction.tipo,
      data:
        transaction.data,
    });

    setError(null);
  }, [
    isOpen,
    transaction,
  ]);

  const handleTypeChange = (
    tipo: TransactionType,
  ): void => {
    setForm((current) => ({
      ...current,
      tipo,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      !transaction ||
      isSubmitting
    ) {
      return;
    }

    const descricao =
      form.descricao.trim();

    if (!descricao) {
      setError(
        "Informe a descrição da transação.",
      );

      return;
    }

    if (
      !Number.isFinite(
        form.valor,
      ) ||
      form.valor <= 0
    ) {
      setError(
        "Informe um valor maior que zero.",
      );

      return;
    }

    if (!form.data) {
      setError(
        "Informe a data da transação.",
      );

      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedTransaction =
        await transactionService.update(
          transaction.id,
          {
            descricao,
            valor:
              form.valor,
            tipo:
              form.tipo,
            data:
              form.data,
          },
        );

      await onUpdated?.(
        updatedTransaction,
      );

      onClose();
    }
    catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível atualizar a transação.",
        ),
      );
    }
    finally {
      setIsSubmitting(false);
    }
  };

  if (
    !isOpen ||
    !transaction
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/60 px-4 py-8",
        "backdrop-blur-sm",
      )}
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-transaction-title"
        className={cn(
          "w-full max-w-lg",
          "overflow-hidden",
          "rounded-[24px]",
          "border border-border",
          "bg-card",
          "shadow-2xl",
        )}
      >
        <header
          className={cn(
            "flex items-start justify-between",
            "gap-4 border-b border-border",
            "px-5 py-5 sm:px-6",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 items-center",
                "justify-center rounded-[13px]",
                "border border-primary/20",
                "bg-primary/10",
                "text-primary-bright",
              )}
            >
              <Pencil
                size={18}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="edit-transaction-title"
                className="text-base font-bold text-text"
              >
                Editar transação
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                A categoria será recalculada automaticamente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              isSubmitting
            }
            aria-label="Fechar"
            className={cn(
              "flex size-9 items-center",
              "justify-center rounded-[11px]",
              "text-text-muted",
              "hover:bg-surface-elevated",
              "hover:text-text",
            )}
          >
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={(event) => {
            void handleSubmit(
              event,
            );
          }}
        >
          <div className="space-y-5 px-5 py-6 sm:px-6">
            <div>
              <label
                htmlFor="edit-transaction-description"
                className="text-xs font-semibold text-text"
              >
                Descrição
              </label>

              <input
                id="edit-transaction-description"
                value={form.descricao}
                disabled={
                  isSubmitting
                }
                onChange={(
                  event,
                ) => {
                  setForm(
                    (current) => ({
                      ...current,
                      descricao:
                        event.target
                          .value,
                    }),
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
              <span className="text-xs font-semibold text-text">
                Tipo
              </span>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleTypeChange(
                      "Receita",
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className={cn(
                    "flex h-11 items-center",
                    "justify-center gap-2",
                    "rounded-[12px] border",
                    "text-xs font-semibold",
                    form.tipo ===
                      "Receita"
                      ? [
                          "border-success/40",
                          "bg-success/10",
                          "text-success",
                        ]
                      : [
                          "border-border",
                          "text-text-muted",
                        ],
                  )}
                >
                  <ArrowUpRight
                    size={16}
                  />

                  Receita
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleTypeChange(
                      "Despesa",
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className={cn(
                    "flex h-11 items-center",
                    "justify-center gap-2",
                    "rounded-[12px] border",
                    "text-xs font-semibold",
                    form.tipo ===
                      "Despesa"
                      ? [
                          "border-danger/40",
                          "bg-danger/10",
                          "text-danger",
                        ]
                      : [
                          "border-border",
                          "text-text-muted",
                        ],
                  )}
                >
                  <ArrowDownRight
                    size={16}
                  />

                  Despesa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-transaction-value"
                  className="text-xs font-semibold text-text"
                >
                  Valor
                </label>

                <input
                  id="edit-transaction-value"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.valor}
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event,
                  ) => {
                    setForm(
                      (current) => ({
                        ...current,
                        valor:
                          Number(
                            event.target
                              .value,
                          ),
                      }),
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
                  htmlFor="edit-transaction-date"
                  className="text-xs font-semibold text-text"
                >
                  Data
                </label>

                <input
                  id="edit-transaction-date"
                  type="date"
                  value={form.data}
                  max={
                    new Date()
                      .toISOString()
                      .slice(0, 10)
                  }
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event,
                  ) => {
                    setForm(
                      (current) => ({
                        ...current,
                        data:
                          event.target
                            .value,
                      }),
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
            </div>

            {error && (
              <div
                role="alert"
                className={cn(
                  "rounded-[12px]",
                  "border border-danger/20",
                  "bg-danger/5",
                  "px-4 py-3",
                  "text-xs text-danger",
                )}
              >
                {error}
              </div>
            )}
          </div>

          <footer
            className={cn(
              "flex flex-col-reverse",
              "gap-3 border-t",
              "border-border",
              "px-5 py-4",
              "sm:flex-row",
              "sm:justify-end",
              "sm:px-6",
            )}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={
                isSubmitting
              }
              className={cn(
                "h-10 rounded-[11px]",
                "border border-border",
                "px-4 text-xs",
                "font-semibold",
                "text-text-muted",
              )}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className={cn(
                "inline-flex h-10",
                "items-center justify-center",
                "gap-2 rounded-[11px]",
                "bg-primary px-5",
                "text-xs font-semibold",
                "text-white",
                "disabled:opacity-60",
              )}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Salvando...
                </>
              ) : (
                <>
                  <Pencil
                    size={15}
                  />

                  Salvar alterações
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}