import { toast } from "sonner";
import { User } from "../types/ApiResponse/User/user";
import { API_ENDPOINTS } from "../constants/apiInfo";
import Logger from "./logger";

const isBrowser = () => typeof window !== "undefined";

export default class AuthUtil {
    /**
     * Check if user is logged in. Safe to call during SSR.
     */
    static isLogged() {
        if (!isBrowser()) return false;
        return !!window.localStorage.getItem("token");
    }

    /**
     * Persist user info and JWT after a successful login.
     */
    static login(user: object, token: string) {
        if (!isBrowser()) return;
        window.localStorage.setItem("user", JSON.stringify(user));
        window.localStorage.setItem("token", token);
    }

    /**
     * Remove persisted credentials.
     */
    static logout() {
        if (!isBrowser()) return;
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("fcmToken");
        window.localStorage.removeItem("searchTermsHistory");
    }

    static getUser(): User | null {
        if (!isBrowser()) return null;
        try {
            const raw = window.localStorage.getItem("user");
            return raw ? (JSON.parse(raw) as User) : null;
        } catch {
            return null;
        }
    }

    static getToken(): string | null {
        if (!isBrowser() || !AuthUtil.isLogged()) return null;

        const token = window.localStorage.getItem("token");
        if (!token) return null;

        if (AuthUtil.checkTokenExpired(token)) {
            AuthUtil.logout();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return null;
        }
        return token;
    }

    /**
     * Fetch the authenticated profile and refresh the persisted copy.
     */
    static async fetchUser(): Promise<User | null> {
        const userToken = AuthUtil.getToken();
        if (!userToken) return null;

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.ME.URL, {
                method: "POST",
                headers: { Authorization: `Bearer ${userToken}` },
            });
            const userResponse = await response.json();
            if (!userResponse.success) {
                toast.error("Đã có lỗi xảy ra khi lấy thông tin người dùng");
                return null;
            }
            AuthUtil.login(userResponse.data, userToken);
            return userResponse.data as User;
        } catch (error) {
            Logger.error("Fetch user error:", error);
            return null;
        }
    }

    static async refreshUser() {
        const user = await AuthUtil.fetchUser();
        if (user) AuthUtil.login(user, AuthUtil.getToken()!);
        else AuthUtil.logout();
    }

    static decodeToken(token: string) {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) return null;

            const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const paddedBase64 = base64.padEnd(
                base64.length + ((4 - (base64.length % 4)) % 4),
                "="
            );
            const decodedPayload = atob(paddedBase64);
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error("Failed to decode JWT token:", error);
            return null;
        }
    }

    static checkTokenExpired(token: string) {
        try {
            const decodedToken = AuthUtil.decodeToken(token);
            if (!decodedToken || !decodedToken.exp) return true;

            const currentTime = Math.floor(Date.now() / 1000);
            const bufferTime = 60;
            return decodedToken.exp < currentTime + bufferTime;
        } catch {
            return true;
        }
    }
}
