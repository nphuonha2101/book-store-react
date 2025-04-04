import { ShoppingCart, Eye, CreditCard } from "lucide-react";
import { Button } from "../../../shadcn-components/ui/button";
import { Book } from "../../../types/ApiResponse/Book/book";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { addToCart } from "../../../redux/slice/cartItemSlice";
import { CartItem } from "../../../types/ApiResponse/Cart/cart";
import { toast } from "react-toastify";
import AuthUtil from "../../../utils/authUtil.ts";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatUtils.ts";

export const BookCard = ({ book, onClick }: { book: Book, onClick?: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = AuthUtil.getUser();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Ngăn hành vi mặc định để tránh load lại trang

        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }
        const cartItem: CartItem = {
            userId: user.id,
            bookId: book.id,
            quantity: 1,
            price: book.price,
        };

        // Dispatch action addToCart
        dispatch(addToCart(cartItem))
            .unwrap()
            .then(() => {
                toast.success(`${book.title} đã được thêm vào giỏ hàng!`);
            })
            .catch((error) => {
                toast.error(`Lỗi khi thêm vào giỏ hàng: ${error}`);
            });
    };

    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={onClick}
        >
            <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
                <img
                    src={book.coverImage}
                    alt={book.title}
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                    style={{ objectPosition: "center" }}
                />
                <div
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white text-black hover:bg-gray-100 font-medium"
                        asChild
                    >
                        <Link to={`/books/${book.id}`} className="flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            Xem chi tiết
                        </Link>
                    </Button>

                    <Button
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                        onClick={handleAddToCart} // Gọi hàm handleAddToCart
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Thêm vào giỏ hàng
                    </Button>

                    <Button
                        size="sm"
                        className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        Mua ngay
                    </Button>
                </div>
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500">{book.authorName}</p>
                <h3 className="font-medium text-lg hover:text-blue-600 transition-colors mt-1 line-clamp-2">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-lg text-black">{formatPrice(book.price ? book.price : 0)}</p>
                    <div className="flex items-center text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};