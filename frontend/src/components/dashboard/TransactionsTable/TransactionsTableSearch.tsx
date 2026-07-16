import { Search } from "lucide-react";

import type { TransactionsTableSearchProps } from "./TransactionsTable.types";

export function TransactionsTableSearch({
  value,
  onChange,
}: TransactionsTableSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pesquisar transações..."
        className="
          h-10
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-10
          pr-4
          text-sm
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </div>
  );
}