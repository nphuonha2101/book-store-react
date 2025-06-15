import { useState } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse.ts";

interface FetchOptions extends Omit<RequestInit, "body"> {
    headers?: HeadersInit;
    skip?: boolean;
}

const useDelete = <R>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteData = async () => {
        if (!url || options?.skip) return;

        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const { signal } = controller;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(options?.headers || {}),
                },
                signal,
                ...options,
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const result: ApiResponse<R> = await response.json();

            if (!result.success) throw new Error(result.message || "Unknown error");

            setData(result.data || null);
            return result.data;
        } catch (err) {
            if (!signal.aborted) setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, deleteData };
};

export default useDelete;

// USAGE
// const { data, loading, error, deleteData } = useDelete<{ message: string }>("https://api.example.com/users/1");

// const handleDeleteUser = async () => {
//     const response = await deleteData();
//     console.log("Delete response:", response);
// };
