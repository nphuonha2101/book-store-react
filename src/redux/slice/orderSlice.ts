import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../constants/apiInfo.ts";
import { Order } from "../../types/ApiResponse/Order/order.ts";
import {ORDER_STATUS} from "../../constants/orderStatus.ts";

interface OrderState {
    items: Order[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: OrderState = {
    items: [],
    status: "idle",
    error: null,
};

// Lấy danh sách lịch sử đơn hàng
export const fetchOrderHistory = createAsyncThunk(
    "order/fetchOrderHistory",
    async (orderStatus: string | null, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.ORDER.GET_HISTORY.URL}?status=${orderStatus ?? ORDER_STATUS.ALL}`,
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
            return Array.isArray(data.data) ? data.data : [];
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
                state.items = action.payload;
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