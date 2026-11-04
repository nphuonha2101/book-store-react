import type { Metadata } from "next";
import { UserNotification } from "@/components/pages/User/UserNotification";

export const metadata: Metadata = { title: "Thông báo" };

export default function Page() {
    return <UserNotification />;
}
