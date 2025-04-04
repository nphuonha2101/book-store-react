// src/features/cart/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../constants/ApiInfo.ts";
import { CartItem } from "../../types/ApiResponse/Cart/cart.ts";

export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.CART.GET_CART.URL}?userId=${userId}`);
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            console.log("API response from fetchCartItems:", data);
            // Truy cập vào data.data thay vì data
            return Array.isArray(data.data) ? data.data : [];
        } catch (error) {
            console.error("fetchCartItems error:", error, { userId });
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (cartItem: CartItem, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.CART.ADD_TO_CART.URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItem),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("addToCart error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ userId, cartItemId }: { userId: string; cartItemId: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.CART.REMOVE_FROM_CART.URL}/${cartItemId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            return cartItemId;
        } catch (error) {
            console.error("removeFromCart error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async (
        { userId, cartItemId, quantity }: { userId: string; cartItemId: number; quantity: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(API_ENDPOINTS.CART.UPDATE_CART.URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, cartItemId, quantity }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            return { cartItemId, quantity };
        } catch (error) {
            console.error("updateCartItem error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

interface CartState {
    items: CartItem[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartState = {
    items: [],
    status: "idle",
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart Items
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                state.status = "succeeded";
                state.items.push(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = "succeeded";
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                // state.status = "loading";
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<{ cartItemId: number; quantity: number }>) => {
                state.status = "succeeded";
                const { cartItemId, quantity } = action.payload;
                const item = state.items.find((i) => i.id === cartItemId);
                if (item) item.quantity = quantity;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;