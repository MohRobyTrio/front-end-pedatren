const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 2) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage >= totalPages - 1) {
            startPage = totalPages - 4;
            endPage = totalPages;
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    return (
        <nav aria-label="Page navigation" className="flex justify-end mt-6">
            <ul className="flex items-center -space-x-px h-10 text-sm">
                {/* Tombol Previous */}
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 
                            ${currentPage === 1 ? "opacity-50 cursor-not-allowed text-gray-500" : "bg-white text-gray-500"}`}
                    >
                        {/* <span className="sr-only">Previous</span> */}
                        <svg className="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                        </svg>
                    </button>
                </li>

                {/* Nomor Halaman */}
                {getPageNumbers().map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => handlePageChange(page)}
                            className={`flex items-center justify-center px-4 h-10 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                                ${currentPage === page
                                    ? "z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                                    : "text-gray-500 bg-white"}`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Tombol Next */}
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center px-4 h-10 border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 
                            ${currentPage === totalPages ? "opacity-50 cursor-not-allowed text-gray-500" : "bg-white text-gray-500"}`}
                    >
                        {/* <span className="sr-only">Next</span> */}
                        <svg className="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
