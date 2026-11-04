import type { Metadata } from "next";
import { OrderFailed } from "@/components/pages/OrderStatus/OrderFailed";

export const metadata: Metadata = { title: "Đặt hàng thất bại" };

export default function Page() {
    return <OrderFailed />;
}
