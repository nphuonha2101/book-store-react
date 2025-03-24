import { useState } from "react";
import { ApiResponse } from "../types/ApiResponse/apiResponse";

interface FetchOptions extends Omit<RequestInit, "body"> {
    headers?: HeadersInit;
    skip?: boolean;
}

const usePost = <T, R>(url: string, options?: FetchOptions) => {
    const [data, setData] = useState<R | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // const [response, setResponse] = useState<ApiResponse<R> | null>(null);

    const postData = async (body: T): Promise<R | null> => {
        if (!url || options?.skip) return null;

        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const { signal } = controller;

        try {
            // Xác định headers, không đặt Content-Type nếu là FormData
            const isFormData = body instanceof FormData;
            const headers = isFormData ? options?.headers || {} : {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            };

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: isFormData ? (body as FormData) : JSON.stringify(body),
                signal,
                ...options,
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const result: ApiResponse<R> = await response.json();

            if (!result.success) throw new Error(result.message || "Unknown error");

            setData(result.data || null);
            return result.data || null;
        } catch (err) {
            if (!signal.aborted) setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, postData };
};

export default usePost;

// USAGE
// const { data, loading, error, postData } = usePost<{ name: string }, { id: number; name: string }>(
//     "https://api.example.com/users",
//     {
//         headers: {
//             Authorization: "Bearer my-token",
//         },
//     }
// );

// // Gửi request
// const handleCreateUser = async () => {
//     const response = await postData({ name: "John Doe" });
//     console.log("Response:", response);
// };
// OR
// const { postData } = usePost<FormData, { id: number }>("https://api.example.com/users");

// const uploadFile = async () => {
//     const formData = new FormData();
//     formData.append("name", "New User");
//     formData.append("avatar", file); // file là biến chứa file upload

//     const response = await postData(formData);
//     console.log(response); // { id: 1 }
// };