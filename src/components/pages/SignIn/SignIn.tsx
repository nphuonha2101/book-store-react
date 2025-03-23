import { useState } from "react";
import { Button } from "../../../shadcn-components/ui/button";
import { Input } from "../../../shadcn-components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Label } from "../../../shadcn-components/ui/label";
import { Separator } from "../../../shadcn-components/ui/separator";
import { Facebook, Twitter, Mail } from "lucide-react";

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-full max-w-[160px] mb-6">
                        <img
                            src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
                            alt="logo"
                            className="w-full"
                        />
                    </div>
                    <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a href="/#" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" size="icon" className="bg-[#4064AC] hover:bg-[#4064AC]/90 text-white">
                            <Facebook className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="bg-[#1C9CEA] hover:bg-[#1C9CEA]/90 text-white">
                            <Twitter className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="bg-[#D64937] hover:bg-[#D64937]/90 text-white">
                            <Mail className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-1 mt-2">
                    <div className="text-center text-sm">
                        Not a member yet?{" "}
                        <a href="/#" className="text-primary hover:underline">
                            Sign Up
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};