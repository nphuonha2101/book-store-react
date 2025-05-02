import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AuthUtil from "../../../utils/authUtil.ts";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import {
    fetchOrderHistory,
    cancelOrder,
} from "../../../redux/slice/orderSlice.ts"; // Sẽ tạo sau
import Logger from "../../../utils/logger.ts";

const OrderHistory: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = AuthUtil.getUser();
    const { items: orders, status, error } = useSelector(
        (state: RootState) => state.order
    );

    useEffect(() => {
        const userId = user?.id;
        Logger.log("userId", userId);
        if (userId) {
            dispatch(fetchOrderHistory(userId));
        }
    }, [dispatch]);

    const handleCancelOrder = (orderId: number) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để hủy đơn hàng");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
            dispatch(cancelOrder({ orderId, userId: user.id }))
                .unwrap()
                .then(() => {
                    toast.success("Đã hủy đơn hàng!");
                })
                .catch((error) => {
                    toast.error(`Lỗi khi hủy: ${error}`);
                });
        }
    };

    if (!user?.id) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Vui lòng đăng nhập
        </h2>
        <p className="text-gray-600">
            Bạn cần đăng nhập để xem lịch sử đơn hàng.
        </p>
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
                <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
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

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Lịch sử đơn hàng trống
        </h2>
        <p className="text-gray-600">
            Bạn chưa có đơn hàng nào.
        </p>
        <Link to="/products" className="text-blue-500 hover:underline">
            Mua sắm ngay
        </Link>
        </div>
    );
    }

    return (
        <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Lịch sử đơn hàng
    </h2>
    <div className="space-y-6">
        {orders.map((order) => (
                <div
                    key={order.id}
            className="bg-white rounded-lg shadow-md p-4 relative"
            >
            <div>
                <p className="text-lg font-semibold text-gray-800">
                Mã đơn hàng: #{order.id}
    </p>
    <p className="text-gray-600">
        Tổng tiền: {order.totalAmount} VND
    </p>
    <p className="text-gray-600">
        Trạng thái: {order.status}
    </p>
    <p className="text-gray-600">
        Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
    </p>
    </div>
    {order.status === "PENDING" && order.userId === user.id && (
        <button
            onClick={() => handleCancelOrder(order.id)}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
        aria-label="Cancel order"
        >
        <Trash2 className="h-4 w-4" />
            </button>
    )}
    </div>
))}
    </div>
    </div>
);
};

export default OrderHistory;