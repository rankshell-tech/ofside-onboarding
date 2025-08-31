import React from "react";

const footerLinks = [
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Rescheduling Policy", href: "/rescheduling-policy" }
];

export default function Footer() {
    return (
        <footer className="flex flex-col md:flex-row items-center md:justify-between px-4 py-4 bg-gray-50 border-t border-gray-200 text-sm">
            {/* Middle: Copyright */}
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto mb-4 md:mb-0">
                {/* Left: Instagram Icon */}
                <a
                    href="https://www.instagram.com/stories/ofsideapp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-pink-600 mb-2 md:mb-0"
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
                <span className="hidden md:inline mx-3 h-5 w-px bg-gray-300 align-middle" aria-hidden="true"></span>
                <p className="text-center md:text-left">
                    Designed & Developed by <a href="https://therankshell.com" target="_blank" rel="noopener noreferrer">Rankshell</a> | © {new Date().getFullYear()} Ofside. All rights reserved.
                </p>
            </div>

            {/* Right: Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-6 w-full md:w-auto">
                {footerLinks.map((link, idx) => (
                    <React.Fragment key={link.label}>
                        <a
                            href={link.href}
                            className="text-gray-700 hover:text-yellow-500 transition-colors"
                        >
                            {link.label}
                        </a>
                        {idx < footerLinks.length - 1 && (
                            <span className="mx-2 text-gray-400 select-none">•</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </footer>
    );
}
