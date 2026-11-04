import type { Metadata } from "next";
import { SignUp } from "@/components/pages/SignUp/SignUp";

export const metadata: Metadata = { title: "Đăng ký" };

export default function Page() {
    return <SignUp />;
}
