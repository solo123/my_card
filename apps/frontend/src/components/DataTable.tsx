"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";

export type Column<T> = {
  key: string;
  label: string;
  /** 是否粘在第一列（如卡号） */
  stickyLeft?: boolean;
  /** 是否粘在最后一列（如操作按钮） */
  stickyRight?: boolean;
  render?: (row: T) => React.ReactNode;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    getCellContent?: (row: TData, key: string) => React.ReactNode;
  }
}

function buildColumnDefs<T extends Record<string, unknown>>(
  columns: Column<T>[]
): ColumnDef<T, unknown>[] {
  return columns.map((col) => ({
    id: col.key,
    accessorKey: col.key,
    header: col.label,
    cell: ({ row }) =>
      col.render ? col.render(row.original as T) : String(row.getValue(col.key) ?? ""),
    meta: {
      stickyLeft: col.stickyLeft,
      stickyRight: col.stickyRight,
    },
  }));
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyText = "暂无数据",
  stickyFirstColumn,
  stickyLastColumn,
}: {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  /** 首列是否粘性（卡号等） */
  stickyFirstColumn?: boolean;
  /** 末列是否粘性（操作按钮） */
  stickyLastColumn?: boolean;
}) {
  const columnDefs = buildColumnDefs(columns);
  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-12 w-12 text-primary/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  const getStickyClass = (columnIndex: number) => {
    const col = columns[columnIndex];
    if (col?.stickyRight ?? (stickyLastColumn && columnIndex === columns.length - 1))
      return "sticky right-0 z-10 bg-white shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]";
    if (col?.stickyLeft ?? (stickyFirstColumn && columnIndex === 0))
      return "sticky left-0 z-10 bg-white shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]";
    return "";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${getStickyClass(i)}`}
                >
                  {header.column.columnDef.header as React.ReactNode}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rowModel.rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={cell.id}
                  className={`whitespace-nowrap px-4 py-3 text-sm text-gray-700 ${getStickyClass(i)}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
