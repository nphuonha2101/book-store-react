import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthUtil from "../../utils/authUtil";
import { API_ENDPOINTS } from "../../constants/apiInfo";
import { Notification } from "../../types/ApiResponse/Notification/notification";

// Lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async ({ page = 0, size = 5, append = false }: { page?: number, size?: number, append?: boolean }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.AUTH.NOTIFICATION.GET.URL}?page=${page}&size=${size}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${AuthUtil.getToken()}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }

            const data = await response.json();
            return { data: data.data, pagination: data.pagination, append };
        } catch (error) {
            console.error("fetchNotifications error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Lấy số lượng thông báo chưa đọc
export const fetchUnreadCount = createAsyncThunk(
    "notification/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.AUTH.NOTIFICATION.UNREAD_COUNT.URL}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${AuthUtil.getToken()}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("fetchUnreadCount error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Đánh dấu một thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
    "notification/markAsRead",
    async (notificationId: number, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.AUTH.NOTIFICATION.READ.URL}/${notificationId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${AuthUtil.getToken()}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }

            return notificationId;
        } catch (error) {
            console.error("markNotificationAsRead error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = createAsyncThunk(
    "notification/markAllAsRead",
    async (rejectWithValue) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.AUTH.NOTIFICATION.READ_ALL.URL}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${AuthUtil.getToken()}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error("markAllNotificationsAsRead error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export interface NotificationState {
    items: Notification[];
    unreadCount: number;
    status: 'idle' | 'loading' | 'loadingMore' | 'succeeded' | 'failed';
    error: string | null;
    pagination: {
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    };
}

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
    pagination: {
        isFirst: true,
        isLast: false,
        totalPages: 1,
        pageSize: 10,
        currentPage: 0,
        totalElements: 0,
    }
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        plusUnreadCount: (state) => {
            state.unreadCount += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetchNotifications
            .addCase(fetchNotifications.pending, (state, action) => {
                // Kiểm tra xem đang fetch trang đầu hay trang tiếp theo
                if (action.meta.arg?.page === 0) {
                    state.status = 'loading';
                } else {
                    state.status = 'loadingMore';
                }
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                const { data, pagination, append } = action.payload;

                // Nếu append = true, giữ lại notifications hiện tại và thêm notifications mới
                if (append) {
                    state.items = [...state.items, ...data];
                } else {
                    state.items = data;
                }

                state.pagination = pagination;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Xử lý fetchUnreadCount
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })

            // Xử lý markNotificationAsRead
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload;
                const notification = state.items.find(item => item.id === notificationId);

                // Chỉ cập nhật unreadCount nếu thông báo chưa đọc trước đó
                if (notification && !notification.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }

                // Đánh dấu thông báo là đã đọc
                state.items = state.items.map(item =>
                    item.id === notificationId ? { ...item, isRead: true } : item
                );
            })

            // Xử lý markAllNotificationsAsRead
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                // Đánh dấu tất cả thông báo là đã đọc
                state.items = state.items.map(item => ({ ...item, isRead: true }));
                state.unreadCount = 0;
            });
    },
});

export const { plusUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;