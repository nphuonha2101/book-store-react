import type { Metadata } from "next";
import { Suspense } from "react";
import SearchResults from "@/components/pages/Search/SearchResults";
import { Loading } from "@/components/vendor/Loading/Loading";

export const metadata: Metadata = {
    title: "Kết quả tìm kiếm",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <SearchResults />
        </Suspense>
    );
}
