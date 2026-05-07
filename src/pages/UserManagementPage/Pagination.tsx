interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹ Trước
      </button>

      <div className="pagination__pages">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="pagination__dots">…</span>
          ) : (
            <button
              key={p}
              className={`pagination__page ${p === currentPage ? 'pagination__page--active' : ''}`}
              onClick={() => onChange(p as number)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="pagination__btn"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Tiếp ›
      </button>
    </div>
  );
}
