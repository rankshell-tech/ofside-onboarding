import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Delete Your Ofside Account",
    description:
        "Request deletion of your Ofside account and associated data. Email play@ofside.in with subject Account Deletion Request.",
};

const SectionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section data-reveal="feature-card" className="mb-6 p-5 bg-white rounded-xl shadow border border-gray-100 md:p-6">
        {children}
    </section>
);

const DeleteAccountPage = () => (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
        <div className="mx-auto max-w-2xl">
            <section data-reveal="feature-card" className="mb-6 p-6 bg-white rounded-xl shadow border border-gray-100 text-center md:p-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Delete Your Ofside Account</h1>
            </section>

            <SectionBox>
                <p className="text-gray-700 leading-relaxed">
                    If you would like to delete your Ofside account and associated data, please follow the steps below:
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Steps</h2>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li>
                        Send an email to:{" "}
                        <a
                            href="mailto:play@ofside.in?subject=Account%20Deletion%20Request"
                            className="text-blue-600 underline underline-offset-2"
                        >
                            play@ofside.in
                        </a>
                    </li>
                    <li>
                        Use subject:{" "}
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-900">
                            Account Deletion Request
                        </span>
                    </li>
                    <li>Include your registered phone number</li>
                </ol>
            </SectionBox>

            <SectionBox>
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Timeline</h2>
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
                    Our team will process your request within 3–5 working days.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Data deletion</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Your account and personal data will be permanently deleted</li>
                    <li>Some data may be retained if required for legal or security purposes</li>
                </ul>
            </SectionBox>

            <footer
                data-reveal="feature-card"
                className="border-t border-gray-200 pt-6 text-center text-gray-600"
            >
                <p className="text-lg font-bold text-gray-900">Ofside</p>
                <p className="mt-1 text-sm text-gray-500">India&apos;s Sports Ecosystem</p>
            </footer>
        </div>
    </main>
);

export default DeleteAccountPage;
