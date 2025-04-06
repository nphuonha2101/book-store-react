import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import usePost from "../../../hooks/usePost.ts";
import { API_ENDPOINTS } from "../../../constants/ApiInfo.ts";
import Logger from "../../../log/logger";
import { Logo } from "../../vendor/Logo/Logo.tsx";
import { Input } from "../../../shadcn-components/ui/input.tsx";
import { Button } from "../../../shadcn-components/ui/button.tsx";
import { Separator } from "../../../shadcn-components/ui/separator.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shadcn-components/ui/form";

// Định nghĩa schema validation với Zod
const signUpSchema = z.object({
    email: z.string()
        .min(1, { message: "Email không được để trống" })
        .email({ message: "Email không hợp lệ" }),
    name: z.string()
        .min(1, { message: "Tên không được để trống" })
        .max(50, { message: "Tên không được quá 50 ký tự" }),
    password: z.string()
        .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirmPassword: z.string()
        .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

// Định nghĩa kiểu dữ liệu từ schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUp = () => {
    const { postData } = usePost<{ email: string; password: string, name: string }, string>(API_ENDPOINTS.AUTH.SIGN_UP.URL);
    const navigate = useNavigate();

    // Khởi tạo form với react-hook-form và zod resolver
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleSubmit = async (values: SignUpFormValues) => {
        try {
            // Chuẩn bị dữ liệu đăng ký
            const userData = {
                email: values.email,
                password: values.password,
                name: values.name.trim(),
            };

            console.log('Signup Payload:', userData);

            // Gửi yêu cầu đăng ký
            const user = await postData(userData);
            if (!user) {
                toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
                return;
            }

            toast.success("Đăng ký thành công");
            navigate("/signin", { replace: true });
            return;
        } catch (error) {
            Logger.error("Đăng ký thất bại", error);
            toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-full max-w-[160px] mb-6 flex items-center justify-center">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Đăng ký</CardTitle>
                    <CardDescription>Đăng ký tài khoản mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@example.com"
                                                type="email"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đăng ký</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nguyễn Văn A"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nhập lại mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    <div>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full flex items-center gap-3 
                      bg-white hover:bg-gray-50 
                      border-gray-300 hover:border-gray-400
                      text-gray-700 hover:text-gray-900
                      transition-all duration-200
                      py-6 shadow-sm"
                            onClick={() => window.open(API_ENDPOINTS.AUTH.OAUTH2.GOOGLE.URL, "_blank")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span className="font-medium">Đăng nhập với Google</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-1 mt-2">
                    <div className="text-center text-sm">
                        Bạn đã có tài khoản {" "}
                        <Link to="/signin" className="text-red-500 hover:underline">
                            Đăng nhập ở đây
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};