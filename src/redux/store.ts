import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartItemSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,

    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
