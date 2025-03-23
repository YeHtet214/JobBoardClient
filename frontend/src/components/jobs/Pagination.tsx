import React from 'react';
import { useJobsContext } from '../../contexts/JobsContext';

const Pagination: React.FC = () => {
  const { currentPage, totalPages, handlePageChange } = useJobsContext();

  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md ${currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-jobboard-darkblue hover:bg-jobboard-light'
            }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-2 rounded-md ${currentPage === index + 1
                ? 'bg-jobboard-purple text-white'
                : 'text-jobboard-darkblue hover:bg-jobboard-light'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md ${currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-jobboard-darkblue hover:bg-jobboard-light'
            }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
