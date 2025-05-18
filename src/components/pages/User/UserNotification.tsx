import { Bell, Check, ChevronRight, Loader2, PackageCheck, PackageX, ShoppingBag } from "lucide-react";
import { Button } from "../../ui/button";
import { diffTimeUtilNow } from "../../../utils/formatUtils";
import { fetchNotifications, fetchUnreadCount, markAllNotificationsAsRead, markNotificationAsRead } from "../../../redux/slice/notificationSlice";
import { Skeleton } from "../../ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { LeftUserSideBar } from "./LeftUserSideBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

export const UserNotification = () => {
    const [page, setPage] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const {
        items: notifications,
        status,
        error,
        unreadCount,
        pagination
    } = useSelector((state: RootState) => state.notification);

    // Fetch unread count khi component mount
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUnreadCount());
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (user?.id) {
            setPage(0);
            dispatch(fetchNotifications({ page: 0, size: 5, append: false }));
        }
    }, [dispatch, user?.id]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(fetchNotifications({ page: nextPage, size: 5, append: true }));
    };

    const handleMarkAsRead = (notificationId: number) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    const handleMarkAllAsRead = () => {
        if (user?.id && unreadCount > 0) {
            dispatch(markAllNotificationsAsRead());
        }
    };

    const handleNotificationClick = (notificationId: number, actionUrl: string) => {
        handleMarkAsRead(notificationId);
        navigate(actionUrl);
    };

    const getNotificationIcon = (title: string) => {
        if (title.includes("đã bị huỷ")) return <PackageX className="text-red-500" />;
        if (title.includes("đã được giao")) return <PackageCheck className="text-green-500" />;
        if (title.includes("đang được giao")) return <ShoppingBag className="text-blue-500" />;
        return <Bell className="text-amber-500" />;
    };

    // Kiểm tra xem còn thông báo để load không
    const hasMore = !pagination.isLast;
    const isLoading = status === 'loading';
    const isLoadingMore = status === 'loadingMore';

    return (
        <div className="flex bg-gray-50">
            {/* Left sidebar */}
            <LeftUserSideBar />

            {/* Main content */}
            <div className="flex-1 pl-8 pr-4">
                <Card className="shadow-lg">
                    <CardHeader className="pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Thông báo của bạn</CardTitle>
                            <CardDescription>
                                Các thông báo mới nhất sẽ được hiển thị ở đây. Bạn có thể đánh dấu tất cả đã đọc hoặc xem thêm thông báo.
                            </CardDescription>
                        </div>
                        <div className="flex items-center justify-end">
                            {unreadCount > 0 && (
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={handleMarkAllAsRead}
                                    >
                                        <Check className="h-4 w-4" /> Đánh dấu tất cả đã đọc
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <div className="space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                        {isLoading ? (
                            // Skeleton loading
                            Array(3).fill(0).map((_, index) => (
                                <div key={index} className="flex gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="text-center text-muted-foreground py-8">
                                <p>{error}</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setPage(0);
                                        dispatch(fetchNotifications({ page: 0, size: 5, append: false }));
                                    }}
                                    className="mt-2"
                                >
                                    Thử lại
                                </Button>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <p>Không có thông báo nào.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1 px-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                                            className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors
                                            ${notification.isRead ? 'hover:bg-accent' : 'bg-accent hover:bg-accent/80'}`}
                                        >
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-accent-foreground/10">
                                                {getNotificationIcon(notification.title)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <h4 className={`text-sm font-medium line-clamp-1 ${notification.isRead ? '' : 'font-semibold'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <div className="h-2 w-2 rounded-full bg-primary mt-1 ml-2"></div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                                    {notification.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {diffTimeUtilNow(notification.createdAt)}
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="pt-2 pb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            disabled={isLoadingMore}
                                            onClick={loadMore}
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Đang tải...
                                                </>
                                            ) : (
                                                <>Xem thêm ({pagination.totalElements - notifications.length} thông báo)</>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}