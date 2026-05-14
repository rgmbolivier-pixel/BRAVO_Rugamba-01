import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalCount, 
  pageSize, 
  onPageChange,
  loading = false 
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-dim">
        Showing <span className="font-bold text-main">{(currentPage - 1) * pageSize + 1}</span> to{' '}
        <span className="font-bold text-main">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
        <span className="font-bold text-main">{totalCount}</span> results
      </div>
      <div className="flex gap-2">
        <button
          className="btn-secondary small"
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} /> PREVIOUS
        </button>
        <div className="flex items-center px-4 font-mono text-sm border border-glass rounded bg-glass text-primary">
          PAGE {currentPage} / {totalPages}
        </div>
        <button
          className="btn-secondary small"
          disabled={currentPage === totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          NEXT <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
