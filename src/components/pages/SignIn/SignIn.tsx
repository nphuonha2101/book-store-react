import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Logo } from "../../vendor/Logo/Logo";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import Logger from "../../../utils/logger.ts";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store.ts";
import { login } from "../../../redux/slice/authSlice.ts";

export const SignIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const token = searchParams.get("token");
    const continuteTo = searchParams.get("continue");

    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);

    // Handle OAuth2 redirect
    const handleOAuth2Redirect = async () => {
        if (from === "oauth2" && token) {
            try {
                const userResponse = await fetch(API_ENDPOINTS.AUTH.ME.URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                dispatch(login({ user: userResponse.data, token: token }));
                toast.success("Đăng nhập thành công");
                handleRedirectToBeforeLogin();
            } catch (error) {
                Logger.error("OAuth2 redirect error:", error);
                toast.error("Đã có lỗi xảy ra khi đăng nhập");
            }
        }
    };

    // Call the function immediately
    handleOAuth2Redirect();

    const handleRedirectToBeforeLogin = () => {
        if (continuteTo) {
            navigate(continuteTo);
        } else {
            navigate("/");
        }
    }



    const handleLogin = async (email: string, password: string) => {
        const response = await fetch(API_ENDPOINTS.AUTH.SIGN_IN.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then((res) => res.json())
            .catch((error) => {
                throw new Error(error);
            });

        if (!response.success) {
            throw new Error(response.message);
        }
        return response.data;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email === "" || password === "") {
            toast.error("Vui lòng nhập email và mật khẩu");
            return;
        }

        try {
            // Get JWT token
            let userToken;
            try {
                userToken = await handleLogin(email, password);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toast.error(errorMessage);
                return;
            }

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
                dispatch(login({ user: userResponse.data, token: userToken }));
                toast.success("Đăng nhập thành công");
                handleRedirectToBeforeLogin();
                return;
            }
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
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Quên mật khẩu?
                                </Link>
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
                        Chưa phải là thành viên{" "}
                        <Link to="/signup" className="text-red-500 hover:underline">
                            Tạo tài khoản
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};