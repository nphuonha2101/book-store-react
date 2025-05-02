import { configureStore, combineReducers, AnyAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slice/authSlice";
import cartReducer from "./slice/cartItemSlice";
import wishListReducer from "./slice/wishlistSlice";
import addressReducer from "./slice/addressSlice";
import voucherReducer from "./slice/voucherSlice";
import reviewReducer from "./slice/ReviewSlice.ts";
import orderReducer from "./slice/orderSlice";

const combinedReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    wishList: wishListReducer,
    voucher: voucherReducer,
    address: addressReducer,
    review: reviewReducer,
    order: orderReducer,
});

const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
    // Reset các state khi logout
    // Redux tự khởi tạo các initial state cho các slice nếu state là undefined
    if (action.type === logout.type) {
        return combinedReducer(undefined, action);
    }
    // Giữ nguyên state cũ nếu không có action logout
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;