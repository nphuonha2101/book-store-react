import { LayoutProps } from "../../types/Layout/layoutProps.ts";
export const Blank: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="w-full h-full">
            {children}
        </div>
    );
}
