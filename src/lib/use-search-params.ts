"use client";

import { useCallback, useMemo } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams as useNextSearchParams,
} from "next/navigation";

type SearchParamsInput = URLSearchParams | Record<string, string | string[]>;

/**
 * react-router-compatible `useSearchParams` for the App Router.
 * Next exposes a read-only search params object; this hook adds a setter that
 * performs a client-side `router.replace`.
 */
export function useSearchParams(): [URLSearchParams, (next: SearchParamsInput) => void] {
    const nextSearchParams = useNextSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const queryString = nextSearchParams.toString();
    const searchParams = useMemo(() => new URLSearchParams(queryString), [queryString]);

    const setSearchParams = useCallback(
        (next: SearchParamsInput) => {
            const params =
                next instanceof URLSearchParams
                    ? next
                    : Object.entries(next).reduce((acc, [key, value]) => {
                          if (Array.isArray(value)) value.forEach((v) => acc.append(key, v));
                          else acc.set(key, value);
                          return acc;
                      }, new URLSearchParams());

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        },
        [pathname, router]
    );

    return [searchParams, setSearchParams];
}
