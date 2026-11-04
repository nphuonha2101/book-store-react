import type { Metadata } from "next";
import { Cart } from "@/components/pages/Cart/Cart";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function Page() {
    return <Cart />;
}
