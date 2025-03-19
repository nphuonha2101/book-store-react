import { useState } from "react";
import { ApiResponse } from "../types/ApiResponse/ApiResponse";

interface FetchOptions extends Omit<RequestInit, "body"> {
    headers?: HeadersInit;
    skip?: boolean;
}

const usePut = <T extends BodyInit | FormData, R>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const putData = async (body: T) => {
        if (!url || options?.skip) return;

        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const { signal } = controller;

        try {
            const isFormData = body instanceof FormData;
            const response = await fetch(url, {
                method: "PUT",
                headers: isFormData ? { ...(options?.headers || {}) } : {
                    "Content-Type": "application/json",
                    ...(options?.headers || {}),
                },
                body: isFormData ? body : JSON.stringify(body),
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

    return { data, loading, error, putData };
};

export default usePut;

// USAGE
// const { data, loading, error, putData } = usePut<{ name: string }, { id: number; name: string }>(
//     "https://api.example.com/users/1"
// );

// const handleUpdateUser = async () => {
//     const response = await putData({ name: "Updated User" });
//     console.log("Updated user:", response);
// };
// OR
// const { data, loading, error, putData } = usePut<FormData, { id: number; name: string }>(
//     "https://api.example.com/users/1"
// );

// const handleUpdateUser = async () => {
//     const formData = new FormData();
//     formData.append("name", "Updated User");
//     formData.append("avatar", file); // Nếu có file upload

//     const response = await putData(formData);
//     console.log("Updated user:", response);
// };