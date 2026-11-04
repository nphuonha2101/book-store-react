import { configureStore, combineReducers, AnyAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slice/authSlice";
import cartReducer from "./slice/cartItemSlice";
import wishListReducer from "./slice/wishlistSlice";
import addressReducer from "./slice/addressSlice";
import voucherReducer from "./slice/voucherSlice";
import notificationReducer from "./slice/notificationSlice";
import reviewReducer from "./slice/reviewSlice";
import orderReducer from "./slice/orderSlice";

const combinedReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    wishList: wishListReducer,
    voucher: voucherReducer,
    address: addressReducer,
    notification: notificationReducer,
    review: reviewReducer,
    order: orderReducer,
});

const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
    // Reset every slice to its initial state on logout.
    if (action.type === logout.type) {
        return combinedReducer(undefined, action);
    }
    return combinedReducer(state, action);
};

/**
 * Create a fresh store. A store must never be shared between server requests,
 * so the app creates one per client tree in `Providers`.
 */
export const makeStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActionPaths: ["meta.arg", "payload.timestamp"],
                },
            }),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
