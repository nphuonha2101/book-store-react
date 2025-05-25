import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Menu, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { Logo } from '../../vendor/Logo/Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { toast } from 'sonner';
import AuthUtil from '../../../utils/authUtil';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCartItems } from "../../../redux/slice/cartItemSlice.ts"; // Đảm bảo bạn đã định nghĩa store
import { logout } from '../../../redux/slice/authSlice.ts';
import { NotificationSheet } from '../../vendor/Notification/NotificationSheet.tsx';

export default function EnhancedEcommerceNavbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.length;

    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập
        setIsUserLoggedIn(AuthUtil.isLogged());

        // Nếu người dùng đã đăng nhập, lấy dữ liệu giỏ hàng
        if (AuthUtil.isLogged() && user?.id) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, user]);

    const handleLogout = () => {
        dispatch(logout());
        setIsUserLoggedIn(false);
        toast.success('Đăng xuất thành công');
        navigate('/');
    };

    return (
        <div className="relative">
            {/* Main Navbar */}
            <nav className="bg-background sticky top-0 z-30 border-b border-border">
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
                                <NavLink to="/" className={({ isActive }) =>
                                    `font-medium text-sm hover:text-primary transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                    }`}>
                                    Trang chủ
                                </NavLink>
                                <NavLink to="/products" className={({ isActive }) =>
                                    `font-medium text-sm hover:text-primary transition-colors ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                    }`}>
                                    Sản phẩm
                                </NavLink>

                                <NavLink to="/contact-us" className={({ isActive }) =>
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

                            {AuthUtil.isLogged() && (<NotificationSheet />)}
                            {/* Dropdown user */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-muted-foreground hover:text-primary">
                                    <User className="h-5 w-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{AuthUtil.getUser() ? `Xin chào ${AuthUtil.getUser().name}` : "Xin chào bạn"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {!isUserLoggedIn ? (
                                        <>
                                            <DropdownMenuItem>
                                                <Link to="/signin">Đăng nhập</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link to="/signup">Đăng ký</Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem>
                                                <NavLink to="/profile" className={({ isActive }) =>
                                                    `w-full block text-sm rounded-md p-1.5 ${isActive
                                                        ? 'font-bold text-primary'
                                                        : 'text-foreground hover:text-primary'
                                                    }`}>
                                                    Hồ sơ
                                                </NavLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <NavLink to="/orders" className={({ isActive }) =>
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