import { useState, useEffect } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse.ts";

interface FetchOptions extends Omit<RequestInit, "body"> {
    headers?: HeadersInit;
    skip?: boolean;
    autoFetch?: boolean; // Thêm tùy chọn tự động gọi API khi mount
}

const useFetchPost = <T, R>(url: string, requestBody?: T, options?: FetchOptions) => {
    const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState<boolean>(options?.autoFetch || false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (body: T = requestBody as T): Promise<R | null> => {
        if (!url || options?.skip) return null;

        setLoading(true);
        setError(null);

        try {
            const headers = {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            };

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                ...options,
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const result: ApiResponse<R> = await response.json();
            if (!result.success) throw new Error(result.message || "Unknown error");

            setData(result.data || null);
            return result.data || null;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options?.autoFetch && requestBody) {
            fetchData();
        }
    }, [url, requestBody]);

    return { data, loading, error, fetchData };
};

export default useFetchPost;

// USAGE
// const { data, loading, error } = useFetchPost<{ userId: number }, { name: string }>(
//     "https://api.example.com/get-user",
//     { userId: 123 },
//     { autoFetch: true }
// );


// const { data, loading, error, fetchData } = useFetchPost<{ userId: number }, { name: string }>(
//     "https://api.example.com/get-user"
// );

// const getUser = async () => {
//     const response = await fetchData({ userId: 123 });
//     console.log(response);
// };
