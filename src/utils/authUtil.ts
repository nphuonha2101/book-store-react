import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../constants/apiInfo";
import Logger from "../log/logger";
import { User } from "../types/ApiResponse/User/user";

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
        return localStorage.getItem("token");
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
}