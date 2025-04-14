import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartItemSlice";
import wishListReducer from "./slice/wishlistSlice";
import addressReducer from "./slice/addressSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishList: wishListReducer,
        address: addressReducer,

    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
