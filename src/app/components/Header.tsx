'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavLink = {
  name: string;
  href: string;
  primary?: boolean;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "Venue Partners", href: "/venue-partners" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Get Onboarded", href: "/onboarding", primary: true },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40 w-full border-b border-white/60 bg-white/90 backdrop-blur sm:sticky sm:top-0">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/assets/ofside-logo.png" alt="Ofside" width={128} height={40} priority />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) =>
            link.primary ? (
              <Link
                key={link.name}
                href={link.href}
                className="inline-flex items-center rounded-2xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-2xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-950 hover:text-[#FFF201]"
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-2xl border border-gray-200 p-2.5 text-gray-900 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  link.primary
                    ? "inline-flex items-center justify-center rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white"
                    : "inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-950 hover:text-[#FFF201]"
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
