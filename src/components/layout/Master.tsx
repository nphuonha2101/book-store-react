import { LayoutProps } from "../../types/Layout/layoutProps.ts";
import Footer from "../partitials/Footer/Footer";
import Navbar from "../partitials/Header/Navbar";

export const Master: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <section className="container w-full mt-20 mb-28">
                {children}
            </section>
            <Footer />
        </>
    );
}