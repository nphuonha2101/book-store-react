import type { Metadata } from "next";
import { UserProfile } from "@/components/pages/User/UserProfile";

export const metadata: Metadata = { title: "Hồ sơ" };

export default function Page() {
    return <UserProfile />;
}
