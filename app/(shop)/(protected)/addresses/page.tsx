import type { Metadata } from "next";
import { UserAddress } from "@/components/pages/User/UserAddress";

export const metadata: Metadata = { title: "Địa chỉ" };

export default function Page() {
    return <UserAddress />;
}
