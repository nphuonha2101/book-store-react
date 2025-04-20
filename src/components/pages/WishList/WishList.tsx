import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AuthUtil from "../../../utils/authUtil.ts";
import {AppDispatch, RootState} from "../../../redux/store.ts";
import {fetchWishlistItems, removeFromWishlist} from "../../../redux/slice/wishlistSlice.ts";
import {BookCard} from "../../vendor/Card/BookCard.tsx";
import Logger from "../../../utils/logger.ts";

const Wishlist: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useMemo(() => AuthUtil.getUser(), []);
    const { items: wishlistItems, status, error } = useSelector((state: RootState) => state.wishList);

    useEffect(() => {
        const userId = user?.id;
        Logger.log("userId", userId);
        if (userId) {
            dispatch(fetchWishlistItems(userId));
        }
    }, []);

    const handleRemoveFromWishlist = (bookId: number) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để xóa khỏi danh sách yêu thích");
            return;
        }

        dispatch(removeFromWishlist({ userId: user.id, bookId }))
            .unwrap()
            .then(() => {
                toast.success("Đã xóa khỏi danh sách yêu thích!");
            })
            .catch((error) => {
                toast.error(`Lỗi khi xóa: ${error}`);
            });
    };

    if (!user?.id) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
                <p className="text-gray-600">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
                <Link to="/signin" className="text-blue-500 hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-red-500">Lỗi: {error}</p>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách yêu thích trống</h2>
                <p className="text-gray-600">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
                <Link to="/products" className="text-blue-500 hover:underline">
                    Khám phá sản phẩm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Danh sách yêu thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                    <div
                        key={item.book?.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative"
                    >
                        <BookCard book={item.book!} />
                        <button
                            onClick={() => item.book?.id !== undefined && handleRemoveFromWishlist(item.book.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                            aria-label="Remove from wishlist"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;