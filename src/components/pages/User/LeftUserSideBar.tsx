import { Separator } from "@radix-ui/react-dropdown-menu"
import { Menu, X, User, Shield, BellRing, LogOut } from "lucide-react"
import { Button } from "../../ui/button"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/store"
import { logout } from "../../../redux/slice/authSlice"

export const LeftUserSideBar = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dispatch = useDispatch<AppDispatch>();


    const handleLogout = () => {
        dispatch(logout())
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const navigationItems = [
        { to: "/profile", icon: <User size={16} className="mr-2" />, label: "Thông tin cá nhân" },
        { to: "/addresses", icon: <Shield size={16} className="mr-2" />, label: "Địa chỉ người dùng" },
        { to: "/notifications", icon: <BellRing size={16} className="mr-2" />, label: "Thông báo" },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex flex-col overflow-y-auto items-center space-y-2 sm:space-y-3 mb-4 sm:mb-8 pt-2 sm:pt-4">
                <div className="relative cursor-pointer group">
                    <div className="w-36 h-36 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all overflow-hidden relative">
                        {user && user.avatar ? (
                            <img
                                src={user && user.avatar}
                                alt={user?.name || 'Người dùng'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-800 text-xl">
                                {getInitials(user?.name || 'Người dùng')}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-sm sm:text-base font-medium">{user?.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>

            <Separator className="my-2 sm:my-4" />

            {/* Navigation tabs */}
            <nav className="space-y-1">
                {navigationItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors ${isActive
                                ? 'bg-[#2e2e2e] font-medium text-white'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-4 sm:pt-6">
                <Separator className="my-2 sm:my-4" />
                <Button
                    onClick={() => handleLogout}
                    variant="ghost"
                    className="w-full text-xs sm:text-sm justify-start gap-2 sm:gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Trigger - Hidden on larger screens */}
            <div className="md:hidden sticky top-4 left-4 z-20">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            {/* Mobile Sidebar with Slide Animation */}
            <div
                className={`
                    h-fit
                    fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg 
                    transform transition-transform duration-300 ease-in-out 
                    m-4 rounded-md p-2 border-2 box-border
                    border-gray-200 overflow-y-auto
                    md:hidden
                    ${isMobileMenuOpen ? 'translate-x-0 top-15' : '-translate-x-full top-15'}
                `}
            >
                <SidebarContent />
            </div>

            {/* Backdrop for Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-9 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar - Hidden on smaller screens */}
            <div className="hidden md:block rounded-md w-64 bg-white border border-gray-200 p-4 h-fit">
                <SidebarContent />
            </div>
        </>
    )
}