import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store.ts";
import { clearAllCartItems, fetchCartItems } from "../../../redux/slice/cartItemSlice.ts";
import { ShoppingBag, CreditCard, Truck, ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice } from "../../../utils/formatUtils.ts";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription } from "../../ui/alert";
import { Progress } from "../../ui/progress"
import { Address } from "../../../types/ApiResponse/Address/Address.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "../../ui/drawer";
import { PAYMENT_METHOD } from "../../../constants/paymentMethod.ts";
import AuthUtil from "../../../utils/authUtil.ts";

interface OrderRequest {
    userId: number;
    voucherId?: number;
    addressId: number;
    paymentMethod: number;
    phone: string;
    note?: string;
    totalAmount: number;
    totalDiscount: number;
    shippingFee?: number;
    orderItems: {
        bookId: number;
        quantity: number;
        price: number;
    }[]
}

export const Checkout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { items: cartItems, status, error, totalItemsPrice: subtotal, shippingFee } = useSelector((state: RootState) => state.cart);
    const { selectedVoucher, discount } = useSelector((state: RootState) => state.voucher);

    const [step, setStep] = useState<number>(1);
    const [addressInfo, setAddressInfo] = useState<Address>();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("0");
    const [total, setTotal] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);

    useEffect(() => {
        document.title = "Thanh toán";
    }, []);

    // Lấy danh sách sản phẩm trong giỏ hàng khi component được mount
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems());
        } else {
            navigate("/login?continue=/checkout");
            toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
        }
    }, [dispatch, user?.id, navigate]);

    // Lấy danh sách địa chỉ của người dùng
    useEffect(() => {
        if (user?.id) {
            const fetchAddresses = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINTS.ADDRESS.GET_ADDRESS.URL}/${user.id}`, {
                        method: "GET"
                    });
                    const data = await response.json();
                    const addressList: Address[] = data.data || [];
                    setAddresses(addressList);

                    // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
                    if (addressList.length > 0) {
                        // Tìm địa chỉ mặc định
                        const defaultAddress = addressList.find(addr => addr.isDefault);

                        if (defaultAddress) {
                            // Nếu có địa chỉ mặc định, chọn nó
                            setAddressInfo(defaultAddress);
                            setSelectedAddressId(String(defaultAddress.id));
                        } else {
                            // Nếu không có địa chỉ mặc định, chọn địa chỉ đầu tiên
                            setAddressInfo(addressList[0]);
                            setSelectedAddressId(String(addressList[0].id));
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
                }
            };
            fetchAddresses();
        }
    }, [user?.id]); // Thêm user?.id vào dependency để React không cảnh báo


    // Tính tổng thanh toán = subtotal - discount + shippingFee
    useEffect(() => {
        const calculatedTotal = Math.max(0, subtotal - discount) + shippingFee;
        setTotal(calculatedTotal);
    }, [subtotal, discount, shippingFee]);

    // Danh sách phương thức thanh toán
    const paymentMethods = PAYMENT_METHOD.map(method => ({
        ...method,
        id: String(method.id)
    }));

    const handlePaymentMethodSelect = (value: string) => {
        setSelectedPaymentMethod(value);
    };

    const handleContinue = () => {
        if (step === 1 && !addressInfo && addresses.length > 0) {
            toast.error("Vui lòng chọn địa chỉ giao hàng trước khi tiếp tục");
            return;
        }
        setStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống");
            return;
        }
        setIsProcessing(true);

        try {
            const orderRequest: OrderRequest = {
                userId: user?.id || 0,
                voucherId: selectedVoucher?.id || 0,
                addressId: addressInfo?.id || 0,
                paymentMethod: parseInt(selectedPaymentMethod, 10),
                phone: addressInfo?.phone || "",
                note: "",
                totalAmount: total,
                totalDiscount: discount,
                shippingFee: shippingFee,
                orderItems: cartItems.map((item) => ({
                    bookId: item.book?.id || 0,
                    quantity: item.quantity || 1,
                    price: item.book?.price || 0,
                })),
            };

            const response = await callAjaxPlaceOrder(orderRequest);
            const data = await response.json();
            if (data.statusCode === 200) {
                const orderId = data.data?.id;

                // Clear giỏ hàng sau khi đặt hàng thành công
                dispatch(clearAllCartItems());
                toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
                // Chuyển hướng đến trang thành công
                navigate("/order-success/" + orderId, { state: { orderId } });
            } else {
                throw new Error(data.message || "Đặt hàng không thành công");
            }


        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
        } finally {
            setIsProcessing(false);
        }
    };

    const callAjaxPlaceOrder = async (orderRequest: OrderRequest) => {
        try {
            const response = await fetch(API_ENDPOINTS.ORDER.PLACE_ORDER.URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AuthUtil.getToken()}`,
                },
                body: JSON.stringify(orderRequest),
            });
            return response;
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        }
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
                        <Progress value={66} className="w-full" />
                        <p className="text-center text-muted-foreground">Đang tải thông tin đơn hàng...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === "failed" && error) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">Có lỗi xảy ra</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>
                                Lỗi tải thông tin đơn hàng: {error}
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-center mt-6">
                            <Button asChild>
                                <Link to="/cart">Quay lại giỏ hàng</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
                <Card className="max-w-3xl w-full">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl">Giỏ hàng của bạn đang trống</CardTitle>
                        <CardDescription className="text-lg">
                            Thêm mặt hàng vào giỏ hàng để tiếp tục thanh toán
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button asChild size="lg">
                            <Link to="/">Tiếp tục mua hàng</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10">Thanh toán</h1>

            {/* Progress bar */}
            <div className="mb-10">
                <Progress value={progressValue} className="h-2" />
                <div className="flex justify-between mt-2">
                    <div className="text-center">
                        <Badge variant={step >= 1 ? "default" : "outline"} className="mb-2">1</Badge>
                        <p className="text-sm font-medium">Địa chỉ</p>
                    </div>
                    <div className="text-center">
                        <Badge variant={step >= 2 ? "default" : "outline"} className="mb-2">2</Badge>
                        <p className="text-sm font-medium">Thanh toán</p>
                    </div>
                    <div className="text-center">
                        <Badge variant={step >= 3 ? "default" : "outline"} className="mb-2">3</Badge>
                        <p className="text-sm font-medium">Xác nhận</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    {/* Bước 1: Thông tin giao hàng */}
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin giao hàng</CardTitle>
                                <CardDescription>Danh sách sản phẩm trong giỏ hàng của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-sm text-muted-foreground">
                                                <th className="pb-2 font-medium text-left">Sản phẩm</th>
                                                <th className="pb-2 font-medium text-right">Đơn giá</th>
                                                <th className="pb-2 font-medium text-right">Số lượng</th>
                                                <th className="pb-2 font-medium text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {cartItems.map((item, index) => (
                                                <tr key={item.id ?? index} className="py-4">
                                                    <td className="py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-16 w-16 bg-accent flex-shrink-0 rounded-md overflow-hidden">
                                                                <img
                                                                    src={item.book?.coverImage || "/placeholder-image.jpg"}
                                                                    alt={item.book?.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm line-clamp-2">
                                                                    {item.book?.title || `Sản phẩm #${index + 1}`}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {item.book?.authorName || 'Tác giả không xác định'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {formatPrice(item.book?.price ?? 0)}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="py-4 text-right font-medium">
                                                        {formatPrice((item.book?.price ?? 0) * (item.quantity ?? 1))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 space-y-2">
                                    {addresses.length > 0 ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full flex justify-between items-center h-auto py-3"
                                                onClick={() => setOpenDrawer(true)}
                                            >
                                                <div className="flex flex-col items-start text-left">
                                                    {addressInfo ? (
                                                        <>
                                                            <span className="font-medium">{addressInfo.fullName} • {addressInfo.phone}</span>
                                                            <span className="text-sm text-muted-foreground mt-1">
                                                                {addressInfo.addInfo}, {addressInfo.ward}, {addressInfo.district}, {addressInfo.province}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>Chọn địa chỉ giao hàng</span>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                                            </Button>

                                            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                                                <DrawerContent className="max-h-[85vh]">
                                                    <DrawerHeader className="border-b pb-4">
                                                        <DrawerTitle className="text-xl flex items-center">
                                                            <Truck className="mr-2 h-5 w-5" />
                                                            Chọn địa chỉ giao hàng
                                                        </DrawerTitle>
                                                    </DrawerHeader>
                                                    <div className="p-4 space-y-4 overflow-y-auto">
                                                        {addresses.map((address) => (
                                                            <div
                                                                key={address.id}
                                                                className={`relative border rounded-lg p-4 flex flex-col gap-2 cursor-pointer transition-all hover:border-primary ${selectedAddressId === String(address.id) ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                                                                    }`}
                                                                onClick={() => {
                                                                    setAddressInfo(address);
                                                                    setSelectedAddressId(String(address.id));
                                                                    setOpenDrawer(false);
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-base">{address.fullName}</span>
                                                                    {address.isDefault && (
                                                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mr-8">
                                                                            Mặc định
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="font-semibold">SĐT:</span>
                                                                    <span>{address.phone}</span>
                                                                </div>
                                                                <div className="text-sm text-muted-foreground flex gap-2">
                                                                    <span className="flex-shrink-0">Địa chỉ:</span>
                                                                    <span>{address.addInfo}, {address.ward}, {address.district}, {address.province}</span>
                                                                </div>

                                                                {selectedAddressId === String(address.id) && (
                                                                    <div className="absolute bottom-3 right-3">
                                                                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-4 border-t">
                                                        <div className="flex flex-col gap-3">
                                                            <Button variant="outline" asChild className="w-full">
                                                                <Link to="/addresses/add">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                                        <path d="M5 12h14"></path>
                                                                        <path d="M12 5v14"></path>
                                                                    </svg>
                                                                    Thêm địa chỉ mới
                                                                </Link>
                                                            </Button>
                                                            <DrawerClose asChild>
                                                                <Button className="w-full">
                                                                    Xong
                                                                </Button>
                                                            </DrawerClose>
                                                        </div>
                                                    </div>
                                                </DrawerContent>
                                            </Drawer>
                                        </>
                                    ) : (
                                        <>
                                            <Alert variant="default" className="mb-6">
                                                <AlertDescription>Không có địa chỉ nào được lưu trữ. Vui lòng thêm địa chỉ.</AlertDescription>
                                            </Alert>
                                            <Button variant="link" asChild className="mt-2">
                                                <Link to="/addresses">Thêm địa chỉ</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={handleContinue}>
                                    Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Bước 2: Phương thức thanh toán */}
                    {step === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Phương thức thanh toán</CardTitle>
                                <CardDescription>Chọn phương thức thanh toán phù hợp với bạn</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedPaymentMethod}
                                    onValueChange={handlePaymentMethodSelect}
                                    className="space-y-4"
                                >
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`flex items-center space-x-2 border rounded-lg p-4 ${selectedPaymentMethod === method.id ? "border-primary bg-accent" : "border-border"
                                                }`}
                                        >
                                            <RadioGroupItem value={method.id} id={method.id} />
                                            <Label
                                                htmlFor={method.id}
                                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                            >
                                                <method.icon className="h-6 w-6 text-primary" />
                                                <div>
                                                    <p className="font-medium">{method.name}</p>
                                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                                </div>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                                </Button>
                                <Button onClick={handleContinue}>
                                    Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Bước 3: Xác nhận đơn hàng */}
                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Xác nhận đơn hàng</CardTitle>
                                <CardDescription>Kiểm tra lại thông tin trước khi đặt hàng</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <Truck className="mr-2 h-5 w-5" /> Thông tin giao hàng
                                    </h3>
                                    <div className="bg-accent p-4 rounded-lg">
                                        <p className="mb-1"><span className="font-medium">Người nhận:</span> {addressInfo?.fullName ?? ''}</p>
                                        <p className="mb-1"><span className="font-medium">Số điện thoại:</span> {addressInfo?.phone ?? ''}</p>
                                        <p className="mb-1"><span className="font-medium">Địa chỉ:</span> {addressInfo?.addInfo ?? ''}, {addressInfo?.ward}, {addressInfo?.district}, {addressInfo?.province}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" /> Phương thức thanh toán
                                    </h3>
                                    <div className="bg-accent p-4 rounded-lg">
                                        {paymentMethods.find(method => method.id === selectedPaymentMethod)?.name || "Chưa chọn phương thức thanh toán"}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <ShoppingBag className="mr-2 h-5 w-5" /> Sản phẩm ({cartItems.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {cartItems.map((item, index) => (
                                            <div key={item.id ?? index} className="flex items-center gap-3 border-b pb-3">
                                                <div className="h-16 w-16 bg-accent flex-shrink-0 rounded-md overflow-hidden">
                                                    <img
                                                        src={item.book?.coverImage || "/api/placeholder/80/80"}
                                                        alt={item.book?.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-medium text-sm">
                                                        {item.book?.title || `Item #${item.id}`}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {formatPrice((item.book?.price ?? 0) * (item.quantity ?? 1))}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                                </Button>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Đặt hàng'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>

                <div className="lg:w-1/3">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>Tổng quan đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tổng số sản phẩm</span>
                                <span>{cartItems.length}</span>
                            </div>

                            {selectedVoucher && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Mã giảm giá</span>
                                    <Badge variant="outline" className="text-green-500 bg-green-50">
                                        {selectedVoucher.code}
                                    </Badge>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tổng sản phẩm</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Giảm giá</span>
                                <span className="text-green-500">-{formatPrice(discount)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Phí vận chuyển</span>
                                <span>{formatPrice(shippingFee)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Tổng thanh toán</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" asChild className="w-full">
                                <Link to="/carts">Quay lại giỏ hàng</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    );
};