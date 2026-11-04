import type { Metadata } from "next";
import OrderHistory from "@/components/vendor/Order/OrderHistory";

export const metadata: Metadata = { title: "Lịch sử đơn hàng" };

export default function Page() {
    return <OrderHistory />;
}
