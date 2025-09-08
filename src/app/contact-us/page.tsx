'use client';
import React from "react";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen max-w-4xl mx-auto py-16 px-6 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Contact Us</h1>
            <p className="mb-10 text-center text-gray-600 text-lg">
            We&apos;d love to hear from you! Reach out using the details below.
            </p>
            <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-xl shadow-lg gap-8 mb-10">
            <img
                src="https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Contact Us"
                className="w-64 h-64 rounded-full object-cover border-4 border-blue-100 shadow"
            />
            
            <div className="flex-1 text-gray-700 space-y-4">
                  <div className="flex items-center gap-2 justify-start">
                    <span className="font-semibold ">Legal Name:</span>
                    <a
                        href="https://therankshell.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d2c912] hover:underline focus:underline transition-colors"
                    >
                        Rankshell Marketing Solutions
                    </a>
                </div>
                <div className="flex items-center gap-2 justify-start">
                    <span className="font-semibold ">Email:</span>
                    <a href="mailto:Partnercare@ofside.in" className=" underline break-all">
                        Partnercare@ofside.in
                    </a>
                </div>
              
                <div className="flex items-center gap-2 justify-start">
                <span className="font-semibold ">Phone:</span>
                <a href="tel:+919811785330" className=" underline">
                   +91-9811785330
                </a>
                </div>
                <div className="flex items-center gap-2 justify-start">
                <span className="font-semibold ">Address:</span>
                <span>Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030</span>
                </div>
            </div>
            </div>

        </div>
    );
}
