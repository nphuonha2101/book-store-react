import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card.tsx";
import {Input} from "../../ui/input.tsx";
import {API_ENDPOINTS} from "../../../constants/apiInfo.ts";
import {Label} from "../../ui/label.tsx";
import {Button} from "../../ui/button.tsx";
import {Loader2} from "lucide-react";
import {Link} from "react-router-dom";


const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .email({ message: "Vui lòng nhập email hợp lệ" })
        .min(1, { message: "Email không được để trống" }),
});

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPassword = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInputs>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordInputs) => {
        try {
            console.log("API URL:", API_ENDPOINTS.AUTH.FORGOT_PASSWORD.URL); // Debug
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5 giây

            const response = await fetch(`${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 400) {
                    throw new Error("Email không tồn tại trong hệ thống.");
                }
                throw new Error(result.message || "Không thể xử lý yêu cầu quên mật khẩu");
            }

            toast.success("Yêu cầu quên mật khẩu thành công. Vui lòng kiểm tra email của bạn!");
        } catch (error: unknown) {
            console.error("Forgot password error:", error);
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    toast.error("Yêu cầu đã hết thời gian. Vui lòng kiểm tra kết nối và thử lại.");
                } else {
                    toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
                }
            } else {
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Quên Mật Khẩu</CardTitle>
                    <CardDescription>
                        Nhập email của bạn để nhận mật khẩu mới qua email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        {errors.email && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Đang gửi...
                                </>
                            ) : (
                                "Gửi yêu cầu"
                            )}
                        </Button>
                        <div className="text-center mt-2">
                            <Link to="/signin" className="text-blue-500 hover:underline">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};