import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartItemSlice";
import wishListReducer from "./slice/wishlistSlice";
import voucherReducer from "./slice/voucherSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishList: wishListReducer,
        voucher: voucherReducer

    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

