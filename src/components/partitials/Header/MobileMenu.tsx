import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../../vendor/Logo/Logo";
import { User } from "../../../types/ApiResponse/User/user";
import { useEffect, useState } from "react";
import AuthUtil from "../../../utils/authUtil";

export default function MobileMenu({ setIsMobileMenuOpen, handleLogout }: { setIsMobileMenuOpen: (value: boolean) => void, handleLogout: () => void }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        setIsUserLoggedIn(AuthUtil.isLogged());
        setUser(AuthUtil.getUser());
    }, []);

    return (
        <>
            <div className="z-50 flex items-center justify-between h-16 px-6 border-b border-border">
                <Logo />
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-6">
                <div className="space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium bg-secondary text-primary">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        Sản phẩm
                    </Link>
                    <Link to="/contact-us" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        Liên hệ
                    </Link>
                    <div className="border-t border-border mt-4 pt-4">
                        <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                            Tài khoản
                        </Link>
                        <Link to="/wishlists" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                            Yêu thích
                        </Link>
                        <Link to="/notifications" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors">
                            Thông báo
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-border p-4">
                {isUserLoggedIn ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 px-3 py-2">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user?.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-sm text-muted-foreground">{user?.email}</div>
                            </div>
                        </div>
                        <Link
                            to="/profile"
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                        >
                            Quản lý tài khoản
                        </Link>
                        <Link
                            to="/orders"
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                        >
                            Đơn hàng của tôi
                        </Link>
                        <button
                            onClick={() => handleLogout()}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link
                            to="/signin"
                            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/signup"
                            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium border border-primary text-primary hover:bg-primary/10 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}