import { Book } from "../../../types/ApiResponse/Book/book.ts";
import useFetch from "../../../hooks/useFetch.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import React, {useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, Truck, RotateCcw, Shield, Info } from "lucide-react";
import useFetchPost from "../../../hooks/useFetchPost.ts";

export const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: book } = useFetch<Book>(API_ENDPOINTS.BOOK.BOOK_DETAIL.URL_DETAIL + `/${id}`);
    // Get book suggestions
    const bookSuggestionRequestBody = useMemo(() => ({ terms: [book && book.title || ""] }), [book]);
    const { data: suggestedBooks } = useFetchPost<{ terms: string[]}, Book[]>(API_ENDPOINTS.BOOK.SUGGESTIONS.URL,
        bookSuggestionRequestBody, { autoFetch: !!book }
    );
    // Cart quantity
    const [quantity, setQuantity] = useState<number>(1);
    console.log("suggest", suggestedBooks);

    // State for selected image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!book) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin sách...</p>
                </div>
            </div>
        );
    }

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const displayImage = selectedImage || book.coverImage;
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-6">
                <a href="/" className="hover:text-primary">Trang chủ</a> &gt;
                <a href="/books" className="hover:text-primary"> Sách</a> &gt;
                <span className="text-gray-700"> {book.title}</span>
            </div>

            {/* Book Detail Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Book Cover and Images Section */}
                    <div>
                        {/* Main Image */}
                        <div className="mb-4 border rounded-lg overflow-hidden">
                            <img
                                src={displayImage}
                                alt={book.title}
                                className="w-full h-96 object-contain"
                            />
                        </div>

                        {/* Image Gallery */}
                        {book.images && book.images.length > 0 && (
                            <div className="grid grid-cols-5 gap-2">
                                {/* Main cover image thumbnail */}
                                <div
                                    className={`border-2 rounded-md overflow-hidden cursor-pointer ${
                                        !selectedImage ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <img
                                        src={book.coverImage}
                                        alt="Cover"
                                        className="w-full h-24 object-cover"
                                    />
                                </div>

                                {/* Additional images */}
                                {book.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`border-2 rounded-md overflow-hidden cursor-pointer ${
                                            selectedImage === image.url ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedImage(image.url || null)}
                                    >
                                        <img
                                            src={image.url ?? ''}
                                            alt={`Hình ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col">
                        {/* Title and Basic Info */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">(12 đánh giá)</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-green-600 text-sm">Còn hàng</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="col-span-2 md:col-span-1">
                                <p className="text-gray-600 mb-1">Tác giả: <span
                                    className="text-primary font-medium">{book.authorName}</span></p>
                                <p className="text-gray-600 mb-1">Thể loại: <span
                                    className="text-gray-800">{book.category?.name}</span></p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <p className="text-gray-600 mb-1">Số lượng : <span
                                    className="text-gray-800">{book.quantity || "Chưa cập nhật"}</span></p>
                                <p className="text-gray-600 mb-1">Năm XB: <span
                                    className="text-gray-800">{book.publishedAt || "Chưa cập nhật"}</span></p>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-lg font-bold text-gray-600 mb-1">Giá bán:</p>
                            <p className="text-3xl font-bold text-black mb-2">
                                {book.price ? formatPrice(book.price) : "Liên hệ"}
                            </p>

                        </div>

                        {/* Quantity and Action Buttons */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Số lượng:</label>
                            <div className="flex items-center gap-4">
                                <div className="flex border rounded">
                                    <button className="px-4 py-2 bg-gray-100 border-r">-</button>
                                    <input type="number" min="1" value={quantity}
                                           onChange={(e) => setQuantity(Number(e.target.value))}
                                           className="w-16 text-center py-2"/>
                                    <button className="px-4 py-2 bg-gray-100 border-l">+</button>
                                </div>

                                <button
                                    className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2">
                                    <ShoppingCart className="h-5 w-5"/>
                                    Thêm vào giỏ hàng
                                </button>

                                <button
                                    className="bg-black text-white px-4 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2">
                                    Mua ngay
                                </button>

                                <button className="p-3 border rounded-md hover:bg-gray-100">
                                    <Heart className="h-5 w-5 text-red-500"/>
                                </button>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Truck className="h-4 w-4 text-primary"/>
                                    <span className="text-sm">Giao hàng nhanh 1-3 ngày</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <RotateCcw className="h-4 w-4 text-primary"/>
                                    <span className="text-sm">Đổi trả trong 7 ngày</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Shield className="h-4 w-4 text-primary"/>
                                    <span className="text-sm">Bảo hành chính hãng</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Info className="h-4 w-4 text-primary"/>
                                    <span className="text-sm">Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Description and Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả sách</h2>
                <div className="prose max-w-none">
                    {book.description ? (
                        <div dangerouslySetInnerHTML={{__html: book.description}}/>
                    ) : (
                        <p className="text-gray-500 italic">Chưa có mô tả cho sách này.</p>
                    )}
                </div>
            </div>

            {/* Related Books Section */}
            {/* This would be implemented with your data fetching logic */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sách liên quan</h2>
                {suggestedBooks && suggestedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {suggestedBooks.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Hình ảnh */}
                                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-xl bg-muted">
                                    <img
                                        src={item.coverImage || '/default-image.jpg'}
                                        alt={item.title || "Không có tiêu đề"}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => (e.currentTarget.src = '/default-image.jpg')}
                                    />
                                </div>
                                {/* Nội dung */}
                                <div className="p-4 flex flex-col">
                                    <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                        {item.title || "Sách chưa có tiêu đề"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                        {item.description || "Mô tả sách"}
                                    </p>
                                    <p className="text-sm font-bold text-primary mt-auto">
                                        {item.price ? formatPrice(item.price) : "Liên hệ"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Không có sách liên quan nào</p>
                    </div>
                )}
            </div>
            {suggestedBooks && suggestedBooks.length > 0 && (
                <div className="mt-6 text-center">
                    <button className="bg-transparent border border-input hover:bg-muted text-foreground py-2 px-4 rounded-md text-sm font-medium transition-colors">
                        Xem thêm sản phẩm
                    </button>
                </div>
            )}
        </div>
    );
};