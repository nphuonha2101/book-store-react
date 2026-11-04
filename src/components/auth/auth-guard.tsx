"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loading } from "@/components/vendor/Loading/Loading";

/** Protects authenticated routes and preserves the intended destination. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, hydrated } = useSelector((state: RootState) => state.auth);
    const pathname = usePathname();
    const router = useRouter();
    // Keep the first client render identical to the server render.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuthenticated) {
            const continueTo = encodeURIComponent(pathname);
            router.replace(`/signin?continue=${continueTo}`);
        }
    }, [hydrated, isAuthenticated, pathname, router]);

    if (!mounted || !hydrated || !isAuthenticated) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    return <>{children}</>;
}
