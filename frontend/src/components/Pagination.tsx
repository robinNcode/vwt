import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalItems === 0 || totalPages <= 1) return null;

    return (
        <div className="p-4 border-t border-[#E8DCC4] dark:border-white/5 flex items-center justify-between">
            <p className="text-xs text-[#8B7355] dark:text-[#4D526A]">
                Showing {totalItems} entries
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#E8DCC4]/50 dark:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#5C4D3C] dark:hover:text-[#F0F2F7] disabled:opacity-50 transition-all font-bold disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === 'ellipsis' ? (
                            <span className="text-[#8B7355] dark:text-[#4D526A] px-2">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "p-2 rounded-lg text-xs font-bold px-4 transition-all",
                                    currentPage === page
                                        ? "bg-[#F5A623]/10 text-[#d48e1d] dark:text-[#F5A623] hover:bg-[#F5A623]/20"
                                        : "bg-[#E8DCC4]/50 dark:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#5C4D3C] dark:hover:text-[#F0F2F7]"
                                )}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#E8DCC4]/50 dark:bg-white/5 text-[#8B7355] dark:text-[#4D526A] hover:text-[#5C4D3C] dark:hover:text-[#F0F2F7] disabled:opacity-50 transition-all font-bold disabled:cursor-not-allowed"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
