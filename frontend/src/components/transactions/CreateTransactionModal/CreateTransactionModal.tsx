import {
  useEffect,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

import {
  getApiErrorMessage,
} from "@/services/api";

import {
  transactionService,
} from "@/services/transaction.service";

import {
  cn,
} from "@/lib/utils";

import type {
  CreateTransactionRequest,
  TransactionType,
} from "@/types/transaction";

import type {
  CreateTransactionModalProps,
} from "./CreateTransactionModal.types";

const getCurrentDate = (): string => {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    now.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const INITIAL_FORM: CreateTransactionRequest = {
  descricao: "",
  valor: 0,
  tipo: "Despesa",
  data: getCurrentDate(),
};

export function CreateTransactionModal({
  isOpen,
  onClose,
  onCreated,
}: Readonly<CreateTransactionModalProps>) {
  const [
    form,
    setForm,
  ] = useState<CreateTransactionRequest>(
    INITIAL_FORM,
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm({
      ...INITIAL_FORM,
      data: getCurrentDate(),
    });

    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  const handleTypeChange = (
    type: TransactionType,
  ): void => {
    setForm((current) => ({
      ...current,
      tipo: type,
    }));
  };

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const description =
      form.descricao.trim();

    if (!description) {
      setError(
        "Informe a descrição da transação.",
      );

      return;
    }

    if (
      !Number.isFinite(form.valor) ||
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
      const transaction =
        await transactionService.create({
          descricao: description,
          valor: form.valor,
          tipo: form.tipo,
          data: form.data,
        });

      await onCreated?.(
        transaction,
      );

      onClose();
    }
    catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível registrar a transação.",
        ),
      );
    }
    finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
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
      role="presentation"
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
        aria-labelledby="create-transaction-title"
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
            "flex items-start",
            "justify-between gap-4",
            "border-b border-border",
            "px-5 py-5",
            "sm:px-6",
          )}
        >
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0",
                "items-center justify-center",
                "rounded-[13px]",
                "border border-primary/20",
                "bg-primary/10",
                "text-primary-bright",
              )}
            >
              <Plus
                size={19}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="create-transaction-title"
                className="text-base font-bold text-text"
              >
                Nova transação
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Registre uma receita ou despesa.
                A categoria será identificada
                automaticamente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar"
            className={cn(
              "flex size-9 shrink-0",
              "items-center justify-center",
              "rounded-[11px]",
              "text-text-muted",
              "transition-colors",
              "hover:bg-surface-elevated",
              "hover:text-text",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
            )}
          >
            <X
              size={18}
              aria-hidden="true"
            />
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
                htmlFor="transaction-description"
                className="text-xs font-semibold text-text"
              >
                Descrição
              </label>

              <input
                id="transaction-description"
                type="text"
                value={
                  form.descricao
                }
                disabled={
                  isSubmitting
                }
                autoFocus
                placeholder="Ex.: Supermercado"
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
                  "transition-colors",
                  "placeholder:text-text-subtle",
                  "focus:border-primary/60",
                  "focus:ring-2",
                  "focus:ring-primary/10",
                  "disabled:opacity-60",
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
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    handleTypeChange(
                      "Receita",
                    )
                  }
                  className={cn(
                    "flex h-11",
                    "items-center justify-center",
                    "gap-2 rounded-[12px]",
                    "border text-xs",
                    "font-semibold",
                    "transition-colors",
                    form.tipo ===
                      "Receita"
                      ? [
                          "border-success/40",
                          "bg-success/10",
                          "text-success",
                        ]
                      : [
                          "border-border",
                          "bg-background",
                          "text-text-muted",
                          "hover:bg-surface-elevated",
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
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    handleTypeChange(
                      "Despesa",
                    )
                  }
                  className={cn(
                    "flex h-11",
                    "items-center justify-center",
                    "gap-2 rounded-[12px]",
                    "border text-xs",
                    "font-semibold",
                    "transition-colors",
                    form.tipo ===
                      "Despesa"
                      ? [
                          "border-danger/40",
                          "bg-danger/10",
                          "text-danger",
                        ]
                      : [
                          "border-border",
                          "bg-background",
                          "text-text-muted",
                          "hover:bg-surface-elevated",
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
                  htmlFor="transaction-value"
                  className="text-xs font-semibold text-text"
                >
                  Valor
                </label>

                <input
                  id="transaction-value"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  disabled={
                    isSubmitting
                  }
                  value={
                    form.valor === 0
                      ? ""
                      : form.valor
                  }
                  placeholder="0,00"
                  onChange={(
                    event,
                  ) => {
                    const value =
                      event.target
                        .value;

                    setForm(
                      (current) => ({
                        ...current,
                        valor:
                          value === ""
                            ? 0
                            : Number(
                                value,
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
                    "transition-colors",
                    "placeholder:text-text-subtle",
                    "focus:border-primary/60",
                    "focus:ring-2",
                    "focus:ring-primary/10",
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="transaction-date"
                  className="text-xs font-semibold text-text"
                >
                  Data
                </label>

                <input
                  id="transaction-date"
                  type="date"
                  value={form.data}
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
                    "transition-colors",
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
                  "text-xs leading-5",
                  "text-danger",
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
                "transition-colors",
                "hover:bg-surface-elevated",
                "hover:text-text",
                "disabled:opacity-50",
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
                "transition-opacity",
                "hover:opacity-90",
                "disabled:cursor-not-allowed",
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
                  <Plus
                    size={15}
                  />

                  Adicionar transação
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}