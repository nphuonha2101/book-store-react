import { useState, useEffect } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse";

interface FetchOptions extends RequestInit {
    skip?: boolean; // Bỏ qua fetch nếu cần
    page?: number; // Trang cần lấy
    size?: number; // Số lượng phần tử trên mỗi trang
}

const useFetch = <T,>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url || options?.skip) return;

        const controller = new AbortController();
        const { signal } = controller;

        // Xây dựng URL với page & size nếu có
        const queryParams = new URLSearchParams();
        if (options?.page !== undefined) queryParams.append("page", options.page.toString());
        if (options?.size !== undefined) queryParams.append("size", options.size.toString());

        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(fullUrl, { ...options, signal });
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);

                const result: ApiResponse<T> = await response.json();

                if (!result.success) throw new Error(result.message || "Unknown error");

                setData(result.data);
            } catch (err) {
                if (!signal.aborted) setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url, options?.page, options?.size]);

    return { data, loading, error };
};

export default useFetch;