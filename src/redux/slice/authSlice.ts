import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/ApiResponse/User/user.ts";
import AuthUtil from "../../utils/authUtil.ts";
import { deleteFCMToken } from "../../assets/js/firebase-messaging.ts";
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: AuthUtil.getToken() || null,
    isAuthenticated: !!localStorage.getItem("user") && !!AuthUtil.getToken(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            deleteFCMToken();
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("fcmToken");
            localStorage.removeItem("searchTermsHistory");
        },
        refreshUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
});

export const { login, logout, refreshUser } = authSlice.actions;
export default authSlice.reducer;
