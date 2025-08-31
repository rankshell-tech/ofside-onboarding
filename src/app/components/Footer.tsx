import React from "react";

const footerLinks = [
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Rescheduling Policy", href: "/rescheduling-policy" }
];

export default function Footer() {
    return (
        <footer className="flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm">


            {/* Middle: Copyright */}
            <div className="text-center mb-4 md:mb-0 flex ">
                            {/* Left: Instagram Icon */}
            <a
                href="https://www.instagram.com/stories/ofsideapp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-pink-600 mb-4 md:mb-0"
                aria-label="Instagram"
            >
                <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
            </a>
            <span className="mx-3 h-5 w-px bg-gray-300 inline-block align-middle" aria-hidden="true"></span>
            <p>
                Designed & Developed by Rankshell | © {new Date().getFullYear()} Ofside. All rights reserved.
            </p>
            </div>

            {/* Right: Links */}
            <div className="flex gap-4 md:gap-6">
                {footerLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="text-gray-700 hover:text-yellow-500 transition-colors"
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </footer>
    );
}
