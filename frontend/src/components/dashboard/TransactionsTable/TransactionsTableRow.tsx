import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CarFront,
  CircleDollarSign,
  CreditCard,
  Dumbbell,
  HeartPulse,
  Home,
  ReceiptText,
  ShoppingBasket,
  Utensils,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { TransactionsTableRowProps } from "./TransactionsTable.types";

interface CategoryVisual {
  icon: LucideIcon;
  iconContainerClassName: string;
  iconClassName: string;
}

const currencyFormatter = new Intl.NumberFormat(
  "pt-BR",
  {
    style: "currency",
    currency: "BRL",
  },
);

const dateFormatter = new Intl.DateTimeFormat(
  "pt-BR",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
);

const categoryVisuals: Record<
  string,
  CategoryVisual
> = {
  receita: {
    icon: CircleDollarSign,
    iconContainerClassName:
      "border-success/20 bg-success/10",
    iconClassName: "text-success",
  },

  alimentação: {
    icon: ShoppingBasket,
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    iconClassName: "text-warning",
  },

  assinatura: {
    icon: CreditCard,
    iconContainerClassName:
      "border-primary/20 bg-primary/10",
    iconClassName: "text-primary-bright",
  },

  transporte: {
    icon: CarFront,
    iconContainerClassName:
      "border-info/20 bg-info/10",
    iconClassName: "text-info",
  },

  moradia: {
    icon: Home,
    iconContainerClassName:
      "border-secondary/20 bg-secondary/10",
    iconClassName: "text-secondary-bright",
  },

  saúde: {
    icon: HeartPulse,
    iconContainerClassName:
      "border-danger/20 bg-danger/10",
    iconClassName: "text-danger",
  },

  academia: {
    icon: Dumbbell,
    iconContainerClassName:
      "border-primary/20 bg-primary/10",
    iconClassName: "text-primary-bright",
  },

  restaurante: {
    icon: Utensils,
    iconContainerClassName:
      "border-warning/20 bg-warning/10",
    iconClassName: "text-warning",
  },
};

const fallbackCategoryVisual: CategoryVisual = {
  icon: ReceiptText,
  iconContainerClassName:
    "border-border bg-surface-muted",
  iconClassName: "text-text-muted",
};

function normalizeCategory(
  category: string,
): string {
  return category
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

function getCategoryVisual(
  category: string,
): CategoryVisual {
  const normalizedCategory =
    normalizeCategory(category);

  const matchingEntry = Object.entries(
    categoryVisuals,
  ).find(([key]) =>
    normalizedCategory.includes(
      normalizeCategory(key),
    ),
  );

  return (
    matchingEntry?.[1] ??
    fallbackCategoryVisual
  );
}

function parseLocalDate(
  date: string,
): Date {
  return new Date(`${date}T00:00:00`);
}

export function TransactionsTableRow({
  transaction,
}: Readonly<TransactionsTableRowProps>) {
  const isIncome =
    transaction.type === "income";

  const isCompleted =
    transaction.status === "completed";

  const categoryVisual =
    getCategoryVisual(transaction.category);

  const CategoryIcon =
    categoryVisual.icon;

  const formattedAmount =
    currencyFormatter.format(
      Math.abs(transaction.amount),
    );

  return (
    <tr
      className={cn(
        "group transition-colors duration-150",
        "hover:bg-surface-elevated/55",
      )}
    >
      <td className="px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0",
              "items-center justify-center",
              "rounded-[11px] border",
              categoryVisual.iconContainerClassName,
              categoryVisual.iconClassName,
            )}
            aria-hidden="true"
          >
            <CategoryIcon size={16} />
          </div>

          <span className="truncate text-xs font-semibold text-text">
            {transaction.category}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text">
            {transaction.description}
          </p>

          <p className="mt-1 text-[10px] text-text-subtle">
            ID #{transaction.id}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <time
          dateTime={transaction.date}
          className="whitespace-nowrap text-xs text-text-muted"
        >
          {dateFormatter.format(
            parseLocalDate(transaction.date),
          )}
        </time>
      </td>

      <td className="px-5 py-4 text-right">
        <span
          className={cn(
            "inline-flex items-center",
            "justify-end gap-1",
            "whitespace-nowrap text-xs",
            "font-semibold tabular-nums",
            isIncome
              ? "text-success"
              : "text-danger",
          )}
        >
          {isIncome ? "+" : "−"}

          {formattedAmount}
        </span>
      </td>

      <td className="px-5 py-4 text-right">
        <span
          className={cn(
            "inline-flex items-center gap-1.5",
            "rounded-full border",
            "px-2.5 py-1",
            "text-[10px] font-semibold",
            isCompleted
              ? [
                  "border-success/20",
                  "bg-success/10",
                  "text-success",
                ]
              : [
                  "border-warning/20",
                  "bg-warning/10",
                  "text-warning",
                ],
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isCompleted
                ? "bg-success"
                : "bg-warning",
            )}
            aria-hidden="true"
          />

          {isCompleted
            ? "Concluída"
            : "Pendente"}
        </span>
      </td>
    </tr>
  );
}