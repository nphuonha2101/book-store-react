import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "../../ui/pagination";
import { PaginationProps } from "../../../types/Pagination/paginationProps";

export default function PaginationComponent({ pagination, onPageChange }: PaginationProps) {
    if (!pagination) return null;

    // Đảm bảo các giá trị phù hợp với API Spring
    const currentPage = pagination.currentPage; // index bắt đầu từ 0 trong Spring
    const totalPages = pagination.totalPages;
    const displayCurrentPage = currentPage + 1; // Hiển thị cho người dùng từ 1

    return (
        <Pagination>
            <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => !pagination.isFirst && onPageChange(currentPage - 1)}
                        className={pagination.isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={pagination.isFirst}
                    />
                </PaginationItem>

                {/* Logic hiển thị các trang với dấu ellipsis */}
                {(() => {
                    const visiblePageCount = 5; // Số trang hiển thị tối đa (không tính nút prev/next)
                    const pages = [];

                    // Luôn hiển thị trang đầu
                    if (displayCurrentPage > 2) {
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
                    }

                    // Hiển thị "..." nếu vị trí hiện tại cách xa trang đầu
                    if (displayCurrentPage > 3) {
                        pages.push(
                            <PaginationItem key="ellipsis-1">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Xác định trang bắt đầu và kết thúc để hiển thị
                    // Lưu ý: startPage bắt đầu từ 1 cho hiển thị, nhưng khi gọi API sẽ trừ 1
                    let startDisplayPage = Math.max(displayCurrentPage - Math.floor(visiblePageCount / 2), 1);
                    const endDisplayPage = Math.min(startDisplayPage + visiblePageCount - 1, totalPages);

                    // Điều chỉnh lại nếu không đủ trang để hiển thị
                    if (endDisplayPage - startDisplayPage + 1 < visiblePageCount) {
                        startDisplayPage = Math.max(endDisplayPage - visiblePageCount + 1, 1);
                    }

                    // Tạo các nút trang
                    for (let i = startDisplayPage; i <= endDisplayPage; i++) {
                        const pageIndex = i - 1; // Chuyển đổi thành index 0-based cho API
                        pages.push(
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => onPageChange(pageIndex)}
                                    isActive={currentPage === pageIndex}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Hiển thị "..." nếu vị trí hiện tại cách xa trang cuối
                    if (displayCurrentPage < totalPages - 1) {
                        pages.push(
                            <PaginationItem key="ellipsis-2">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Luôn hiển thị trang cuối nếu không nằm trong dải trang hiển thị
                    if (displayCurrentPage < totalPages && endDisplayPage !== totalPages) {
                        pages.push(
                            <PaginationItem key={totalPages}>
                                <PaginationLink
                                    onClick={() => onPageChange(totalPages - 1)} // Index của trang cuối = totalPages - 1
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
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
