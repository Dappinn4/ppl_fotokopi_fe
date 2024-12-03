// components/Pagination.tsx
import React from "react";
import { Pagination } from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange,
}) => {
    return (
        <div className="mt-6">
            <Pagination
                totalPages={Math.ceil(totalItems / itemsPerPage)}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PaginationComponent;
