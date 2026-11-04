import type { Metadata } from "next";
import { ContactAbout } from "@/components/pages/Contact/Contact";

export const metadata: Metadata = {
    title: "Liên hệ",
    description: "Liên hệ với NP Book Store để được hỗ trợ.",
};

export default function Page() {
    return <ContactAbout />;
}
