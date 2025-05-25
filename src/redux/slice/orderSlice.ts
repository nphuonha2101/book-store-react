import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../constants/apiInfo.ts";
import { Order } from "../../types/ApiResponse/Order/order.ts";
import { ORDER_STATUS } from "../../constants/orderStatus.ts";

interface OrderState {
    items: Order[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    pagination: {
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    } | null;
}

const initialState: OrderState = {
    items: [],
    status: "idle",
    error: null,
    pagination: null,
};

// Lấy danh sách lịch sử đơn hàng
export const fetchOrderHistory = createAsyncThunk(
    "order/fetchOrderHistory",
    async ({ status, page = 0, size = 10 }: { status: string | null, page?: number, size?: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.ORDER.GET_HISTORY.URL}?status=${status ?? ORDER_STATUS.ALL}&page=${page}&size=${size}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            console.log("API Response:", data); // Debug log

            return {
                content: Array.isArray(data.data) ? data.data : [],
                currentPage: data.pagination?.currentPage ?? page,
                totalPages: data.pagination?.totalPages ?? 1,
                totalElements: data.pagination?.totalElements ?? 0,
                isFirst: data.pagination?.isFirst ?? (page === 0),
                isLast: data.pagination?.isLast ?? true,
                pageSize: data.pagination?.pageSize ?? size, // Đảm bảo trả về pageSize thay vì size
            };
        } catch (error) {
            console.error("fetchOrderHistory error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);
export const cancelOrder = createAsyncThunk(
    "order/cancelOrder",
    async ({ orderId, cancellationReason }: { orderId: number; cancellationReason: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.ORDER.CANCLE_ORDER.URL}?orderId=${orderId}&cancellationReason=${encodeURIComponent(cancellationReason)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            return orderId;
        } catch (error) {
            console.error("cancelOrder error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderHistory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    isFirst: action.payload.isFirst,
                    isLast: action.payload.isLast,
                    pageSize: action.payload.pageSize,
                };
            })
            .addCase(fetchOrderHistory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.status = "loading";
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;