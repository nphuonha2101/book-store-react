"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

type NavigateOptions = {
    replace?: boolean;
    scroll?: boolean;
    state?: unknown;
};

/**
 * Drop-in replacement for react-router's `useNavigate`, backed by the Next.js
 * App Router. Supports `navigate(-1)` for going back.
 */
export function useNavigate() {
    const router = useRouter();

    return useCallback(
        (to: string | number, options?: NavigateOptions) => {
            if (typeof to === "number") {
                router.back();
                return;
            }
            const navOptions = { scroll: options?.scroll ?? true };
            if (options?.replace) {
                router.replace(to, navOptions);
            } else {
                router.push(to, navOptions);
            }
        },
        [router]
    );
}
