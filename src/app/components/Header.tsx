'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";

type NavLink = {
    name: string;
    href: string;
    primary?: boolean;
};

const navLinks: NavLink[] = [
   
    { name: "Get Onboarded", href: "/onboarding" },
//     { name: "Pricing", href: "#" },
    { name: "Contact us", href: "/contact-us" },
//     { name: "Get Started", href: "#", primary: true },
 ];

export default function Header() {
    return (
        <header className="bg-white font-inter" style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.28), 0 1.5px 8px 0 rgba(0,0,0,0.12)" }}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/">
                <Image
                    src="/assets/ofside-logo.png"
                    alt="Ofside Logo"
                    width={120}
                    height={40}
                    priority
                />
            </Link>
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-4 items-center ">
                {navLinks.map((link) =>
                    link.primary ? (
                        <a
                            key={link.name}
                            href={link.href}
                            className="inline-flex items-center bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold px-4 sm:px-6 py-1 sm:py-2 rounded-xl shadow text-xs sm:text-base gap-2 border-2 border-yellow-300"
                        >
                            {link.name}
                        </a>
                    ) : (
                        <a
                            key={link.name}
                            href={link.href}
                            className="inline-flex items-center bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold px-4 sm:px-6 py-1 sm:py-2 rounded-xl shadow text-xs sm:text-base gap-2 border-2 border-yellow-300"
                        >
                            {link.name}
                        </a>
                    )
                )}
            </div>
            {/* Mobile Nav Button */}
            <div className="md:hidden flex items-center">
                <button
                type="button"
                className="text-gray-900 hover:text-yellow-900 focus:outline-none"
                aria-label="Open menu"
                onClick={() => {
                    const menu = document.getElementById("mobile-menu");
                    if (menu) menu.classList.toggle("hidden");
                }}
                >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>
            </div>
            </nav>
            {/* Mobile Nav */}
            <div id="mobile-menu" className="md:hidden hidden px-4 pb-4">
            <div className="flex flex-col items-start space-y-2">
                {navLinks.map((link) =>
                link.primary ? (
                    <a
                    key={link.name}
                    href={link.href}
                    className="inline-flex items-center bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold mt-4 px-4 sm:px-6 py-1 sm:py-2 rounded-md shadow text-xs sm:text-base gap-2 border-2 border-yellow-300"
                    >
                    {link.name}
                    </a>
                ) : (
                    <a
                    key={link.name}
                    href={link.href}
                    className="inline-flex items-center bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold px-4 sm:px-6 py-1 sm:py-2 rounded-md shadow text-xs sm:text-base mt-4 gap-2 border-2 border-yellow-300"
                    >
                    {link.name}
                    </a>
                )
                )}
            </div>
            </div>
        </header>
    );
}