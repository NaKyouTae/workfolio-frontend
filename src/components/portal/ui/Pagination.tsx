'use client';

import React, { useState } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 30, 50, 100],
}) => {
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 10; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 9; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.itemsPerPageContainer}>
        <button
          className={styles.itemsPerPageButton}
          onClick={() => setShowItemsPerPage(!showItemsPerPage)}
        >
          {itemsPerPage}개
        </button>
        {showItemsPerPage && (
          <div className={styles.itemsPerPageDropdown}>
            {itemsPerPageOptions.map((option) => (
              <button
                key={option}
                className={`${styles.itemsPerPageOption} ${itemsPerPage === option ? styles.active : ''}`}
                onClick={() => {
                  onItemsPerPageChange(option);
                  setShowItemsPerPage(false);
                }}
              >
                {option}개
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.navButton}
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </button>
        <button
          className={styles.navButton}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          );
        })}
        
        <button
          className={styles.navButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
        <button
          className={styles.navButton}
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;

