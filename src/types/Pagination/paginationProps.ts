export interface PaginationProps {
    pagination?: {
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    };
    onPageChange: (page: number) => void;
}