import { useState, useEffect, useCallback, useMemo } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse";

interface FetchOptions extends RequestInit {
    skip?: boolean; // Bỏ qua fetch nếu cần
    params?: Record<string, unknown>; // Custom params (bất kỳ tham số nào)
}

const useFetch = <T,>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memo hóa params để tránh tạo object mới mỗi lần render
    const stableOptions = useMemo(() => ({
        ...options,
        params: JSON.stringify(options?.params || {}), // Chuyển params thành string để so sánh dễ hơn
    }), [JSON.stringify(options?.params)]);

    // Xây dựng URL với query params động
    const fullUrl = useMemo(() => {
        if (!url) return "";
        const queryParams = new URLSearchParams();

        if (options?.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        return queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    }, [url, stableOptions.params]);

    const fetchData = useCallback(async () => {
        if (!fullUrl || stableOptions.skip) return;
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const { signal } = controller;

        try {
            const response = await fetch(fullUrl, { ...stableOptions, signal });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const result: ApiResponse<T> = await response.json();
            if (!result.success) throw new Error(result.message || "Unknown error");

            setData(result.data);
        } catch (err) {
            if (!signal.aborted) setError((err as Error).message);
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, [fullUrl, stableOptions.skip]); // Chỉ phụ thuộc vào fullUrl & skip để tránh loop vô hạn

    // Fetch tự động nếu có URL và không bị `skip`
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, fetchData };
};

export default useFetch;



// USAGE
// const { data, loading, error } = useFetch<MyData>("https://api.example.com/items", {
//     page: 1,
//     size: 10,
// });

// const { data, loading, error, fetchData } = useFetch<MyData>("https://api.example.com/items", {
//     page: 1,
//     size: 10,
//     skip: true, // Không fetch tự động
// });

// const handleFetch = () => {
//     fetchData();
// };

// const { data, loading, error } = useFetch<MyData>("https://api.example.com/items", {
//     params: {
//         page: 1,
//         size: 10,
//         category: "electronics",
//         sort: "price_desc",
//     },
// });
