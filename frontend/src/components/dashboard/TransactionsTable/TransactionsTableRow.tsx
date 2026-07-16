import type { Transaction } from "@/types/dashboard";

interface TransactionsTableRowProps {
  transaction: Transaction;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

export function TransactionsTableRow({
  transaction,
}: TransactionsTableRowProps) {
  const isIncome = transaction.type === "income";

  return (
    <tr className="transition-colors hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {transaction.category.charAt(0)}
          </div>

          <span className="font-medium text-slate-700">
            {transaction.category}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-slate-600">
        {transaction.description}
      </td>

      <td className="px-6 py-4 text-slate-500">
        {dateFormatter.format(new Date(transaction.date))}
      </td>

      <td
        className={`px-6 py-4 font-semibold ${
          isIncome ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {currencyFormatter.format(transaction.amount)}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            transaction.status === "completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {transaction.status === "completed"
            ? "Concluída"
            : "Pendente"}
        </span>
      </td>
    </tr>
  );
}