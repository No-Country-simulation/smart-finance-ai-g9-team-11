export function TransactionsTableHeader() {
  const columns = [
    "Categoria",
    "Descrição",
    "Data",
    "Valor",
    "Status",
  ];

  return (
    <thead className="border-b border-slate-200 bg-slate-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column}
            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}