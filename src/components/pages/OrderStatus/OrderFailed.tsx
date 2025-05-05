import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../ui/card";
import { XCircle } from "lucide-react";
import { Button } from "../../ui/button";

export const OrderFailed = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();

    useEffect(() => {
        document.title = "Đặt hàng thành công";
    }, []);

    return (
        <div className="flex items-center justify-center px-4" >
            < Card className="w-full max-w-md shadow-2xl rounded-2xl p-6 text-center" >
                <CardContent className="space-y-6">
                    <XCircle className="text-red-500 mx-auto w-16 h-16" />
                    <h1 className="text-2xl font-semibold">Đặt hàng thất bại!</h1>
                    <p className="text-muted-foreground">
                        Rất tiếc, đơn hàng của bạn đã không được xử lý thành công. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau.
                        <br /> Nếu bạn cần hỗ trợ, hãy liên hệ với chúng tôi qua trang hỗ trợ khách hàng.
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