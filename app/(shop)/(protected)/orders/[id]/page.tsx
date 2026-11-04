import type { Metadata } from "next";
import OrderDetail from "@/components/vendor/Order/OrderDetail";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

export default function Page() {
    return <OrderDetail />;
}
