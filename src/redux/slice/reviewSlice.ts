import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthUtil from "../../utils/authUtil.ts";
import {API_ENDPOINTS} from "../../constants/apiInfo.ts";
import {Review} from "../../types/ApiResponse/Review/review.ts";


interface ReviewState {
    items: Review[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    totalReviews?: number;
    averageRating?: number;
    pagination: {
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    };
}

const initialState: ReviewState = {
    items: [],
    status: "idle",
    error: null,
    totalReviews: 0,
    averageRating: 0,
    pagination: {
        isFirst: true,
        isLast: false,
        totalPages: 1,
        pageSize: 10,
        currentPage: 0,
        totalElements: 0,
    }
};

export const fetchReviewsMetadataByBookId = createAsyncThunk(
    "review/fetchReviewsMetadataByBookId",
    async (bookId: number, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.REVIEW.METADATA_BY_BOOK.URL}/${bookId}` , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("fetchReviewsMetadataByBookId response:", data);
            if (!data.success || !data.data) {
                throw new Error(data.message || "Không thể lấy danh sách đánh giá");
            }
            return { reviewsMetadata: data.data, bookId };
        } catch (error) {
            console.error("fetchReviewsMetadataByBookId error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addReview = createAsyncThunk(
    "review/addReview",
    async (reviewData: Review, { rejectWithValue }) => {
        try {
            const user = AuthUtil.getUser();
            console.log("Current user in addReview:", user);
            const requestBody = {
                bookId: reviewData.book?.id,
                userId: reviewData.user?.id,
                rating: reviewData.rating,
                comment: reviewData.comment,
            };
            console.log("Calling addReview with URL:", API_ENDPOINTS.REVIEW.ADD_REVIEW.URL);
            console.log("Request body:", requestBody);

            const response = await fetch(API_ENDPOINTS.REVIEW.ADD_REVIEW.URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("addReview response:", data);
            if (!data.success || !data.data) {
                throw new Error(data.message || "Không thể thêm đánh giá");
            }
            const review = data.data;
            return { review, bookId: reviewData.book?.id };
        } catch (error) {
            console.error("addReview error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchReviewsByBookId = createAsyncThunk(
    "review/fetchReviewsByBookId",
    async ({bookId, page = 0} : {page: number; bookId: number}, { rejectWithValue }) => {
        try {
            const user = AuthUtil.getUser();
            console.log("Current user in fetchReviewsByBookId:", user);
            const response = await fetch(`${API_ENDPOINTS.REVIEW.GET_BOOK_REVIEWS.URL}/${bookId}?page=${page}&size=${10}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("fetchReviewsByBookId response:", data);
            if (!data.success || !data.data) {
                throw new Error(data.message || "Không thể lấy danh sách đánh giá");
            }
            const reviews: Review[] = data.data;
            return { reviews, bookId, pagination: data.pagination };
        } catch (error) {
            console.error("fetchReviewsByBookId error:", error);
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
            state.totalReviews = 0;
            state.averageRating = 0;
            state.pagination = {
                isFirst: true,
                isLast: false,
                totalPages: 1,
                pageSize: 10,
                currentPage: 0,
                totalElements: 0,
            };
        },
        temporalUpdateReview: (state, action) => {
            const { reviewId, updatedReview } = action.payload;
            const index = state.items.findIndex((review) => review.id === reviewId);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...updatedReview };
            }

            state.totalReviews = state.items.length;
            state.averageRating = state.items.reduce((sum, review) => sum + (review.rating ?? 0), 0) / state.items.length;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewsByBookId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.reviews;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchReviewsByBookId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(addReview.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items.push(action.payload.review);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(fetchReviewsMetadataByBookId.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchReviewsMetadataByBookId.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.totalReviews = action.payload.reviewsMetadata.reviewCount;
                state.averageRating = action.payload.reviewsMetadata.averageRating;
            })
            .addCase(fetchReviewsMetadataByBookId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { resetReviewState, temporalUpdateReview } = reviewSlice.actions;
export default reviewSlice.reducer;