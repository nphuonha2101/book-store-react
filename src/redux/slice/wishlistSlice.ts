import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {API_ENDPOINTS} from "../../constants/ApiInfo.ts";
import {WishList} from "../../types/WishList/wishList.ts";

interface WishlistState {
    items: WishList[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    status: "idle",
    error: null,
};

export const fetchWishlistItems = createAsyncThunk(
    "wishlist/fetchWishlistItems",
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.WISHLIST.GET_WISHLIST.URL}?userId=${userId}`);
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            return Array.isArray(data.data) ? data.data : [];
        } catch (error) {
            console.error("fetchWishlistItems error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (wishlistItem: WishList, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.WISHLIST.ADD_TO_WISHLIST.URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(wishlistItem),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("addToWishlist error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async ({ userId, bookId }: { userId: number; bookId: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST.URL}?userId=${userId}&bookId=${bookId}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            return bookId;
        } catch (error) {
            console.error("removeFromWishlist error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlistItems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWishlistItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchWishlistItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(addToWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items.push(action.payload); // Đảm bảo thêm item mới vào danh sách
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(removeFromWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = state.items.filter((item) => item.book?.id !== action.payload); // Đảm bảo xóa item khỏi danh sách
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default wishlistSlice.reducer;