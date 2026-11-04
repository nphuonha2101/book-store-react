"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase must never be initialised during SSR: it touches browser APIs.
 * Returns `null` on the server or when the project is not configured.
 */
export const getFirebaseApp = (): FirebaseApp | null => {
    if (typeof window === "undefined") return null;
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
    return getApps()[0] ?? initializeApp(firebaseConfig);
};

/** Lazily resolve FCM, gracefully handling unsupported browsers. */
export const getMessagingInstance = async (): Promise<Messaging | null> => {
    if (typeof window === "undefined") return null;
    const app = getFirebaseApp();
    if (!app) return null;
    try {
        if (!(await isSupported())) return null;
        return getMessaging(app);
    } catch {
        return null;
    }
};

export { getToken, onMessage, deleteToken } from "firebase/messaging";
