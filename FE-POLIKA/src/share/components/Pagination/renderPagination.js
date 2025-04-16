import React from 'react';
import './Pagination.css';

const RenderPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Nếu tổng số trang <= 7, hiển thị tất cả trang
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Hiển thị 3 trang đầu
    pages.push(1);
    if (totalPages > 1) pages.push(2);
    if (totalPages > 2) pages.push(3);

    // Thêm dấu "..." nếu cần
    if (currentPage > 5) {
      pages.push('...');
    }

    // Hiển thị 3 trang xung quanh trang hiện tại
    const startPage = Math.max(4, currentPage - 1);
    const endPage = Math.min(totalPages - 3, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Thêm dấu "..." nếu cần
    if (currentPage < totalPages - 4) {
      pages.push('...');
    }

    // Hiển thị 3 trang cuối
    if (totalPages - 2 > 3) pages.push(totalPages - 2);
    if (totalPages - 1 > 3) pages.push(totalPages - 1);
    if (totalPages > 3) pages.push(totalPages);
  }

  return (
    <div className="pagination">
      {/* Nút "Trang đầu" */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="pagination-nav first"
          title="Trang đầu"
        >
          «
        </button>
      )}

      {/* Nút "Trang trước" */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-nav prev"
          title="Trang trước"
        >
          ‹
        </button>
      )}

      {/* Hiển thị các số trang */}
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      {/* Nút "Trang sau" */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-nav next"
          title="Trang sau"
        >
          ›
        </button>
      )}

      {/* Nút "Trang cuối" */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="pagination-nav last"
          title="Trang cuối"
        >
          »
        </button>
      )}
    </div>
  );
};

export default RenderPagination;