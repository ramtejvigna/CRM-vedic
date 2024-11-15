import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  isDarkMode,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
      <div className="flex items-center">
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Showing {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} entries
        </span>
        <div className="ml-4">
          <select
            className={`ml-2 px-3 py-1 border rounded-md ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            }`}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {[ 5, 10, 15, 20, 25].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`flex items-center px-3 py-1 rounded-md transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800'
              : 'bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100'
          } border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          } disabled:opacity-50`}
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page - 1)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page - 1
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`flex items-center px-3 py-1 rounded-md transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800'
              : 'bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100'
          } border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          } disabled:opacity-50`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;