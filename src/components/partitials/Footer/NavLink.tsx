import React from 'react';
import { NavLinkProps } from '../../../types/Footer/NavLinkProps';

export const NavLink: React.FC<NavLinkProps> = ({ link, label }) => {
    return (
        <li>
            <a
                href={link}
                className="inline-block text-base leading-loose text-body-color hover:text-primary dark:text-dark-6"
            >
                {label}
            </a>
        </li>
    );
};
