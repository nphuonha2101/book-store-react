import type { Metadata } from "next";
import { Checkout } from "@/components/pages/Checkout/Checkout";

export const metadata: Metadata = { title: "Thanh toán" };

export default function Page() {
    return <Checkout />;
}
