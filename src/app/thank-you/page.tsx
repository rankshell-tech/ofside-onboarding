"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import Link from "next/link";

const BRAND_GRADIENT_FROM = "#FFD600";
const BRAND_GRADIENT_TO = "#FFF9C4";
const BRAND_PRIMARY = "#212121";
const BRAND_ACCENT = "#757575";
const BRAND_CARD_BG = "#fffef7";

type StatusType = "success" | "pending" | "error" | string;

const statusContent: Record<StatusType, { title: string; message: string }> = {
  success: {
    title: "Thank You!",
    message:
      "We’ve received your submission.<br />Our team will get in touch with you soon.",
  },
  pending: {
    title: "Submission Pending",
    message:
      "Your submission is being processed.<br />Please wait for confirmation.",
  },
  error: {
    title: "Submission Failed",
    message:
      "There was an error with your submission.<br />Please try again or contact support.",
  },
};

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") as StatusType) || "success";

  // ✅ Pick correct content based on status
  const content = statusContent[status] || statusContent.success;

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center font-sans px-4"
      style={{
        background: `linear-gradient(120deg, ${BRAND_GRADIENT_FROM} 0%, ${BRAND_GRADIENT_TO} 100%)`,
      }}
    >
      <div
        className="px-8 py-12 rounded-3xl shadow-2xl text-center w-full max-w-md"
        style={{
          background: BRAND_CARD_BG,
          border: "1px solid #fffde7",
          boxShadow: "0 8px 40px 0 rgba(33,33,33,0.10)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-8 flex items-center justify-center"
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background:
              status === "success"
                ? "linear-gradient(135deg, #43EA7F 60%, #FFD600 100%)"
                : status === "pending"
                ? "linear-gradient(135deg, #FFD600 60%, #FFF176 100%)"
                : "linear-gradient(135deg, #FF6B6B 60%, #FFD600 100%)",
            boxShadow: `0 0 24px ${
              status === "success"
                ? "#43EA7F44"
                : status === "pending"
                ? "#FFD60044"
                : "#FF6B6B44"
            }, 0 2px 8px #00000022`,
            animation: "pop 0.6s cubic-bezier(.68,-0.55,.27,1.55)",
          }}
        >
          {/* Animated checkmark / cross / loader */}
          {status === "success" && (
            <svg
              width="54"
              height="54"
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
                opacity="0.08"
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
                  animation:
                    "checkmark 0.7s 0.2s forwards cubic-bezier(.68,-0.55,.27,1.55)",
                }}
              />
            </svg>
          )}
          {status === "error" && (
            <span className="text-4xl font-bold text-red-600">×</span>
          )}
          {status === "pending" && (
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-extrabold mb-3"
          style={{ color: BRAND_PRIMARY, letterSpacing: "-0.5px" }}
        >
          {content.title}
        </h1>

        {/* Message */}
        <p
          className="text-lg mb-8"
          style={{ color: BRAND_ACCENT, lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: content.message }}
        />

        {/* CTA */}
        <Link
          href="/"
          className="inline-block mt-2 mb-8 px-8 py-3 rounded-full font-semibold text-gray-900 shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-200"
          style={{
            background: "linear-gradient(90deg, #FFD600 0%, #C8F7C5 100%)",
            boxShadow: "0 2px 16px #FFD60055, 0 4px 24px #C8F7C533",
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
            backgroundSize: "200% 200%",
            animation: "gradientMove 2.5s ease-in-out infinite",
          }}
        >
          Go to Home
        </Link>

        {/* Contact Info */}
        <div className="mb-2 text-base font-semibold" style={{ color: BRAND_PRIMARY }}>
          Contact us
        </div>
        <div className="flex items-center justify-center mb-8 text-sm text-gray-700">
          <span className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: BRAND_PRIMARY }}>
              Email:
            </span>
            <a
              href="mailto:Partnercare@ofside.in"
              className="underline"
              style={{ color: "#1976d2" }}
            >
              Partnercare@ofside.in
            </a>
          </span>
          <span className="mx-3 text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: BRAND_PRIMARY }}>
              Phone:
            </span>
            <a
              href="tel:+919811785330"
              className="underline"
              style={{ color: "#1976d2" }}
            >
              +91-9811785330
            </a>
          </span>
        </div>

        {/* Animations */}
        <style>
          {`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes pop {
              0% { transform: scale(0.5); opacity: 0; }
              80% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); }
            }
            @keyframes checkmark {
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
