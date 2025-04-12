import { toast } from "react-toastify";
import { User } from "../types/ApiResponse/User/user";
import { API_ENDPOINTS } from "../constants/ApiInfo.ts";
import Logger from "../log/logger.ts";

export default class AuthUtil {
    /**
     * Check if user is logged in
     * @returns true if user is logged in, false otherwise
     */
    static isLogged() {
        return localStorage.getItem("token") ? true : false;
    }

    /**
     * Login user by saving user info and token to local storage
     * @param user (User from ../types/ApiResponse/User/user) user object
     * @param token  JWT token
     */
    static login(user: object, token: string) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }

    /**
     * Logout user by removing user info and token from local storage
     */
    static logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    /**
     *  Get user info from local storage
     * @returns User info from local storage if user is logged in, null otherwise
     */
    static getUser() {
        return JSON.parse(localStorage.getItem("user")!) as User;
    }

    /**
     *  Get JWT token from local storage
     * @returns JWT token from local storage
     */
    static getToken() {
        if (!AuthUtil.isLogged()) {
            return null;
        }
        // Check if token is expired
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }
        const isExpired = AuthUtil.checkTokenExpired(token);
        if (isExpired) {
            AuthUtil.logout();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return null;
        }
        return token;
    }

    /**
     * Fetch user info from server. If user is logged in, save user info and token to local storage
     * @returns User info if user is logged in, null otherwise
     */
    static async fetchUser() {
        const userToken = AuthUtil.getToken();

        if (!userToken) {
            return;
        }

        const userResponse = await fetch(API_ENDPOINTS.AUTH.ME.URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }).then((res) => res.json())
            .catch((error) => {
                Logger.error("Fetch user error:", error);
                return null;
            });
        if (!userResponse.success) {
            toast.error("Đã có lỗi xảy ra khi lấy thông tin người dùng");
            return;
        }

        AuthUtil.login(userResponse.data, userToken);
        return userResponse.data as User;
    }

    /**
     * Refresh user info and token from local storage when user info is changed
     */
    static async refreshUser() {
        const user = await AuthUtil.fetchUser();
        if (user)
            this.login(user, AuthUtil.getToken()!);
        else
            this.logout();
    }

    static decodeToken(token: string) {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                console.error("Invalid JWT token format");
                return null;
            }

            const payload = parts[1];
            // Sửa lỗi padding khi decode base64url
            const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
            const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
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
            if (!decodedToken || !decodedToken.exp) {
                console.error("Invalid token or missing exp claim");
                return true; // Coi như token hết hạn
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const bufferTime = 60; // Thời gian đệm 60 giây

            return decodedToken.exp < (currentTime + bufferTime);
        } catch (error) {
            console.error("Error checking token expiration:", error);
            return true; // Coi như token hết hạn nếu có lỗi
        }
    }
}