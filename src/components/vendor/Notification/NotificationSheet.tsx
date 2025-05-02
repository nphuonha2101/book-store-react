import { Bell, Check, ChevronRight, PackageCheck, PackageX, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { daysUntilNow } from "../../../utils/formatUtils";
import { Skeleton } from "../../ui/skeleton";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../../../redux/slice/notificationSlice";

export const NotificationSheet = () => {
    const [open, setOpen] = useState(false);
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

    // Fetch notifications khi mở sheet
    useEffect(() => {
        if (open && user?.id) {
            setPage(0);
            dispatch(fetchNotifications({ page: 0, size: 5, append: false }));
        }
    }, [dispatch, open, user?.id]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(fetchNotifications({ page: nextPage, size: 5, append: true }));
    };

    const handleMarkAsRead = (notificationId: number) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    const handleMarkAllAsRead = () => {
        if (user?.id) {
            dispatch(markAllNotificationsAsRead(user.id));
        }
    };

    const handleNotificationClick = (notificationId: number, actionUrl: string) => {
        handleMarkAsRead(notificationId);
        setOpen(false);
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
                        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
                    >
                        <Bell className="h-5 w-5 size-5" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-red-500 text-white"
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-4">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        Thông báo
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                                {unreadCount} chưa đọc
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>
                <Separator className="my-2" />

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
                            <div className="space-y-1">
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
                                                    {daysUntilNow(notification.createdAt) === 0
                                                        ? "Hôm nay"
                                                        : `${daysUntilNow(notification.createdAt)} ngày trước`}
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
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};