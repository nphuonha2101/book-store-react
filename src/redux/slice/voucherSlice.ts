import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Voucher } from "../../types/ApiResponse/Voucher/voucher";
import { API_ENDPOINTS } from "../../constants/apiInfo.ts";
import AuthUtil from "../../utils/authUtil";
import Logger from "../../log/logger";

interface VoucherState {
    availableVouchers: Voucher[];
    selectedVoucher: Voucher | null;
    discount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: VoucherState = {
    availableVouchers: [],
    selectedVoucher: null,
    discount: 0,
    status: 'idle',
    error: null
};

export const fetchAvailableVouchers = createAsyncThunk(
    'voucher/fetchAvailable',
    async ({ categoryIds, minSpend }: { categoryIds: number[], minSpend: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.VOUCHER.GET_VOUCHERS.URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthUtil.getToken()}`
                },
                body: JSON.stringify({
                    categoryIds,
                    minSpend
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vouchers');
            }

            const data = await response.json();
            return data.data || [];
        } catch (error: unknown) {
            Logger.error("Error fetching vouchers:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vouchers';
            return rejectWithValue(errorMessage);
        }
    }
);

export const applyVoucher = createAsyncThunk(
    'voucher/apply',
    async ({ code, totalPrice }: { code: string | undefined, totalPrice: number }, { rejectWithValue }) => {
        try {
            if (!code) {
                return 0;
            }

            const response = await fetch(API_ENDPOINTS.VOUCHER.APPLY.URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthUtil.getToken()}`
                },
                body: JSON.stringify({
                    code,
                    totalPrice
                })
            });

            if (!response.ok) {
                throw new Error('Failed to apply voucher');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Mã giảm giá không hợp lệ');
            }

            // Trả về giá trị discount
            return data.data || 0;
        } catch (error: unknown) {
            Logger.error("Error applying voucher:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to apply voucher';
            return rejectWithValue(errorMessage);
        }
    }
);

const voucherSlice = createSlice({
    name: 'voucher',
    initialState,
    reducers: {
        selectVoucher: (state, action: PayloadAction<Voucher | null>) => {
            state.selectedVoucher = action.payload;
        },
        clearVoucher: (state) => {
            state.selectedVoucher = null;
            state.discount = 0;
        },
        setDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch vouchers cases
            .addCase(fetchAvailableVouchers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAvailableVouchers.fulfilled, (state, action: PayloadAction<Voucher[]>) => {
                state.status = 'succeeded';
                state.availableVouchers = action.payload;
                state.error = null;
            })
            .addCase(fetchAvailableVouchers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Apply voucher cases
            .addCase(applyVoucher.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(applyVoucher.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.discount = action.payload;
                state.error = null;
            })
            .addCase(applyVoucher.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.discount = 0;
            });
    }
});

export const { selectVoucher, clearVoucher, setDiscount } = voucherSlice.actions;
export default voucherSlice.reducer;