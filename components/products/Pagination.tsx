interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages: number[] = [];

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">
          {total}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="pageSize"
          className="text-sm text-gray-600"
        >
          Rows:
        </label>

        <select
          id="pageSize"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
              pageNumber === page
                ? "bg-blue-600 text-white"
                : "border text-gray-700 hover:bg-gray-50"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}