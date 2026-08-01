'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/lib/eventConfig";

type NavLink = {
  name: string;
  href: string;
  primary?: boolean;
  highlight?: boolean;
};

const sessionsLink: NavLink = {
  name: "Sessions",
  href: `/events/${EVENT.path}`,
  highlight: true,
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/players" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  sessionsLink,
  { name: "Download App", href: "/players", primary: true },
];

/** Menu drawer links — Sessions stays visible in the mobile top bar. */
const mobileMenuLinks = navLinks.filter((link) => !link.highlight);

function SessionsNavLogo({
  className,
  emojiClassName = "sessions-nav-emoji -ml-0.5 h-6 w-6 object-contain",
}: {
  className: string;
  emojiClassName?: string;
}) {
  return (
    <span className="inline-flex items-center leading-none">
      <Image
        src={EVENT.logoSrc}
        alt="SESSIONS"
        width={96}
        height={22}
        className={`w-auto object-contain object-center ${className}`}
      />
      <Image
        src="/assets/shuttlecock.png"
        alt=""
        width={32}
        height={32}
        className={emojiClassName}
        aria-hidden
      />
    </span>
  );
}

function linkClassName(link: NavLink, mobile = false): string {
  if (link.primary) {
    return mobile
      ? "inline-flex items-center justify-center rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white"
      : "inline-flex shrink-0 items-center rounded-2xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800";
  }
  if (link.highlight) {
    return mobile
      ? "inline-flex items-center justify-center px-4 py-3"
      : "inline-flex shrink-0 items-center";
  }
  return mobile
    ? "inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-950 hover:text-[#FFF201]"
    : "shrink-0 text-sm font-medium text-gray-700 transition hover:text-gray-950";
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40 w-full border-b border-white/60 bg-white/90 backdrop-blur sm:sticky sm:top-0">
      {/* Mobile: Ofside left, Sessions + menu right */}
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-3 sm:px-6 lg:hidden">
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/ofside-logo.png"
            alt="Ofside"
            width={100}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href={sessionsLink.href}
            className="inline-flex items-center"
            aria-label="SESSIONS event"
          >
            <SessionsNavLogo
              className="h-4"
              emojiClassName="sessions-nav-emoji -ml-0.5 h-[1.15rem] w-[1.15rem] object-contain"
            />
          </Link>
          <button
            type="button"
            className="inline-flex rounded-2xl border border-gray-200 p-2 text-gray-900"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Desktop */}
      <nav className="mx-auto hidden h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:flex lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/assets/ofside-logo.png" alt="Ofside" width={128} height={40} priority />
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={linkClassName(link)}
              aria-label={link.highlight ? "SESSIONS event" : undefined}
            >
              {link.highlight ? <SessionsNavLogo className="h-4" /> : link.name}
            </Link>
          ))}
        </div>
      </nav>

      {isOpen ? (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {mobileMenuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={linkClassName(link, true)}
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
