import { useState } from "react";
import { Button } from "../../../shadcn-components/ui/button";
import { Input } from "../../../shadcn-components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Label } from "../../../shadcn-components/ui/label";
import { Separator } from "../../../shadcn-components/ui/separator";
import { Mail } from "lucide-react";
import { Logo } from "../../vendor/Logo/Logo";
import { toast } from "react-toastify";
import usePost from "../../../hooks/usePost";
import { API_ENDPOINTS } from "../../../constants/apiInfo";
import Logger from "../../../log/logger";
import { useNavigate } from "react-router-dom";
import AuthUtil from "../../../utils/authUtil";

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { postData, response } = usePost<{ email: string, password: string }, string>(API_ENDPOINTS.AUTH.SIGN_IN.URL);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email === "" || password === "") {
            toast.error("Vui lòng nhập email và mật khẩu");
            return;
        }

        try {
            // Get JWT token
            const userToken = await postData({ email, password });
            // Get user info if we have a token
            if (userToken) {
                const userResponse = await fetch(API_ENDPOINTS.AUTH.ME.URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }).then((res) => res.json())
                    .catch((error) => {
                        Logger.error("Fetch user error:", error);
                        return null;
                    });
                if (!userResponse.success) {
                    toast.error("Đã có lỗi xảy ra khi lấy thông tin người dùng");
                    return;
                }
                // Save user info and token to local storage
                AuthUtil.login(userResponse.data, userToken);
                toast.success("Đăng nhập thành công");
                navigate("/");
                return;
            }

            // If we get here and don't have a token but the response is successful
            if (response?.success) {
                toast.success("Đăng nhập thành công");
                navigate("/");
                return;
            }

            // Show error if we have a response with an error message
            toast.error(response?.message || "Đã có lỗi xảy ra");
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi đăng nhập");
            Logger.error("Sign in error:", error);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-full max-w-[160px] mb-6 flex items-center justify-center">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Đăng nhập</CardTitle>
                    <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <a href="/#" className="text-sm text-primary hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Đăng nhập
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Hoặc đăng nhập bằng
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">

                        <Button variant="outline" size="icon" className="bg-[#D64937] hover:bg-[#D64937]/90 text-white">
                            <Mail className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-1 mt-2">
                    <div className="text-center text-sm">
                        Chưa phải là thành viên{" "}
                        <a href="/signup" className="text-primary hover:underline">
                            Tạo tài khoản
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};