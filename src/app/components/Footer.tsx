import Link from "next/link";
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { AppDownloadButtons } from "./marketing";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Players", href: "/players" },
  { label: "Venue Partners", href: "/venue-partners" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

const policyLinks = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Rescheduling Policy", href: "/rescheduling-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
        <div data-reveal="footer-block">
          <p className="text-sm uppercase tracking-[0.24em] text-yellow-300">Ofside</p>
          <h2 className="mt-4 text-3xl font-semibold">India&apos;s ultimate sports ecosystem</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-gray-300">
            Built for players, venue partners, and the local sports communities that deserve a more connected digital experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:admin@ofside.in"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4 text-yellow-300" />
              admin@ofside.in
            </a>
            <a
              href="tel:+919811785330"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-yellow-300" />
              +91 98117 85330
            </a>
          </div>
          <div className="mt-6">
            <AppDownloadButtons className="[&>a]:border-white/10 [&>a]:bg-white/5 [&>a]:shadow-none [&>a]:hover:bg-white/10 [&>a]:hover:border-yellow-300 [&>a_p]:text-inherit" />
          </div>
        </div>

        <div data-reveal="footer-block" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
          <h3 className="text-sm uppercase tracking-[0.24em] text-yellow-300">Navigate</h3>
          <div className="mt-5 grid gap-3">
            {primaryLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-gray-300 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div data-reveal="footer-block" style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
          <h3 className="text-sm uppercase tracking-[0.24em] text-yellow-300">Policies & Social</h3>
          <div className="mt-5 grid gap-3">
            {policyLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-gray-300 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com/ofsideapp"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-yellow-300" />
            </a>
            <a
              href="https://wa.me/919811785330"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 text-yellow-300" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10" data-reveal="footer-block">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-gray-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Ofside. All rights reserved.</p>
          <p>Designed to support better sports discovery, participation, and venue growth.</p>
        </div>
      </div>
    </footer>
  );
}
