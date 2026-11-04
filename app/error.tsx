"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <h1 className="text-3xl font-bold">Đã có lỗi xảy ra</h1>
            <p className="max-w-md text-muted-foreground">
                Rất tiếc, trang này không thể hiển thị. Vui lòng thử lại hoặc quay về trang chủ.
            </p>
            <div className="flex gap-3">
                <Button onClick={reset}>Thử lại</Button>
                <Button variant="outline" asChild>
                    <Link href="/">Về trang chủ</Link>
                </Button>
            </div>
        </div>
    );
}
