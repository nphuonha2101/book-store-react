"use client";

import Link from "next/link";
export const Logo = ({ className, width = '70px', height = 'auto' }: {
    className?: string;
    width?: string;
    height?: string;
}) => {
    return (
        <Link href="/" className={className}>
            <img src="/Logo.svg" alt="logo" style={{ width, height }} />
        </Link>
    );
}