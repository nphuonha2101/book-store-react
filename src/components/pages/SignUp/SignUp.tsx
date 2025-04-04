import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import usePost from "../../../hooks/usePost.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import Logger from "../../../log/logger";
import AuthUtil from "../../../utils/authUtil.ts";
import { Logo } from "../../vendor/Logo/Logo.tsx";
import { Label } from "../../../shadcn-components/ui/label.tsx";
import { Input } from "../../../shadcn-components/ui/input.tsx";
import { Button } from "../../../shadcn-components/ui/button.tsx";
import { Separator } from "../../../shadcn-components/ui/separator.tsx";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { postData, response } = usePost<{ email: string; password: string, name: string }, string>(API_ENDPOINTS.AUTH.SIGN_UP.URL);
    const navigate = useNavigate();

    const validatePasswordMatch = () => {
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordError("Mật khẩu không khớp");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const validateForm = () => {
        // Reset password error
        setPasswordError("");

        // Email validation
        if (!email) {
            toast.error("Please enter your email");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Password validation
        if (!password) {
            toast.error("Please enter a password");
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        // Password confirmation validation
        if (!confirmPassword) {
            toast.error("Please confirm your password");
            return false;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form first
        if (!validateForm()) {
            return;
        }

        // Prepare user data payload
        const userData = {
            email,
            password,
            name: name.trim() // Ensure no accidental whitespace
        };

        try {
            // Log the payload being sent for debugging
            console.log('Signup Payload:', userData);

            // Attempt to sign up user
            const userToken = await postData(userData);

            // Debug response
            console.log('Signup Response:', { userToken, response });

            // If token is received
            if (userToken) {
                try {
                    // Fetch user information
                    const userResponse = await fetch(API_ENDPOINTS.AUTH.ME.URL, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    const parsedResponse = await userResponse.json();

                    // More detailed error logging
                    if (!parsedResponse?.success) {
                        console.error('User Fetch Error:', parsedResponse);
                        toast.error(parsedResponse?.message || "Không thể lấy thông tin người dùng");
                        return;
                    }

                    // Login user
                    AuthUtil.login(parsedResponse.data, userToken);

                    toast.success("Đăng ký thành công");
                    navigate("/login");
                } catch (fetchError) {
                    console.error('Fetch User Error:', fetchError);
                    toast.error("Lỗi khi lấy thông tin người dùng");
                }
                return;
            }

            // Handle response errors
            if (response) {
                console.error('Signup Response Error:', response);
                toast.error(response.message || "Đã có lỗi xảy ra trong quá trình đăng ký");
            } else {
                toast.error("Không nhận được phản hồi từ máy chủ");
            }

        } catch (error) {
            // More detailed error logging
            console.error('Signup Catch Error:', error);

            // Try to extract more meaningful error message
            const errorMessage = error instanceof Error
                ? error.message
                : "Đã có lỗi xảy ra khi đăng ký";

            toast.error(errorMessage);
            Logger.error("Sign up error:", error);
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
                            <Label htmlFor="name">Tên đăng ký</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={validatePasswordMatch}
                                className={passwordError ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {passwordError && (
                                <p className="text-xs text-destructive mt-1">{passwordError}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Đăng ký
                        </Button>
                    </form>

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