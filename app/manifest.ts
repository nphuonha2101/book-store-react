import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "NP Book Store",
        short_name: "NP Books",
        description: "Nhà sách trực tuyến — khám phá và đặt mua sách.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [{ src: "/Logo.svg", sizes: "any", type: "image/svg+xml" }],
        scope: "/",
    };
}
