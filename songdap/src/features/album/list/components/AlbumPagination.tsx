// components/AlbumPagination.tsx
interface AlbumPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export function AlbumPagination({ page, totalPages, setPage }: AlbumPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3 pb-10">
      <button
        type="button"
        className="rounded border border-black/20 bg-white px-3 py-1 text-sm hover:opacity-70 disabled:opacity-40"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        이전
      </button>
      <span className="text-sm text-black/70">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className="rounded border border-black/20 bg-white px-3 py-1 text-sm hover:opacity-70 disabled:opacity-40"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        다음
      </button>
    </nav>
  );
}