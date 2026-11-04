"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    console.error(error);

    return (
        <html lang="vi">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "24px",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "center",
                }}
            >
                <h1 style={{ fontSize: "24px", margin: 0 }}>Đã có lỗi xảy ra</h1>
                <p style={{ color: "#666", maxWidth: "420px", margin: 0 }}>
                    Ứng dụng không thể hiển thị. Vui lòng thử lại.
                </p>
                <button
                    onClick={reset}
                    style={{
                        border: 0,
                        borderRadius: "8px",
                        padding: "10px 18px",
                        background: "#111",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Thử lại
                </button>
            </body>
        </html>
    );
}
