import type { Metadata } from "next";
import Wishlist from "@/components/pages/WishList/WishList";

export const metadata: Metadata = { title: "Danh sách yêu thích" };

export default function Page() {
    return <Wishlist />;
}
