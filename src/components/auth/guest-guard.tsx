"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

/** Prevents signed-in users from visiting sign-in / sign-up / reset pages. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, hydrated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (hydrated && isAuthenticated) router.replace("/");
    }, [hydrated, isAuthenticated, router]);

    if (!mounted) return <>{children}</>;
    if (hydrated && isAuthenticated) return null;
    return <>{children}</>;
}
