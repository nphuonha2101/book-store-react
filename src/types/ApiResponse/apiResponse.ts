export interface ApiResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
    pagination?: ApiPaginationResponse;
}

export interface ApiPaginationResponse {
    isFirst: boolean;
    isLast: boolean;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    totalElements: number;
}
