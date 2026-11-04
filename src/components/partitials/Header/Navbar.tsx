"use client";

import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Menu, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import Link from "next/link";
import { NavLink } from "@/components/nav-link";
import { useNavigate } from "@/lib/use-navigate";
import MobileMenu from './MobileMenu';
import { Logo } from '../../vendor/Logo/Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCartItems } from "../../../redux/slice/cartItemSlice.ts";
import { logout } from '../../../redux/slice/authSlice.ts';
import { NotificationSheet } from '../../vendor/Notification/NotificationSheet.tsx';
import { deleteFCMToken } from '../../../assets/js/firebase-messaging.ts';

export default function EnhancedEcommerceNavbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.length;

    const { user, isAuthenticated, hydrated } = useSelector((state: RootState) => state.auth);
    // Auth-dependent markup is only rendered after the component has mounted on
    // the client. The first client render must match the server HTML exactly.
    const [mounted, setMounted] = useState(false);
    const signedIn = mounted && hydrated && isAuthenticated;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Nếu người dùng đã đăng nhập, lấy dữ liệu giỏ hàng
        if (signedIn && user?.id) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, user?.id, signedIn]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        void deleteFCMToken();
        dispatch(logout());
        toast.success('Đăng xuất thành công');
        navigate('/');
    }; return (
        <div className="w-full">
            {/* Main Navbar */}
            <nav className={`bg-background/85 backdrop-blur-sm fixed ${isScrolled ? 'max-w-[95%] mx-auto left-0 right-0 mt-2 rounded-lg shadow-md' : 'w-full'} top-0 z-40 border-b ${isScrolled ? 'border-transparent' : 'border-border/40'} transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                                <Logo />
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <div className="flex space-x-8">
                                <NavLink href="/" className={({ isActive }) =>
                                    `font-medium text-sm hover:text-primary transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                    }`}>
                                    Trang chủ
                                </NavLink>
                                <NavLink href="/products" className={({ isActive }) =>
                                    `font-medium text-sm hover:text-primary transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                    }`}>
                                    Sản phẩm
                                </NavLink>

                                <NavLink href="/contact-us" className={({ isActive }) =>
                                    `font-medium text-sm hover:text-primary transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                    }`}>
                                    Liên hệ
                                </NavLink>
                            </div>
                        </div>

                        {/* Nav Icons */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <button onClick={() => navigate('/wishlists')}
                                className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors hidden md:block"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-5 w-5" />
                            </button>

                            {signedIn && (<NotificationSheet />)}
                            {/* Dropdown user */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-muted-foreground hover:text-primary">
                                    <User className="h-5 w-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{signedIn && user ? `Xin chào ${user.name}` : "Xin chào bạn"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {!signedIn ? (
                                        <>
                                            <DropdownMenuItem>
                                                <Link href="/signin">Đăng nhập</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href="/signup">Đăng ký</Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem>
                                                <NavLink href="/profile" className={({ isActive }) =>
                                                    `w-full block text-sm rounded-md p-1.5 ${isActive
                                                        ? 'font-bold text-primary'
                                                        : 'text-foreground hover:text-primary'
                                                    }`}>
                                                    Hồ sơ
                                                </NavLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <NavLink href="/orders" className={({ isActive }) =>
                                                    `w-full block text-sm rounded-md p-1.5 ${isActive
                                                        ? 'font-bold text-primary'
                                                        : 'text-foreground hover:text-primary'
                                                    }`}>
                                                    Đơn hàng
                                                </NavLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full block text-sm text-start rounded-md p-1.5 text-foreground hover:text-primary hover:bg-secondary/50">
                                                    Đăng xuất
                                                </button>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* End dropdown user */}

                            <div className="relative">
                                <button
                                    onClick={() => navigate('/carts')}
                                    className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
                                    aria-label="Shopping cart"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-destructive text-xs text-white font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm z-10">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav >

            {/* Mobile Menu */}
            <AnimatePresence>
                {
                    isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <motion.div
                                className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-background shadow-lg transform transition-all duration-300 ease-in-out"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout} />
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Search Modal */}
            <AnimatePresence>
                {
                    isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                        >
                            <SearchBar setIsSearchOpen={setIsSearchOpen} />
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}