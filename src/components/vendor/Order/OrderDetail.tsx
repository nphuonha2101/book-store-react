import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft, ShoppingCart, Wallet, Truck, BadgePercent,
    User, Home, Phone, Mail
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { formatPrice } from "../../../utils/formatUtils";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    book: {
        title: string;
        coverImage?: string;
    };
}

interface Address {
    fullName: string;
    addInfo: string;
    ward: string;
    district: string;
    province: string;
    phoneNumber?: string;
    email?: string;
}

interface Order {
    id: number;
    createdAt: string;
    status: "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
    paymentMethod: number;
    address: Address;
    orderItems: OrderItem[];
    totalAmount: number;
    shippingFee: number;
    totalDiscount: number;
}

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_ENDPOINTS.ORDER.GET_BY_ID.URL}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    setOrder(result.data);
                } else {
                    setError(result.message || "Không tìm thấy đơn hàng.");
                }
            } catch {
                setError("Lỗi khi gọi API.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return <p className="text-center py-20 text-lg">Đang tải chi tiết đơn hàng...</p>;
    }

    if (error || !order) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-lg">{error}</p>
                <Button asChild className="mt-4">
                    <Link to="/orders/history">Quay lại lịch sử đơn hàng</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10 text-base">
            <div className="flex items-center mb-8">
                <Button variant="ghost" asChild className="mr-4">
                    <Link to="/orders/history">
                        <ArrowLeft className="h-5 w-5 mr-2" /> Quay lại
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Đơn hàng #{order.id}</CardTitle>
                            <CardDescription className="text-base">
                                Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge className="text-base">
                            {order.status === "PENDING" && "Chờ xử lý"}
                            {order.status === "PROCESSING" && "Đang xử lý"}
                            {order.status === "SHIPPING" && "Đang giao"}
                            {order.status === "DELIVERED" && "Đã giao"}
                            {order.status === "CANCELLED" && "Đã hủy"}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin người nhận */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <User className="w-5 h-5" /> Thông tin người nhận
                            </h3>
                            <div className="text-base space-y-2 text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-foreground" /> {order.address.fullName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-foreground" />
                                    {`${order.address.addInfo}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`}
                                </p>
                                {order.address.phoneNumber && (
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-foreground" /> {order.address.phoneNumber}
                                    </p>
                                )}
                                {order.address.email && (
                                    <p className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-foreground" /> {order.address.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Thông tin thanh toán */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">💳 Thông tin thanh toán</h3>
                            <p className="text-base text-muted-foreground">
                                Phương thức:{" "}
                                <span className="font-medium text-foreground">
                  {order.paymentMethod === 1 ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
                </span>
                            </p>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                            <ShoppingCart className="mr-2 h-5 w-5" /> Sản phẩm ({order.orderItems.length})
                        </h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                    <div className="h-20 w-20 bg-accent rounded-md overflow-hidden">
                                        <img
                                            src={item.book.coverImage || "/placeholder-image.jpg"}
                                            alt={item.book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-lg">{item.book.title}</h4>
                                        <p className="text-base text-muted-foreground">
                                            Số lượng: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right font-semibold text-base">
                                        {formatPrice(item.price)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Phí + giảm giá + tổng */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center font-bold text-lg text-blue-600">
              <span className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Phí vận chuyển
              </span>
                            <span>{formatPrice(order.shippingFee)}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold text-lg text-red-500">
              <span className="flex items-center gap-2">
                <BadgePercent className="h-5 w-5" />
                Giảm giá
              </span>
                            <span>-{formatPrice(order.totalDiscount)}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold text-xl text-green-600 pt-2">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Tổng thanh toán
              </span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDetail;
