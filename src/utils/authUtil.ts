import { User } from "../types/ApiResponse/User/user";

export default class AuthUtil {
    static isLogged() {
        return localStorage.getItem("token") ? true : false;
    }

    static login(user: object, token: string) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }

    static logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    static getUser() {
        return JSON.parse(localStorage.getItem("user")!) as User;
    }

    static getToken() {
        return localStorage.getItem("token");
    }
}