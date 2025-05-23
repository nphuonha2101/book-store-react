import { CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { clearAllCartItems } from "../../../redux/slice/cartItemSlice";

export const OrderSuccess = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        document.title = "Đặt hàng thành công";
        dispatch(clearAllCartItems());
    }, []);

    return (
        <div className="flex items-center justify-center px-4" >
            < Card className="w-full max-w-md shadow-2xl rounded-2xl p-6 text-center" >
                <CardContent className="space-y-6">
                    <CheckCircle2 className="text-green-500 mx-auto w-16 h-16" />
                    <h1 className="text-2xl font-semibold">Đặt hàng thành công!</h1>
                    <p className="text-muted-foreground">
                        Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi! Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                        <br /> Bạn có thể kiểm tra trạng thái đơn hàng của mình trong phần "Đơn hàng của tôi".
                    </p>

                    <div className="space-y-2">
                        <Button
                            className="w-full"
                            onClick={() => navigate("/")}
                        >
                            Về trang chủ
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate("/orders/" + orderId)}
                        >
                            Xem đơn hàng của bạn
                        </Button>
                    </div>
                </CardContent>
            </Card >
        </div >
    );
}
