import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import Logger from "../../../log/logger";
import { Logo } from "../../vendor/Logo/Logo.tsx";
import { Input } from "../../../shadcn-components/ui/input";
import { Button } from "../../../shadcn-components/ui/button";
import { Separator } from "../../../shadcn-components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shadcn-components/ui/form";

const signUpSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    name: z.string().min(1, "Vui lòng nhập tên"),
    password: z.string().min(8, "Mật khẩu phải ít nhất 8 ký tự"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"]
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUp = () => {
    const navigate = useNavigate();

    // Initialize form
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: ""
        }
    });

    // Handle sign up
    const handleSignUp = async (userData : object) => {
        const response = await fetch(API_ENDPOINTS.AUTH.SIGN_UP.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }).then(res => res.json());

        if (!response.success) {
            throw new Error(response.message);
        }
        return response.data;
    }


    const handleSubmit = async (values: SignUpFormValues) => {
        try {
            // Prepare user data payload
            const userData = {
                email: values.email,
                password: values.password,
                name: values.name.trim()
            };

            console.log('Signup Payload:', userData);

            // Attempt to sign up user
            const user = await handleSignUp(userData);

            if (user) {
                toast.success("Đăng ký thành công");
                setTimeout(() => {
                    navigate("/signin");
                }, 1000);
            }

            
        } catch (error) {
            console.error('Signup Catch Error:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : "Đã có lỗi xảy ra khi đăng ký";
            toast.error(errorMessage);
            Logger.error("Đăng ký lỗi:", error);
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
                                                type="text"
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
                                                placeholder="••••••••"
                                                type="password"
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
                                                placeholder="••••••••"
                                                type="password"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Đăng ký
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

                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" size="icon" className="bg-[#D64937] hover:bg-[#D64937]/90 text-white">
                            <Mail className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-1 mt-2"></CardFooter>
                <div className="text-center text-sm">
                    <CardFooter className="flex flex-col space-y-1 mt-2">
                        <div className="text-center text-sm">
                            Bạn đã có tài khoản {" "}
                            <Link to="/signin" className="text-red-500 hover:underline">
                                Đăng nhập ở đây
                            </Link>
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};
