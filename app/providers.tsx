"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import { AppStore, makeStore } from "@/redux/store";
import { hydrateAuth } from "@/redux/slice/authSlice";
import { AppNotificationListener } from "@/components/partitials/Notification/AppNotificationListener";
import { requestPermissionAndGetToken } from "@/assets/js/firebase-messaging";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function AppBootstrap({ children }: { children: ReactNode }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(hydrateAuth());
    }, [dispatch]);

    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

        let cancelled = false;
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then(async (registration) => {
                if (cancelled) return;
                const fcmToken = window.localStorage.getItem("fcmToken");
                if (!fcmToken && isAuthenticated) {
                    await requestPermissionAndGetToken(registration);
                }
            })
            .catch((err) => console.error("Service worker registration failed:", err));

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
    // One store per browser session; never share a store between SSR requests.
    const [store] = useState<AppStore>(() => makeStore());

    return (
        <Provider store={store}>
            <AppBootstrap>
                <AppNotificationListener />
                {children}
                <Toaster richColors closeButton position="top-right" />
            </AppBootstrap>
        </Provider>
    );
}
