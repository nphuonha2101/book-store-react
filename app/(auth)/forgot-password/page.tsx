import type { Metadata } from "next";
import { ForgotPassword } from "@/components/pages/FogotPasswd/FogotPasswd";

export const metadata: Metadata = { title: "Quên mật khẩu" };

export default function Page() {
    return <ForgotPassword />;
}
