import { messaging, getToken } from "./firebase-config";
import { API_ENDPOINTS } from "../../constants/apiInfo";
import AuthUtil from "../../utils/authUtil";

export const requestPermissionAndGetToken = async (swRegistration: ServiceWorkerRegistration | null) => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted" && swRegistration) {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: swRegistration,
            });
            console.log("FCM Token:", token);

            const userToken = AuthUtil.getToken();
            if (!userToken) {
                console.error("User token not found. Cannot send FCM token to server.");
                return;
            }

            try {
                await fetch(API_ENDPOINTS.AUTH.FCM_TOKEN.ADD.URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({ token: token }),
                });
                console.log("Token sent to server successfully");
            } catch (serverErr) {
                console.error("Failed to send token to server:", serverErr);
            }

            localStorage.setItem("fcmToken", token);
            return token;
        } else {
            console.warn("Notification permission denied");
        }
    } catch (err) {
        console.error("FCM Error:", err);
    }
};