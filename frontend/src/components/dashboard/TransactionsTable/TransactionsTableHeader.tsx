import { cn } from "@/lib/utils";

interface TransactionColumn {
  label: string;
  className?: string;
}

const columns: readonly TransactionColumn[] = [
  {
    label: "Categoria",
    className: "min-w-[180px]",
  },
  {
    label: "Descrição",
    className: "min-w-[210px]",
  },
  {
    label: "Data",
    className: "min-w-[125px]",
  },
  {
    label: "Valor",
    className: "min-w-[145px] text-right",
  },
  {
    label: "Status",
    className: "min-w-[130px] text-right",
  },
];

export function TransactionsTableHeader() {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10",
        "border-y border-border-muted",
        "bg-surface-elevated/95",
        "backdrop-blur-md",
      )}
    >
      <tr>
        {columns.map((column) => (
          <th
            key={column.label}
            scope="col"
            className={cn(
              "px-5 py-3.5",
              "text-left text-[10px]",
              "font-semibold uppercase",
              "tracking-[0.09em]",
              "text-text-subtle",
              column.className,
            )}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}