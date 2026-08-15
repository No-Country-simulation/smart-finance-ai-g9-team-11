import {
  useState,
} from "react";

import {
  LoaderCircle,
  Trash2,
  TriangleAlert,
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
  DeleteTransactionModalProps,
} from "./DeleteTransactionModal.types";

export function DeleteTransactionModal({
  isOpen,
  transaction,
  onClose,
  onDeleted,
}: Readonly<DeleteTransactionModalProps>) {
  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const handleDelete =
    async (): Promise<void> => {
      if (
        !transaction ||
        isDeleting
      ) {
        return;
      }

      setIsDeleting(true);
      setError(null);

      try {
        await transactionService.remove(
          transaction.id,
        );

        await onDeleted?.();

        onClose();
      }
      catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Não foi possível excluir a transação.",
          ),
        );
      }
      finally {
        setIsDeleting(false);
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
        "bg-black/60 px-4",
        "backdrop-blur-sm",
      )}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-transaction-title"
        className={cn(
          "w-full max-w-md",
          "rounded-[22px]",
          "border border-danger/20",
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
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10",
                "items-center justify-center",
                "rounded-[13px]",
                "border border-danger/20",
                "bg-danger/10",
                "text-danger",
              )}
            >
              <TriangleAlert
                size={18}
              />
            </div>

            <div>
              <h2
                id="delete-transaction-title"
                className="text-base font-bold text-text"
              >
                Excluir transação
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Essa operação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              isDeleting
            }
            className="text-text-muted"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="px-5 py-6">
          <p className="text-sm text-text">
            Deseja excluir{" "}
            <strong>
              {transaction.descricao}
            </strong>
            ?
          </p>

          {error && (
            <div
              className={cn(
                "mt-4 rounded-[12px]",
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
            "flex justify-end gap-3",
            "border-t border-border",
            "px-5 py-4",
          )}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={
              isDeleting
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
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            disabled={
              isDeleting
            }
            className={cn(
              "inline-flex h-10",
              "items-center justify-center",
              "gap-2 rounded-[11px]",
              "bg-danger px-4",
              "text-xs font-semibold",
              "text-white",
              "disabled:opacity-60",
            )}
          >
            {isDeleting ? (
              <>
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />

                Excluindo...
              </>
            ) : (
              <>
                <Trash2
                  size={15}
                />

                Excluir
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}