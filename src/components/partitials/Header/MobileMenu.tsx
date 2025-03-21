import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileMenu({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (value: boolean) => void }) {
    return (
        <>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ShopNow
                </span>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-6">
                <div className="space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-600">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                        Sản phẩm
                    </Link>
                    <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                        Danh mục
                    </Link>
                    <Link to="/contact-us" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                        Liên hệ
                    </Link>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                            Tài khoản
                        </a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                            Yêu thích
                        </a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                            Thông báo
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 p-4">
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors">
                    Đăng nhập / Đăng ký
                </button>
            </div>
        </>
    )
}