import Footer from "@/components/partitials/Footer/Footer";
import Navbar from "@/components/partitials/Header/Navbar";
import { Chatbox } from "@/components/vendor/Chatbox/Chatbox";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-w-screen-lg">
            <Navbar />
            <main className="mx-auto mt-24 mb-28 w-full max-w-screen-xl px-7">
                {children}
                <Chatbox />
            </main>
            <Footer />
        </div>
    );
}
