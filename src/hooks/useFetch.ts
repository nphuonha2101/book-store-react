import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse";

interface FetchOptions extends RequestInit {
    /** Skip the request entirely. */
    skip?: boolean;
    /** Extra query parameters appended to the URL. */
    params?: Record<string, unknown>;
}

const useFetch = <T,>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<T | null>(null);
    const [pagination, setPagination] = useState<{
        isFirst: boolean;
        isLast: boolean;
        totalPages: number;
        pageSize: number;
        currentPage: number;
        totalElements: number;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const paramsKey = JSON.stringify(options?.params ?? {});
    const skip = options?.skip ?? false;

    // Keep the latest request options without making them a dependency of the
    // fetch callback (callers typically pass an inline object).
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    });

    const fullUrl = useMemo(() => {
        if (!url) return "";
        const queryParams = new URLSearchParams();
        const params = JSON.parse(paramsKey) as Record<string, unknown>;

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (item !== undefined && item !== null) {
                        queryParams.append(key, String(item));
                    }
                });
            } else {
                queryParams.append(key, String(value));
            }
        });

        return queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    }, [url, paramsKey]);

    const fetchData = useCallback(async () => {
        if (!fullUrl || skip) return;

        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const requestInit: FetchOptions = { ...(optionsRef.current ?? {}) };
        delete requestInit.skip;
        delete requestInit.params;

        try {
            const response = await fetch(fullUrl, { ...requestInit, signal: controller.signal });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const result: ApiResponse<T> = await response.json();
            if (!result.success) throw new Error(result.message || "Unknown error");

            setData(result.data);
            setPagination(result.pagination || null);
        } catch (err) {
            if (!controller.signal.aborted) setError((err as Error).message);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [fullUrl, skip]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return { data, loading, error, fetchData, pagination };
};

export default useFetch;
