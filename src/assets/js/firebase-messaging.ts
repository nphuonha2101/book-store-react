import { getMessagingInstance, getToken, deleteToken } from "./firebase-config";
import { API_ENDPOINTS } from "../../constants/apiInfo";
import AuthUtil from "../../utils/authUtil";

export const requestPermissionAndGetToken = async (
    swRegistration: ServiceWorkerRegistration | null
) => {
    if (typeof window === "undefined") return;
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted" || !swRegistration) {
            console.warn("Notification permission denied or no service worker");
            return;
        }

        const messaging = await getMessagingInstance();
        if (!messaging) return;

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: swRegistration,
        });

        window.localStorage.setItem("fcmToken", token);

        const userToken = AuthUtil.getToken();
        if (!userToken) {
            console.error("User token not found. Cannot send FCM token to server.");
            return;
        }

        await fetch(API_ENDPOINTS.AUTH.FCM_TOKEN.ADD.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ token }),
        });
        return token;
    } catch (err) {
        console.error("FCM error:", err);
    }
};

export const deleteFCMToken = async () => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem("fcmToken");
    if (!token) return;

    try {
        await fetch(API_ENDPOINTS.AUTH.FCM_TOKEN.DELETE.URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AuthUtil.getToken()}`,
            },
            body: JSON.stringify({ token }),
        });

        const messaging = await getMessagingInstance();
        if (messaging) await deleteToken(messaging);
    } catch (serverErr) {
        console.error("Failed to delete FCM token:", serverErr);
    }
};
