import { Ribbon } from "../../../types/ApiResponse/Ribbon/ribbon.ts";
import { BookCard } from "../Card/BookCard.tsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const BooksRibbonContainer = ({
    ribbon,
    loading,
}: {
    ribbon: Ribbon;
    loading: boolean;
}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Kiểm tra xem có thể scroll không và cập nhật trạng thái hiển thị mũi tên
    const checkScrollability = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setShowLeftArrow(scrollPosition > 0);
        setShowRightArrow(scrollPosition < container.scrollWidth - container.clientWidth - 10); // 10px là tolerance
    };

    // Cập nhật hiển thị mũi tên khi scrollPosition thay đổi
    useEffect(() => {
        checkScrollability();
    }, [scrollPosition]);

    // Kiểm tra lại khi window resize
    useEffect(() => {
        const handleResize = () => {
            checkScrollability();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Tính toán scroll amount dựa trên kích thước card và padding
        const cardWidth = window.innerWidth < 640 ? 160 : window.innerWidth < 768 ? 200 : 250;
        const padding = window.innerWidth < 768 ? 2 : 3;
        const visibleCards = Math.floor(container.clientWidth / (cardWidth + padding * 2));
        const scrollAmount = (cardWidth + padding * 2) * Math.max(1, visibleCards - 1);

        const newPosition = direction === 'left'
            ? Math.max(0, scrollPosition - scrollAmount)
            : Math.min(
                container.scrollWidth - container.clientWidth,
                scrollPosition + scrollAmount
            );

        container.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });

        setScrollPosition(newPosition);
    };

    const hasItems = ribbon.ribbonItems && ribbon.ribbonItems.length > 0;

    return (
        <div className="container mx-auto py-4 md:py-6 px-3 sm:px-4 md:px-6 relative">
            {/* Header Section */}
            <div className="mb-3 md:mb-4 flex justify-between items-center">
                {/* Title and description */}
                <div className="mr-4 flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                        {ribbon.name || "Danh sách sách"}
                    </h2>
                    {ribbon.description && (
                        <p className="text-xs md:text-sm text-gray-500 mt-1 truncate max-w-full">
                            {ribbon.description}
                        </p>
                    )}
                    <div className="mt-1 md:mt-2 h-1 w-16 md:w-24 bg-primary"></div>
                </div>

                {/* Navigation Buttons - Only show when needed */}
                {hasItems && (
                    <div className="flex space-x-2 z-10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll('left');
                            }}
                            className={`p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all touch-manipulation
                                ${showLeftArrow
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 opacity-100'
                                    : 'bg-gray-50 text-gray-300 opacity-50 cursor-default'}`
                            }
                            aria-label="Scroll left"
                            type="button"
                            disabled={!showLeftArrow}
                        >
                            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll('right');
                            }}
                            className={`p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all touch-manipulation
                                ${showRightArrow
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 opacity-100'
                                    : 'bg-gray-50 text-gray-300 opacity-50 cursor-default'}`
                            }
                            aria-label="Scroll right"
                            type="button"
                            disabled={!showRightArrow}
                        >
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section with improved responsiveness */}
            <div className="relative overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-4 sm:p-6 md:p-8">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
                    </div>
                ) : hasItems ? (
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto scrollbar-hide scroll-smooth py-2 md:py-4 -mx-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
                    >
                        {ribbon.ribbonItems?.map((item) => (
                            item.book && (
                                <div
                                    key={item.id || item.book.id}
                                    className="flex-none w-full xs:w-full sm:w-full md:w-[220px] lg:w-[240px] px-2 transition-transform duration-300"
                                >
                                    <BookCard book={item.book} />
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 sm:py-6 md:py-8 text-gray-500 text-sm sm:text-base">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};
