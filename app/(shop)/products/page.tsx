import type { Metadata } from "next";
import { Suspense } from "react";
import Products from "@/components/pages/Products/Products";
import { Loading } from "@/components/vendor/Loading/Loading";

export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "Tìm kiếm và lọc sách theo tác giả, thể loại và giá.",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Products />
        </Suspense>
    );
}
