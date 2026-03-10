"use client";

export default function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: {
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (p: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm text-gray-600">Total {total}</span>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value={10}>10/page</option>
          <option value={20}>20/page</option>
          <option value={50}>50/page</option>
        </select>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onPageChange?.(page - 1)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="rounded bg-blue-500 px-2 py-1 text-sm text-white">{page}</span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onPageChange?.(page + 1)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
        <span className="text-sm text-gray-500">Go to</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          defaultValue={page}
          className="w-12 rounded border border-gray-300 px-1 py-1 text-center text-sm"
        />
      </div>
    </div>
  );
}
