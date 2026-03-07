function Pagination({ page, totalPages, setPage }) {

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (

    <div className="flex items-center justify-center sm:justify-end gap-3 text-sm">

      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
      >
        Prev
      </button>

      <span className="font-medium text-gray-700">
        {page} / {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
      >
        Next
      </button>

    </div>

  );
}

export default Pagination;