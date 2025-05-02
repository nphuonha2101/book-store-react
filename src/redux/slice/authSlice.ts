import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/ApiResponse/User/user.ts";
import AuthUtil from "../../utils/authUtil.ts";
interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: AuthUtil.getToken() || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("fcmToken");
        },
        refreshUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        }
    },
});

export const { login, logout, refreshUser } = authSlice.actions;
export default authSlice.reducer;
