import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn } from "@/components/pages/SignIn/SignIn";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SignIn />
        </Suspense>
    );
}
