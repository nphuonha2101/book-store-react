import { LayoutProps } from "../../types/Layout/layoutProps.ts";
import Footer from "../partitials/Footer/Footer";
import Navbar from "../partitials/Header/Navbar";

export const Master: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="w-full min-w-screen-lg">
            <Navbar />
            <section className="w-full mt-5 mb-28 px-7 max-w-screen-xl mx-auto">
                {children}
            </section>
            <Footer />
        </div>
    );
}