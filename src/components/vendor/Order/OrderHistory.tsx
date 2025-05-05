import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, ChevronRight } from "lucide-react";
import AuthUtil from "../../../utils/authUtil.ts";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { fetchOrderHistory, cancelOrder } from "../../../redux/slice/orderSlice.ts";
import { formatPrice } from "../../../utils/formatUtils.ts";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Alert, AlertDescription } from "../../ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {Textarea} from "../../ui/textarea.tsx"; // Giả sử bạn có component Tabs từ UI library

const OrderHistory: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = AuthUtil.getUser();
    const { items: orders, status, error } = useSelector((state: RootState) => state.order);

    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("ALL"); // Trạng thái tab hiện tại

    const cancelReasons = [
        "Thay đổi ý định",
        "Sản phẩm không phù hợp",
        "Đặt nhầm sản phẩm",
        "Khác",
    ];

    useEffect(() => {
        document.title = "Lịch sử đơn hàng";
    }, [])

    // Danh sách các tab trạng thái đơn hàng
    const orderStatuses = [
        { value: "ALL", label: "Tất cả" },
        { value: "PENDING", label: "Chờ xử lý" },
        { value: "PROCESSING", label: "Đang xử lý" },
        { value: "SHIPPING", label: "Đang giao" },
        { value: "DELIVERED", label: "Đã giao" },
        { value: "CANCELLED", label: "Đã hủy" },
    ];

    useEffect(() => {
        if (AuthUtil.isLogged()) {
            // Dispatch fetchOrderHistory với trạng thái của tab hiện tại
            dispatch(fetchOrderHistory(activeTab === "ALL" ? null : activeTab));
        }
    }, [dispatch, activeTab]); // Chỉ dispatch lại khi activeTab thay đổi

    const handleCancelOrder = (orderId: number) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để hủy đơn hàng");
            return;
        }
        setSelectedOrderId(orderId);
        setIsCancelDialogOpen(true);
    };

    const confirmCancelOrder = () => {
        if (!selectedOrderId || !cancellationReason) {
            toast.error("Vui lòng chọn lý do hủy đơn hàng");
            return;
        }

        const finalReason = cancellationReason === "Khác" ? customReason.trim() : cancellationReason;

        if (!finalReason) {
            toast.error("Vui lòng nhập lý do hủy đơn hàng");
            return;
        }

        dispatch(cancelOrder({ orderId: selectedOrderId, cancellationReason: finalReason }))
            .unwrap()
            .then(() => {
                toast.success("Đã hủy đơn hàng!");
                setIsCancelDialogOpen(false);
                setCancellationReason("");
                setCustomReason("");
                setSelectedOrderId(null);
                // Refresh danh sách đơn hàng sau khi hủy
                dispatch(fetchOrderHistory(activeTab === "ALL" ? null : activeTab));
            })
            .catch((error) => {
                toast.error(`Lỗi khi hủy: ${error}`);
            });
    };

    const handleAddToCart = (bookId: number) => {
        toast.success(`Đã thêm sách ID ${bookId} vào giỏ hàng!`);
    };

    if (!user?.id) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Vui lòng đăng nhập</CardTitle>
                        <CardDescription className="text-lg">
                            Bạn cần đăng nhập để xem lịch sử đơn hàng.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild size="lg">
                            <Link to="/signin">Đăng nhập ngay</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle>Đang tải...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                        </div>
                        <p className="text-center text-muted-foreground">Đang tải lịch sử đơn hàng...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">Có lỗi xảy ra</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>
                                Lỗi tải lịch sử đơn hàng: {error}
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-center mt-6">
                            <Button asChild>
                                <Link to="/">Quay lại trang chủ</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10">Lịch sử đơn hàng</h1>

            {/* Tabs để chọn trạng thái đơn hàng */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                    {orderStatuses.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {orders.length === 0 ? (
                <Card className="max-w-md w-full mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Không có đơn hàng</CardTitle>
                        <CardDescription className="text-lg">
                            Không tìm thấy đơn hàng nào với trạng thái này.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild size="lg">
                            <Link to="/products">Mua sắm ngay</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                                        <CardDescription>
                                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={
                                            order.status === "PENDING" || order.status === "PROCESSING"
                                                ? "destructive"
                                                : order.status === "DELIVERED"
                                                    ? "default"
                                                    : order.status === "CANCELLED"
                                                        ? "secondary"
                                                        : "outline"
                                        }
                                        className={
                                            order.status === "DELIVERED"
                                                ? "bg-green-500 text-white"
                                                : order.status === "SHIPPING"
                                                    ? "bg-blue-500 text-white"
                                                    : ""
                                        }
                                    >
                                        {order.status === "PENDING" && "Chờ xử lý"}
                                        {order.status === "PROCESSING" && "Đang xử lý"}
                                        {order.status === "SHIPPING" && "Đang giao"}
                                        {order.status === "DELIVERED" && "Đã giao"}
                                        {order.status === "CANCELLED" && "Đã hủy"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Sản phẩm (
                                        {order.orderItems?.length || 0})
                                    </h3>
                                    {order.orderItems?.length > 0 ? (
                                        <div className="space-y-3">
                                            {order.orderItems.map((orderItem) => (
                                                <div
                                                    key={orderItem.id}
                                                    className="flex items-center gap-3 border-b pb-3"
                                                >
                                                    <div className="h-16 w-16 bg-accent rounded-md overflow-hidden">
                                                        <img
                                                            src={
                                                                orderItem.book.coverImage ||
                                                                "/placeholder-image.jpg"
                                                            }
                                                            alt={orderItem.book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-medium text-sm">
                                                            {orderItem.book.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Số lượng: {orderItem.quantity || 1}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-right">
                                                            {formatPrice(orderItem.price)}
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAddToCart(orderItem.book.id)}
                                                        >
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Không có sản phẩm nào trong đơn hàng.
                                        </p>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng thanh toán</span>
                                    <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </CardContent>
                            <CardContent className="pt-0 flex flex-wrap gap-3">
                                <Button variant="outline" asChild className="w-full">
                                    <Link to={`/orders/${order.id}`}>
                                        Xem chi tiết <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                {(order.status === "PENDING" || order.status === "PROCESSING") && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Hủy đơn hàng
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog chọn lý do hủy */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chọn lý do hủy đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <RadioGroup value={cancellationReason} onValueChange={setCancellationReason}>
                            {cancelReasons.map((reason) => (
                                <div key={reason} className="flex items-center space-x-2">
                                    <RadioGroupItem value={reason} id={reason} />
                                    <label htmlFor={reason} className="text-sm">{reason}</label>
                                </div>
                            ))}
                        </RadioGroup>
                        {cancellationReason === "Khác" && (
                            <Textarea
                                className="w-full p-1"
                                placeholder="Nhập lý do cụ thể..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCancelDialogOpen(false);
                                setCancellationReason("");
                                setCustomReason("");
                                setSelectedOrderId(null);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button onClick={confirmCancelOrder}>Xác nhận</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderHistory;