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
//     { name: "Contact", href: "#" },
//     { name: "Get Started", href: "#", primary: true },
 ];

export default function Header() {
    return (
        <header className="bg-white font-inter" style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.28), 0 1.5px 8px 0 rgba(0,0,0,0.12)" }}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Logo */}
         <Link href="/" legacyBehavior>
  
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
                            className="bg-yellow-300 text-yellow-700 font-semibold px-4 py-2 rounded-full shadow scale-105 shadow-lg transition-all duration-200 hover:bg-yellow-300 hover:scale-110 hover:shadow-xl"
                        >
                            {link.name}
                        </a>
                    ) : (
                        <a
                            key={link.name}
                            href={link.href}
                            className="bg-yellow-300 px-3 py-2 rounded transition-all duration-200 font-medium scale-105 text-yellow-900 hover:bg-yellow-400 hover:scale-110"
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
            <div className="flex flex-col space-y-2">
                {navLinks.map((link) =>
                link.primary ? (
                    <a
                    key={link.name}
                    href={link.href}
                    className="bg-white text-yellow-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-yellow-100 hover:scale-105 hover:shadow-lg transition-all duration-200 text-center"
                    >
                    {link.name}
                    </a>
                ) : (
                    <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-900 hover:text-yellow-900 px-3 py-2 rounded transition-all duration-200 font-medium hover:bg-yellow-200 hover:scale-105 text-center"
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