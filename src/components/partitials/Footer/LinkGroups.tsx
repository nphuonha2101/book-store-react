import { LinkGroupProps } from "../../../types/Footer/linkGroupProps.ts";


export const LinkGroup: React.FC<LinkGroupProps> = ({ children, header }) => {
    return (
        <>
            <div className="w-full px-4 sm:w-1/2 lg:w-2/12">
                <div className="mb-10 w-full">
                    <h4 className="mb-9 text-lg font-semibold text-dark dark:text-white">
                        {header}
                    </h4>
                    <ul className="space-y-3">{children}</ul>
                </div>
            </div>
        </>
    );
};