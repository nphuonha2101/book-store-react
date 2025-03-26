import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import usePost from "../../../hooks/usePost.ts";
import {API_ENDPOINTS} from "../../../constants/apiInfo.ts";
import Logger from "../../../log/logger";
import AuthUtil from "../../../utils/authUtil.ts";
import {Logo} from "../../vendor/Logo/Logo.tsx";
import {Label} from "../../../shadcn-components/ui/label.tsx";
import {Input} from "../../../shadcn-components/ui/input.tsx";
import {Button} from "../../../../components/ui/button.tsx";
import {Separator} from "../../../shadcn-components/ui/separator.tsx";

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

                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" size="icon" className="bg-[#D64937] hover:bg-[#D64937]/90 text-white">
                            <Mail className="h-5 w-5" />
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