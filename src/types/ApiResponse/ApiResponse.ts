export interface ApiResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
    pagination? : {
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    }
}