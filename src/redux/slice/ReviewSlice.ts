import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../constants/apiInfo.ts";
import { Review } from "../../types/Review/review.ts";

interface ReviewState {
    items: Review[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ReviewState = {
    items: [],
    status: "idle",
    error: null,
};

// Lấy danh sách đánh giá theo bookId
export const fetchReviewsByBookId = createAsyncThunk(
    "review/fetchReviewsByBookId",
    async (bookId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.REVIEW.GET_REVIEW.URL}?bookId=${bookId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Giả sử bạn lưu token trong localStorage
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
            console.error("fetchReviewsByBookId error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Thêm đánh giá mới
export const addReview = createAsyncThunk(
    "review/addReview",
    async (reviewItem: Review, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.REVIEW.ADD_REVIEW.URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(reviewItem),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("addReview error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Cập nhật đánh giá
export const updateReview = createAsyncThunk(
    "review/updateReview",
    async (reviewItem: Review, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.REVIEW.UPDATE_REVIEW.URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(reviewItem),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("updateReview error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

// Xóa đánh giá
export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async ({ id }: { id: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.REVIEW.DELETE_REVIEW.URL}?id=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData || response.statusText}`);
            }
            return id;
        } catch (error) {
            console.error("deleteReview error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.items = [];
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewsByBookId.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchReviewsByBookId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(addReview.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items.push(action.payload); // Thêm đánh giá mới vào danh sách
            })
            .addCase(addReview.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(updateReview.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.items.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) {
                    state.items[index] = action.payload; // Cập nhật đánh giá trong danh sách
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(deleteReview.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = state.items.filter(
                    (item) => item.id !== action.payload
                ); // Xóa đánh giá khỏi danh sách
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;