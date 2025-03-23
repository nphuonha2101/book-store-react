import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "../../../shadcn-components/ui/pagination";
import { PaginationProps } from "../../../types/Pagination/paginationProps";

export default function PaginationComponent({ pagination, onPageChange }: PaginationProps) {
    if (!pagination) return null;

    return (
        <Pagination>
            <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => !pagination.isFirst && onPageChange(pagination.currentPage - 1)}
                        className={pagination.isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={pagination.isFirst}
                    />
                </PaginationItem>

                {/* Logic hiển thị các trang với dấu ellipsis */}
                {(() => {
                    const currentPage = pagination.currentPage;
                    const totalPages = pagination.totalPages;
                    const visiblePageCount = 5; // Số trang hiển thị tối đa (không tính nút prev/next)
                    const pages = [];

                    // Luôn hiển thị trang đầu
                    if (currentPage > 2) {
                        pages.push(
                            <PaginationItem key={1}>
                                <PaginationLink
                                    onClick={() => onPageChange(1)}
                                    isActive={currentPage === 1}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Hiển thị "..." nếu vị trí hiện tại cách xa trang đầu
                    if (currentPage > 3) {
                        pages.push(
                            <PaginationItem key="ellipsis-1">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Xác định trang bắt đầu và kết thúc để hiển thị
                    let startPage = Math.max(currentPage - Math.floor(visiblePageCount / 2), 1);
                    const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

                    // Điều chỉnh lại nếu không đủ trang để hiển thị
                    if (endPage - startPage + 1 < visiblePageCount) {
                        startPage = Math.max(endPage - visiblePageCount + 1, 1);
                    }

                    // Tạo các nút trang
                    for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => onPageChange(i)}
                                    isActive={currentPage === i}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Hiển thị "..." nếu vị trí hiện tại cách xa trang cuối
                    if (currentPage < totalPages - 2) {
                        pages.push(
                            <PaginationItem key="ellipsis-2">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Luôn hiển thị trang cuối nếu không nằm trong dải trang hiển thị
                    if (currentPage < totalPages - 1 && endPage !== totalPages) {
                        pages.push(
                            <PaginationItem key={totalPages}>
                                <PaginationLink
                                    onClick={() => onPageChange(totalPages)}
                                    isActive={currentPage === totalPages}
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
                        onClick={() => !pagination.isLast && onPageChange(pagination.currentPage + 1)}
                        className={pagination.isLast ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={pagination.isLast}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
