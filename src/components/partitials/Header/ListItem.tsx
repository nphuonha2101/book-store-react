import React, { ReactNode } from "react";

interface ListItemProps {
    children: ReactNode;
    NavLink: string;
}

export const ListItem: React.FC<ListItemProps> = ({ children, NavLink }) => {
    return (
        <li>
            <a
                href={NavLink}
                className="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
            >
                {children}
            </a>
        </li>
    );
};