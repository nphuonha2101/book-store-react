import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                404
            </p>
            <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
            <p className="max-w-md text-muted-foreground">
                Trang bạn tìm không tồn tại hoặc đã được di chuyển.
            </p>
            <Button asChild>
                <Link href="/">Về trang chủ</Link>
            </Button>
        </div>
    );
}
