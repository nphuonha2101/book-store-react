import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store.ts";
import {
    fetchCartItems,
    removeFromCart,
    updateCartItem,
} from "../../../redux/slice/cartItemSlice.ts";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const Cart: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { items: cartItems, status, error } = useSelector((state: RootState) => state.cart);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(price);
    };

    useEffect(() => {
        console.log("User ID:", user?.id);
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);

    const handleRemoveFromCart = (cartItemId: number) => {
        if (!user?.id) {
            alert("Xin vui lòng đăng nhập để xóa khỏi giỏ hàng");
            return;
        }
        dispatch(removeFromCart({ userId: user.id, cartItemId }));
    };

    const updateQuantity = (cartItemId: number | undefined, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (!user?.id) {
            alert("Vui lòng đăng nhập để cập nhật giỏ hàng");
            return;
        }
        if (!cartItemId) {
            alert("Không tìm thấy ID của sản phẩm trong giỏ hàng");
            return;
        }
        dispatch(updateCartItem({ userId: user.id, cartItemId, quantity: newQuantity }));
    };

    const handleDecreaseQuantity = (cartItemId: number | undefined, currentQuantity: number = 1) => {
        if (currentQuantity > 1) {
            updateQuantity(cartItemId, currentQuantity - 1);
        }
    };

    const handleIncreaseQuantity = (cartItemId: number | undefined, currentQuantity: number = 1) => {
        updateQuantity(cartItemId, currentQuantity + 1);
    };

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.book?.price ?? 0;
        const quantity = item.quantity ?? 1;
        return total + price * quantity;
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const getItemSubtotal = (price: number, quantity: number) => {
        return price * quantity;
    };

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (status === "failed" && error) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
                    <div className="text-red-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-red-500 text-lg">Lỗi tải giỏ hàng: {error}</p>
                </div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-3xl w-full">
                    <div className="text-gray-400 mb-6">
                        <ShoppingBag className="h-24 w-24 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-600 mb-8 text-lg">Thêm mặt hàng vào giỏ hàng để tiếp tục mua sắm</p>
                    <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                        Tiếp tục mua hàng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-10">Giỏ hàng của bạn</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    <div className="hidden md:flex bg-gray-50 p-6 rounded-lg text-base font-medium text-gray-600">
                        <div className="w-1/2">Sản phẩm</div>
                        <div className="w-1/6 text-center">Giá</div>
                        <div className="w-1/6 text-center">Số lượng</div>
                        <div className="w-1/6 text-right">Thành tiền</div>
                    </div>
                    {cartItems.map((item, index) => (
                        <div
                            key={item.id ?? index} // Sử dụng index nếu item.id không tồn tại
                            className="bg-white rounded-xl sd border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="md:hidden">
                                    <div className="flex mb-6">
                                        <div className="h-32 w-32 bg-gray-100 flex-shrink-0 mr-5 rounded-md overflow-hidden">
                                            <img
                                                src={item.book?.coverImage}
                                                alt={item.book?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                {item.book?.title || `Item #${item.id}`}
                                            </h3>
                                            <p className="font-medium text-xl text-gray-900 mt-1">
                                                {formatPrice(item.book?.price ?? 0)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button type="button"
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Ngăn hành vi mặc định
                                                    handleDecreaseQuantity(item.id, item.quantity ?? 1);
                                                }} aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                            <span className="px-5 py-2 border-x border-gray-300 text-lg">{item.quantity ?? 1}</span>
                                            <button type="button"
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Ngăn hành vi mặc định
                                                    handleIncreaseQuantity(item.id, item.quantity ?? 1);
                                                }} aria-label="Increase quantity"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 mb-1">Thành tiền</div>
                                                <div className="font-semibold text-lg text-gray-900">
                                                    {formatPrice(getItemSubtotal(item.book?.price ?? 0, item.quantity ?? 1))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromCart(item.id!)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center">
                                    <div className="w-1/2 flex items-center">
                                        <div className="h-24 w-24 bg-gray-100 flex-shrink-0 mr-5 rounded-md overflow-hidden">
                                            <img
                                                src={item.book?.coverImage || "/api/placeholder/200/200"}
                                                alt={item.book?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                {item.book?.title || `Item #${item.id}`}
                                            </h3>
                                            <button
                                                onClick={() => handleRemoveFromCart(item.id!)}
                                                className="text-gray-400 hover:text-red-500 text-sm mt-1 flex items-center gap-2 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-1/6 text-center">
                                        <p className="font-medium text-lg text-gray-900">
                                            {formatPrice(item.book?.price ?? 0)}
                                        </p>
                                    </div>
                                    <div className="w-1/6 flex justify-center">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button type="button"
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Ngăn hành vi mặc định
                                                    handleDecreaseQuantity(item.id, item.quantity ?? 1);
                                                }} aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-4 py-2 border-x border-gray-300 text-base">{item.quantity ?? 1}</span>
                                            <button type="button"
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Ngăn hành vi mặc định
                                                    handleIncreaseQuantity(item.id, item.quantity ?? 1);
                                                }} aria-label="Increase quantity"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-1/6 text-right">
                                        <p className="font-semibold text-lg text-gray-900">
                                            {formatPrice(getItemSubtotal(item.book?.price ?? 0, item.quantity ?? 1))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sticky top-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Đơn hàng của bạn</h2>
                        <div className="space-y-5">
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Tổng sản phẩm</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Phí vận chuyển (10%)</span>
                                <span className="font-medium">{formatPrice(tax)}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Tổng thanh toán</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <button className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg">
                                Đặt hàng
                            </button>
                            <button className="w-full bg-white text-gray-800 border border-gray-300 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg">
                                Tiếp tục mua hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};