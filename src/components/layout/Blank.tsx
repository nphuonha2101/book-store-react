import { LayoutProps } from "../../types/Layout/LayoutProps";
export const Blank: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="w-full h-full">
            {children}
        </div>
    );
}
