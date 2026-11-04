import type { Metadata } from "next";
import { OrderSuccess } from "@/components/pages/OrderStatus/OrderSuccess";

export const metadata: Metadata = { title: "Đặt hàng thành công" };

export default function Page() {
    return <OrderSuccess />;
}
