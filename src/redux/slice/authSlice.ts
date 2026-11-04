import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/ApiResponse/User/user";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    /** True once the client has read persisted auth data from localStorage. */
    hydrated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    hydrated: false,
};

const readStoredUser = (): User | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
};

const persist = (user: User | null, token: string | null) => {
    if (typeof window === "undefined") return;
    try {
        if (user && token) {
            window.localStorage.setItem("user", JSON.stringify(user));
            window.localStorage.setItem("token", token);
        } else {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("fcmToken");
            window.localStorage.removeItem("searchTermsHistory");
        }
    } catch {
        // Storage can be unavailable (private mode, quota); auth still works for the session.
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.hydrated = true;
            persist(action.payload.user, action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.hydrated = true;
            persist(null, null);
        },
        refreshUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            if (typeof window !== "undefined") {
                window.localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        /** Read persisted credentials on the client after hydration. */
        hydrateAuth: (state) => {
            const user = readStoredUser();
            const token =
                typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
            state.user = user;
            state.token = token;
            state.isAuthenticated = Boolean(user && token);
            state.hydrated = true;
        },
    },
});

export const { login, logout, refreshUser, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
