"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getMessagingInstance, onMessage } from "@/assets/js/firebase-config";
import { AppDispatch } from "@/redux/store";
import { plusUnreadCount } from "@/redux/slice/notificationSlice";
import AuthUtil from "@/utils/authUtil";

export const AppNotificationListener = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;

        const setup = async () => {
            const messaging = await getMessagingInstance();
            if (!messaging || cancelled) return;

            unsubscribe = onMessage(messaging, (payload) => {
                dispatch(plusUnreadCount());
                if (!AuthUtil.isLogged()) return;
                toast.info(payload?.notification?.title || "Thông báo mới", {
                    description: payload?.notification?.body,
                });
            });
        };

        void setup();

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [dispatch]);

    return null;
};
