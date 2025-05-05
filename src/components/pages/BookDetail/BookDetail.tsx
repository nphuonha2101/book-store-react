import { Book } from "../../../types/ApiResponse/Book/book.ts";
import useFetch from "../../../hooks/useFetch.ts";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, Truck, Shield, Info, Package } from "lucide-react";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { addToCart } from "../../../redux/slice/cartItemSlice.ts";
import { addToWishlist, removeFromWishlist, fetchWishlistItems } from "../../../redux/slice/wishlistSlice.ts";
import AuthUtil from "../../../utils/authUtil.ts";
import { CartItemProps } from "../../../types/Cart/cartItemProps.ts";
import { BookCard } from "../../vendor/Card/BookCard.tsx";
import { formatDate } from "../../../utils/formatUtils.ts";
import useFetchPost from "../../../hooks/useFetchPost.ts";
import { toast } from "sonner";

export const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Book ID from URL
    const hasFetchedWishlist = useRef(false);
    const dispatch = useDispatch<AppDispatch>();
    const { status: cartStatus, error: cartError } = useSelector((state: RootState) => state.cart);
    const prevStatus = useRef(cartStatus);
    const actionRef = useRef<string | null>(null);
    const { items: wishlistItems, status: wishlistStatus, error: wishlistError } = useSelector(
        (state: RootState) => state.wishList
    );
    const user = AuthUtil.getUser();
    const { data: book } = useFetch<Book>(API_ENDPOINTS.BOOK.BOOK_DETAIL.URL_DETAIL + `/${id}`);

    const bookSuggestionRequestBody = useMemo(() => [book?.title ? book.title : ""], [book]);
    const { data: suggestedBooks } = useFetchPost<string[], Book[]>(
        API_ENDPOINTS.BOOK.SUGGESTIONS.URL,
        bookSuggestionRequestBody,
        { autoFetch: !!book }
    );

    // Đặt tiêu đề trang
    useEffect(() => {
        if (book?.title) {
            document.title = `Chi tiết sách: ${book.title}`;
        } else {
            document.title = "Chi tiết sách";
        }
    }, [book]);

    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const isInWishlist = wishlistItems.some((item) => item.book?.id === Number(id));
    console.log("Wishlist items:", wishlistItems, "isInWishlist:", isInWishlist);

    useEffect(() => {
        if (user?.id && !hasFetchedWishlist.current) {
            dispatch(fetchWishlistItems(user.id));
            hasFetchedWishlist.current = true;
        }
    }, [dispatch, user?.id]);

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    // Handle add to cart
    const handleAddToCart = () => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        const cartItem: CartItemProps = {
            userId: user.id,
            bookId: book?.id || 0,
            quantity,
            price: book?.price ?? 0,
        };

        console.log("Adding to cart:", cartItem);
        actionRef.current = "ADD_TO_CART";
        dispatch(addToCart(cartItem));
    };

    const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
            return;
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist({ userId: user.id, bookId: Number(id) }))
                .unwrap()
                .then(() => {
                    toast.success(`${book?.title} đã được xóa khỏi danh sách yêu thích!`);
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
                    toast.error(`Lỗi khi xóa khỏi danh sách yêu thích: ${errorMessage}`);
                });
        } else {
            const wishlistItem = {
                userId: user.id,
                bookId: Number(id),
            };
            dispatch(addToWishlist(wishlistItem))
                .unwrap()
                .then(() => {
                    toast.success(`${book?.title} đã được thêm vào danh sách yêu thích!`);
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
                    toast.error(`Lỗi khi thêm vào danh sách yêu thích: ${errorMessage}`);
                });
        }
    };

    useEffect(() => {
        // Nếu status vừa chuyển từ loading sang succeeded và action là ADD_TO_CART
        if (prevStatus.current === "loading" && cartStatus === "succeeded" && actionRef.current === "ADD_TO_CART") {
            toast.success("Đã thêm sản phẩm vào giỏ hàng!");
            actionRef.current = null; // Reset action
        }

        // Nếu có lỗi và action là ADD_TO_CART
        if (cartStatus === "failed" && cartError && actionRef.current === "ADD_TO_CART") {
            toast.error(cartError || "Không thể thêm vào giỏ hàng");
            actionRef.current = null; // Reset action
        }

        prevStatus.current = cartStatus;
    }, [cartStatus, cartError]);

    useEffect(() => {
        if (wishlistStatus === "failed" && wishlistError) {
            console.error("Wishlist error:", wishlistError);
            toast.error(`Lỗi với danh sách yêu thích: ${wishlistError}`);
        }
    }, [wishlistStatus, wishlistError]);

    useEffect(() => {
        if (book) {
            console.log("Fetched book:", book);
        }
    }, [book]);

    // Loading state
    if (!book) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin sách...</p>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };
    const displayImage = selectedImage || book.coverImage;

    return (
        <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Book Detail Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Book Cover and Images Section */}
                    <div>
                        <div className="mb-4 border rounded-lg overflow-hidden">
                            <img
                                src={displayImage}
                                alt={book.title}
                                className="w-full h-64 sm:h-80 md:h-96 object-contain"
                            />
                        </div>
                        {book.images && book.images.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                <div
                                    className={`border-2 rounded-md overflow-hidden cursor-pointer ${!selectedImage ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <img
                                        src={book.coverImage}
                                        alt="Cover"
                                        className="w-full h-16 sm:h-20 md:h-24 object-cover"
                                    />
                                </div>
                                {book.images.slice(0, window.innerWidth < 640 ? 3 : 4).map((image, index) => (
                                    <div
                                        key={index}
                                        className={`border-2 rounded-md overflow-hidden cursor-pointer ${selectedImage === image.url ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => setSelectedImage(image.url || null)}
                                    >
                                        <img
                                            src={image.url ?? ""}
                                            alt={`Hình ${index + 1}`}
                                            className="w-full h-16 sm:h-20 md:h-24 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <div className="flex items-center text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-500 text-xs sm:text-sm">(12 đánh giá)</span>
                            <span className="text-gray-400 hidden sm:inline">|</span>
                            {book.available ? (
                                <span className="text-green-600 text-xs sm:text-sm">Còn hàng</span>
                            ) : (
                                <span className="text-red-600 text-xs sm:text-sm">Hết hàng</span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Tác giả: <span className="text-primary font-medium">{book.authorName}</span>
                                </p>
                                <p className="text-gray-600 text-sm mb-1">
                                    Thể loại: <span className="text-gray-800">{book.category?.name}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Số lượng: <span className="text-gray-800">{book.quantity || "Chưa cập nhật"}</span>
                                </p>
                                <p className="text-gray-600 text-sm mb-1">
                                    Năm XB:{" "}
                                    <span className="text-gray-800">
                                        {book?.publishedAt ? formatDate(book.publishedAt) : "Chưa cập nhật"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                            <p className="text-base sm:text-lg font-bold text-gray-600 mb-1">Giá bán:</p>
                            <p className="text-2xl sm:text-3xl font-bold text-black mb-2">
                                {book.price ? formatPrice(book.price) : "Liên hệ"}
                            </p>
                        </div>
                        <div className="mb-4 sm:mb-6">
                            <label className="block text-gray-700 text-sm mb-2">Số lượng:</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                <div className="flex border rounded w-full sm:w-auto">
                                    <button onClick={decreaseQuantity} className="px-3 sm:px-4 py-2 bg-gray-100 border-r">
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-full sm:w-16 text-center py-2"
                                    />
                                    <button onClick={increaseQuantity} className="px-3 sm:px-4 py-2 bg-gray-100 border-l">
                                        +
                                    </button>
                                </div>
                                <div className="flex w-full gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={cartStatus === "loading"}
                                        className="flex-1 bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 disabled:bg-gray-400"
                                    >
                                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="hidden sm:inline">Thêm vào giỏ hàng</span>
                                        <span className="sm:hidden">Thêm giỏ</span>
                                    </button>

                                    <button
                                        onClick={handleToggleWishlist}
                                        disabled={wishlistStatus === "loading"}
                                        className={`p-2 sm:p-3 border rounded-md flex items-center justify-center ${isInWishlist
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                            } transition-colors duration-300`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist ? "fill-current" : ""}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span className="text-xs sm:text-sm">
                                        Giao hàng nhanh 1-3 ngày
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Package className="h-4 w-4 text-primary" />
                                    <span className="text-xs sm:text-sm">
                                        Miễn phí giao hàng cho đơn hàng từ 300.000đ
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span className="text-xs sm:text-sm">
                                        Đảm bảo chất lượng sản phẩm
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Info className="h-4 w-4 text-primary" />
                                    <span className="text-xs sm:text-sm">
                                        Hỗ trợ 24/7
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Description */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Mô tả sách</h2>
                <div className="prose max-w-none text-sm sm:text-base">
                    {book.description ? (
                        <div dangerouslySetInnerHTML={{ __html: book.description }} />
                    ) : (
                        <p className="text-gray-500 italic">Chưa có mô tả cho sách này.</p>
                    )}
                </div>
            </div>

            {/* Related Books */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Sách liên quan</h2>
                {suggestedBooks && suggestedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                        {suggestedBooks.map((item) => (
                            <BookCard key={item.id} book={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-muted-foreground text-sm">Không có sách liên quan nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};