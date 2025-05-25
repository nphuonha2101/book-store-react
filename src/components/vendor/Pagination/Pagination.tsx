import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "../../ui/pagination";
import { PaginationProps } from "../../../types/Pagination/paginationProps";

export default function PaginationComponent({ pagination, onPageChange }: PaginationProps) {
    if (!pagination) return null;

    // Đảm bảo các giá trị phù hợp với API Spring
    const currentPage = pagination.currentPage; // index bắt đầu từ 0 trong Spring
    const totalPages = pagination.totalPages;

    return (
        <Pagination>
            <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => !pagination.isFirst && onPageChange(currentPage - 1)}
                        className={pagination.isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={pagination.isFirst}
                        lang="vi"
                        title="Trang trước"
                    />
                </PaginationItem>

                {/* Logic hiển thị các trang với dấu ellipsis */}
                {(() => {
                    // Số nút trang hiển thị tối đa (không tính nút prev/next và ellipsis)
                    const visiblePageCount = 3;
                    const pages = [];

                    // Trang 1 luôn được hiển thị
                    pages.push(
                        <PaginationItem key={0}>
                            <PaginationLink
                                onClick={() => onPageChange(0)}
                                isActive={currentPage === 0}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                    );

                    // Xác định phạm vi trang hiển thị xung quanh trang hiện tại
                    let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
                    const endPage = Math.min(totalPages - 2, startPage + visiblePageCount - 1);

                    // Điều chỉnh lại nếu không đủ trang ở một bên
                    if (endPage - startPage + 1 < visiblePageCount) {
                        startPage = Math.max(1, endPage - visiblePageCount + 1);
                    }

                    // Hiển thị ellipsis đầu tiên nếu cần
                    if (startPage > 1) {
                        pages.push(
                            <PaginationItem key="ellipsis-start">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Hiển thị các trang giữa
                    for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => onPageChange(i)}
                                    isActive={currentPage === i}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Hiển thị ellipsis cuối nếu cần
                    if (endPage < totalPages - 2) {
                        pages.push(
                            <PaginationItem key="ellipsis-end">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Trang cuối cùng luôn được hiển thị nếu có nhiều hơn 1 trang
                    if (totalPages > 1) {
                        pages.push(
                            <PaginationItem key={totalPages - 1}>
                                <PaginationLink
                                    onClick={() => onPageChange(totalPages - 1)}
                                    isActive={currentPage === totalPages - 1}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    return pages;
                })()}

                {/* Nút Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => !pagination.isLast && onPageChange(currentPage + 1)}
                        className={pagination.isLast ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={pagination.isLast}
                        lang="vi"
                        title="Trang tiếp theo"
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
