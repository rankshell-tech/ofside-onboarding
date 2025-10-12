"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import Link from "next/link";

const BRAND_GRADIENT_FROM = "#FFD600";
const BRAND_GRADIENT_TO = "#FFF9C4";
const BRAND_PRIMARY = "#212121";
const BRAND_ACCENT = "#757575";
const BRAND_CARD_BG = "#fffef7";

type StatusType =
  | "SUCCESS"
  | "NOT_ATTEMPTED"
  | "FAILED"
  | "USER_DROPPED"
  | "VOID"
  | "CANCELLED"
  | "PENDING";

  // ref for above statuses https://www.cashfree.com/docs/api-reference/payments/latest/payments/get-payments-for-order#response-payment-status

const statusContent: Record<StatusType | "PENDING", { title: string; message: string }> = {
  SUCCESS: {
    title: "Thank You!",
    message: "We’ve received your submission.<br />Our team will get in touch with you soon.",
  },
  PENDING: {
    title: "Submission Pending",
    message: "Your submission is being processed.<br />Please wait for confirmation.",
  },
  NOT_ATTEMPTED: {
    title: "Submission Not Attempted",
    message: "No submission was made.<br />Please try again or contact support.",
  },
  FAILED: {
    title: "Submission Failed",
    message: "Your submission failed.<br />Please try again or contact support.",
  },
  USER_DROPPED: {
    title: "Submission Cancelled",
    message: "You cancelled the submission.<br />If this was a mistake, please try again.",
  },
  VOID: {
    title: "Submission Voided",
    message: "Your submission was voided.<br />Please contact support for assistance.",
  },
  CANCELLED: {
    title: "Submission Cancelled",
    message: "Your submission was cancelled.<br />Please contact support if you need help.",
  }
 
};

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = React.useState<StatusType>("PENDING");
  const [failedReason, setFailedReason] = React.useState<string | null>(null);

  // 🔹 Fetch payment status on mount

  React.useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
      const res = await fetch(`/api/payment-status?order_id=${orderId}`);
      const data = await res.json();

      console.log("status is ---- "+ data.rawResponse.payment_status)

      if (data) {
        // console.log("Payment status data:", data);
        setStatus(data.rawResponse.payment_status as StatusType);
        setFailedReason(data.rawResponse?.error_details?.error_description || null);
      } else {
        console.error("No data received from payment status API");
        setStatus("PENDING");
        setFailedReason(null);
      }
      } catch (err) {
        console.error("Error fetching payment status:", err);
      setStatus("PENDING");
      setFailedReason(null);
      }
    };

    fetchStatus();
  }, [orderId]);

  // ✅ Pick correct content based on status
  const content = statusContent[status] || statusContent.SUCCESS;

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
              status === "SUCCESS"
          ? "linear-gradient(135deg, #43EA7F 60%, #FFD600 100%)"
          : status === "PENDING"
          ? "linear-gradient(135deg, #FFD600 60%, #FFF176 100%)"
          : "linear-gradient(135deg, #FF6B6B 60%, #FFD600 100%)",
            boxShadow: `0 0 24px ${
              status === "SUCCESS"
          ? "#43EA7F44"
          : status === "PENDING"
          ? "#FFD60044"
          : "#FF6B6B44"
            }, 0 2px 8px #00000022`,
            animation: "pop 0.6s cubic-bezier(.68,-0.55,.27,1.55)",
          }}
        >
          {/* Animated checkmark / cross / loader */}
          {status === "SUCCESS" && (
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
        {["FAILED", "USER_DROPPED", "VOID", "CANCELLED", "NOT_ATTEMPTED"].includes(status) && (
        <span className="text-4xl font-bold text-red-600">×</span>
        )}
        {status === "PENDING" && (
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

    {status !== "SUCCESS" && failedReason && (
      <p className=" mb-8 text-red-500" >
       Reason : {failedReason}
      </p>
    )}

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
