"use client";
import React from "react";

// Brand colors: yellow, grey, black
const BRAND_GRADIENT_FROM = "#FFD600"; // yellow
const BRAND_GRADIENT_TO = "#FFF9C4";   // light yellow
const BRAND_PRIMARY = "#212121";       // black
const BRAND_ACCENT = "#BDBDBD";        // grey

export default function ThankYouPage() {
    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center font-sans px-4"
            style={{
                background: `linear-gradient(135deg, ${BRAND_GRADIENT_FROM}, ${BRAND_GRADIENT_TO})`,
            }}
        >
            <div className="bg-white px-6 py-10 sm:px-8 sm:py-12 rounded-3xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm">
                <div
                    className="mx-auto mb-6 flex items-center justify-center"
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #43EA7F 60%, #FFD600 100%)", // green to yellow
                        boxShadow: `0 0 20px #43EA7F55`,
                        animation: "pop 0.6s cubic-bezier(.68,-0.55,.27,1.55)"
                    }}
                >
                    {/* Animated checkmark SVG */}
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="30"
                            cy="30"
                            r="28"
                            stroke={BRAND_PRIMARY}
                            strokeWidth="4"
                            fill="none"
                            opacity="0.1"
                        />
                        <polyline
                            points="18,32 27,41 43,23"
                            fill="none"
                            stroke={BRAND_PRIMARY}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 40,
                                strokeDashoffset: 40,
                                animation: "checkmark 0.7s 0.2s forwards cubic-bezier(.68,-0.55,.27,1.55)"
                            }}
                        />
                    </svg>
                </div>
                <h1
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{ color: BRAND_PRIMARY }}
                >
                    Thank You!
                </h1>
                <p className="text-base sm:text-lg" style={{ color: BRAND_ACCENT }}>
                    Your submission has been received.
                </p>
                <style>
                    {`
                        @keyframes pop {
                            0% { transform: scale(0.5); opacity: 0; }
                            80% { transform: scale(1.1); opacity: 1; }
                            100% { transform: scale(1); }
                        }
                        @keyframes checkmark {
                            to { stroke-dashoffset: 0; }
                        }
                        @media (max-width: 640px) {
                            .rounded-3xl { border-radius: 1.25rem; }
                            .shadow-2xl { box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12); }
                        }
                    `}
                </style>
            </div>
        </div>
    );
}
