import type { Metadata } from "next";
import { BookDetail } from "@/components/pages/BookDetail/BookDetail";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    return { title: `Chi tiết sách #${id}` };
}

export default function Page() {
    return <BookDetail />;
}
