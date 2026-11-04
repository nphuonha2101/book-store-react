import type { Metadata } from "next";
import { Home } from "@/components/pages/Home/Home";

export const metadata: Metadata = {
    title: "Trang chủ",
    description: "Khám phá sách mới, sách bán chạy và ưu đãi tại NP Book Store.",
};

export default function Page() {
    return <Home />;
}
