"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type NextLinkProps = ComponentProps<typeof Link>;

interface NavLinkProps extends Omit<NextLinkProps, "href" | "className" | "children"> {
    /** react-router style prop */
    to?: string;
    /** next/link style prop */
    href?: string;
    className?:
        | string
        | ((state: { isActive: boolean; isPending: boolean }) => string);
    children?: ReactNode;
}

/**
 * `NavLink` compatible with the react-router API used by the original app,
 * built on top of `next/link` and `usePathname`.
 */
export function NavLink({ to, href, className, children, ...rest }: NavLinkProps) {
    const pathname = usePathname();
    const target = to ?? href ?? "/";
    const isActive =
        target === "/"
            ? pathname === "/"
            : pathname === target || pathname.startsWith(`${target}/`);

    const resolvedClassName =
        typeof className === "function"
            ? className({ isActive, isPending: false })
            : className;

    return (
        <Link href={target} className={resolvedClassName} aria-current={isActive ? "page" : undefined} {...rest}>
            {children}
        </Link>
    );
}
