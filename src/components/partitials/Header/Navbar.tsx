import { useState } from 'react';
import { Search, ShoppingCart, Menu, User, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

export default function EnhancedEcommerceNavbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(3);

    return (
        <div className="relative">
            {/* Main Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ShopNow
                                </span>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <Link to="/" className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                Trang chủ
                            </Link>
                            <Link to="/products" className="text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                Sản phẩm
                            </Link>
                            <Link to="/categories" className="text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                Danh mục
                            </Link>
                            <Link to="/contact-us" className="text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                Liên hệ
                            </Link>
                        </div>

                        {/* Nav Icons */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <button className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors hidden md:block"
                                aria-label="Wishlist">
                                <Heart className="h-5 w-5" />
                            </button>

                            <button className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors hidden md:block"
                                aria-label="Notifications">
                                <Bell className="h-5 w-5" />
                            </button>

                            <button className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Account">
                                <User className="h-5 w-5" />
                            </button>

                            <div className="relative">
                                <button
                                    className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Shopping cart"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white shadow-xl transform transition-all duration-300 ease-in-out"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center"
                    >
                        <SearchBar setIsSearchOpen={setIsSearchOpen} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}