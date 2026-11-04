import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "NP Book Store — Nhà sách trực tuyến",
        template: "%s | NP Book Store",
    },
    description:
        "Khám phá hàng nghìn đầu sách, đặt hàng nhanh chóng và theo dõi đơn hàng tại NP Book Store.",
    applicationName: "NP Book Store",
    keywords: ["sách", "nhà sách", "book store", "mua sách online"],
    icons: {
        icon: "/Logo.svg",
        shortcut: "/Logo.svg",
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        siteName: "NP Book Store",
        title: "NP Book Store — Nhà sách trực tuyến",
        description: "Khám phá hàng nghìn đầu sách và đặt hàng trực tuyến.",
        url: siteUrl,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
