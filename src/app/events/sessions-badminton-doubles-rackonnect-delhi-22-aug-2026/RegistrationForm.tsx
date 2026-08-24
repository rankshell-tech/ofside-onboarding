"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  EVENT,
  formatInr,
  priceForCheckout,
  type EventConfig,
  type EventGender,
  type EventPlayerLevel,
} from "@/lib/eventConfig";
import { ticketAbsoluteUrl, ticketPath, ticketQrImageUrl } from "@/lib/ticket";
import FutureEventInterestForm from "./FutureEventInterestForm";
import SlotsFullStamp from "./SlotsFullStamp";

type Step = "you" | "partner" | "waiver" | "otp" | "pay" | "done";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};
type RazorpayInstance = { open: () => void };
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => {
        razorpayScriptPromise = null;
        resolve(false);
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

const STEPS: Step[] = ["you", "partner", "waiver", "otp", "pay"];
const STEP_LABELS: Record<Exclude<Step, "done">, string> = {
  you: "You",
  partner: "Partner",
  waiver: "Terms",
  otp: "Verify",
  pay: "Pay",
};

const fieldCls =
  "w-full rounded-xl border-2 border-[#7ec4bc] bg-white px-3.5 py-3 text-[15px] font-medium text-[#1c1c1c] shadow-[0_2px_0_rgba(15,118,110,0.12)] outline-none transition placeholder:font-normal placeholder:text-[#6b7f7c] focus:border-[#0f766e] focus:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]";

/** India-style 10-digit mobile (digits only). */
function normalizePhoneDigits(raw: string): string {
  return String(raw || "").replace(/\D/g, "").slice(-10);
}

function isValidMobile(raw: string): boolean {
  return /^[0-9]{10}$/.test(normalizePhoneDigits(raw));
}

function MobileField({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (digits: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-xl border-2 border-[#7ec4bc] bg-white shadow-[0_2px_0_rgba(15,118,110,0.12)] transition focus-within:border-[#0f766e] focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]">
      <span className="flex shrink-0 items-center border-r border-[#7ec4bc]/70 bg-[#e8f7f4] px-3 text-[15px] font-bold text-[#0f766e]">
        +91
      </span>
      <input
        className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[15px] font-medium text-[#1c1c1c] outline-none placeholder:font-normal placeholder:text-[#6b7f7c]"
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        maxLength={10}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        autoComplete={autoComplete}
        aria-label={placeholder}
      />
    </div>
  );
}

const btnPrimary =
  "w-full rounded-xl bg-[#0f766e] py-3 text-[14px] font-bold text-white shadow-[0_3px_0_#0a5c56] transition hover:bg-[#0d9488] active:translate-y-px active:shadow-none disabled:opacity-60";
const btnGhost =
  "rounded-xl border-2 border-[#0f766e]/35 bg-white px-4 py-3 text-[14px] font-semibold text-[#0f766e] hover:border-[#0f766e] hover:bg-[#d8f3ef]";

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  aside,
  wide,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
  label: string;
  aside?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f766e]/80">
          {label}
        </p>
        {aside}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full text-[12px] font-semibold transition ${
                wide ? "min-w-[4.25rem] px-4 py-1" : "px-2.5 py-1"
              } ${
                on
                  ? "bg-[#0f766e] text-white shadow-[0_2px_0_#0a5c56]"
                  : "border-2 border-[#7ec4bc] bg-white text-[#2a2a2a] hover:border-[#0f766e] hover:text-[#0f766e]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildCalendarUrl(event: EventConfig) {
  const text = encodeURIComponent(event.name);
  const details = encodeURIComponent(
    `${event.shortDescription}\nVenue: ${event.venueName}\n${event.reportingNote}`
  );
  const location = encodeURIComponent(event.venueAddress);
  const start = event.calendarStartIso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = event.calendarEndIso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

const CONFETTI_COLORS = ["#FFF201", "#0f766e", "#14b8a6", "#f472b6", "#38bdf8", "#fb923c"];

function DiscountConfetti({ burstKey }: { burstKey: number }) {
  const pieces = useMemo(() => {
    if (!burstKey) return [];
    return Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.35;
      const dist = 48 + (i % 7) * 14;
      return {
        id: `${burstKey}-${i}`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        rot: (i * 47) % 360,
        delay: (i % 6) * 20,
        w: 5 + (i % 3) * 2,
        h: 8 + (i % 4) * 2,
      };
    });
  }, [burstKey]);

  if (!burstKey || pieces.length === 0) return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0 overflow-visible"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-[1px] opacity-0"
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            animation: `sessions-confetti 900ms cubic-bezier(0.15, 0.75, 0.25, 1) ${p.delay}ms both`,
            ["--cx" as string]: `${p.x}px`,
            ["--cy" as string]: `${p.y}px`,
            ["--cr" as string]: `${p.rot}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes sessions-confetti {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(0deg); }
          18% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--cx)), calc(-50% + var(--cy) + 36px)) scale(1) rotate(var(--cr));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes sessions-confetti {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%); }
          }
        }
      `}</style>
    </span>
  );
}

export default function RegistrationForm({
  soldOut = false,
  event = EVENT,
}: {
  soldOut?: boolean;
  event?: EventConfig;
}) {
  const [step, setStep] = useState<Step>("you");
  const [liveSoldOut, setLiveSoldOut] = useState(soldOut);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadGender, setLeadGender] = useState<EventGender | "">("");
  const [leadLevel, setLeadLevel] = useState<EventPlayerLevel | "">("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerGender, setPartnerGender] = useState<EventGender | "">("");
  const [bringingOwnEquipment, setBringingOwnEquipment] = useState<"Yes" | "No" | "">("");
  const [waiverTerms, setWaiverTerms] = useState(false);
  const [otp, setOtp] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const payAutoStarted = useRef(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const prevBothFemale = useRef(false);

  useEffect(() => {
    setLiveSoldOut(soldOut);
  }, [soldOut]);

  // Prefetch Razorpay while the user is filling the form so Pay opens faster.
  useEffect(() => {
    void loadRazorpayScript();
  }, []);

  const bothFemale = leadGender === "Female" && partnerGender === "Female";
  const amountInr = useMemo(() => priceForCheckout(bothFemale, event), [bothFemale, event]);
  const mapsUrl =
    event.mapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapsQuery)}`;
  const ticketUrl = useMemo(() => {
    if (!ticketCode) return "";
    if (typeof window !== "undefined") return `${window.location.origin}${ticketPath(ticketCode)}`;
    return ticketAbsoluteUrl(ticketCode);
  }, [ticketCode]);
  const ticketQrSrc = useMemo(
    () => (ticketUrl ? ticketQrImageUrl(ticketUrl, 160) : ""),
    [ticketUrl]
  );
  const whatsappShareHref = useMemo(() => {
    const lines = [
      `SESSIONS ticket confirmed`,
      `You + ${partnerName || "partner"}`,
      `${event.date} · ${event.timeWindow}`,
      event.venueName,
      ticketCode ? `Code: ${ticketCode}` : null,
      ticketUrl ? `Ticket: ${ticketUrl}` : null,
    ].filter(Boolean);
    return `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [partnerName, ticketCode, ticketUrl, event.date, event.timeWindow, event.venueName]);

  useEffect(() => {
    if (bothFemale && !prevBothFemale.current) {
      setConfettiKey((k) => k + 1);
    }
    prevBothFemale.current = bothFemale;
  }, [bothFemale]);

  const payload = useCallback(
    () => ({
      eventSlug: event.slug,
      leadName,
      leadEmail,
      leadPhone: normalizePhoneDigits(leadPhone),
      leadGender,
      leadLevel,
      partnerName,
      partnerEmail,
      partnerPhone: normalizePhoneDigits(partnerPhone),
      partnerGender,
      bringingOwnEquipment: bringingOwnEquipment === "Yes",
      waiverTerms,
    }),
    [
      event.slug,
      leadName,
      leadEmail,
      leadPhone,
      leadGender,
      leadLevel,
      partnerName,
      partnerEmail,
      partnerPhone,
      partnerGender,
      bringingOwnEquipment,
      waiverTerms,
    ]
  );

  const submitDetails = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = await res.json().catch(() => null);
      if (!data || typeof data !== "object") {
        throw new Error(`Could not start registration (${res.status} ${res.statusText || "error"}).`);
      }
      if (data?.soldOut) {
        setLiveSoldOut(true);
        throw new Error(data.message || "All slots booked.");
      }
      if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong.");
      setRegistrationId(data.registrationId);
      setStep("otp");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [payload]);

  const verifyOtp = useCallback(async () => {
    setError("");
    if (!/^\d{6}$/.test(otp.trim())) return setError("Enter the 6-digit code from your email.");
    setLoading(true);
    try {
      const res = await fetch("/api/event/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Verification failed.");
      setStep("pay");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }, [otp, registrationId]);

  const resendOtp = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not resend code.");
      setRegistrationId(data.registrationId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }, [payload]);

  const pay = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      // Order creation + checkout script in parallel (script is usually already prefetched).
      const [orderRes, ok] = await Promise.all([
        fetch("/api/event/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId }),
        }),
        loadRazorpayScript(),
      ]);
      const order = await orderRes.json();
      if (order?.soldOut) {
        setLiveSoldOut(true);
        throw new Error(order.message || "All slots booked.");
      }
      if (!orderRes.ok || !order.success) throw new Error(order.message || "Could not start payment.");
      if (!ok || !window.Razorpay) throw new Error("Could not load payment gateway. Check your connection.");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: order.eventName,
        description: "Badminton doubles entry + goodies + FREE Ofside PRO (worth ₹399/year)",
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: "#0f766e" },
        handler: async (r: RazorpayResponse) => {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/event/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ registrationId, ...r }),
            });
            const verify = await verifyRes.json();
            if (!verifyRes.ok || !verify.success) throw new Error(verify.message || "Payment verification failed.");
            if (verify.ticketCode) setTicketCode(String(verify.ticketCode));
            setStep("done");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment.");
      setLoading(false);
    }
  }, [registrationId]);

  useEffect(() => {
    if (step !== "pay") {
      payAutoStarted.current = false;
      return;
    }
    if (payAutoStarted.current || !registrationId) return;
    payAutoStarted.current = true;
    void pay();
  }, [step, registrationId, pay]);

  if (event.completed || liveSoldOut) {
    return (
      <div className="rounded-2xl border border-[#8fcfc6] bg-[#c5ebe6] p-4 text-[#1c1c1c] shadow-[0_12px_40px_-16px_rgba(15,118,110,0.18)] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-[#1c1c1c]">
              {event.completed ? "Event completed" : "Registration closed"}
            </h3>
            <p className="mt-0.5 text-xs text-[#5f8f88]">
              {event.date} · {event.timeWindow}
            </p>
          </div>
          <SlotsFullStamp spots={event.maxRegistrations} size="sm" />
        </div>
        <FutureEventInterestForm event={event} embedded />
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step === "done" ? "pay" : step);

  return (
    <div className="rounded-2xl border border-[#8fcfc6] bg-[#c5ebe6] p-4 text-[#1c1c1c] shadow-[0_12px_40px_-16px_rgba(15,118,110,0.18)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-[#1c1c1c]">Badminton doubles entry</h3>
          <p className="text-xs text-[#5f8f88]">₹{event.displayPriceInr} / player · goodies included</p>
        </div>
        <div className="shrink-0 rounded-xl bg-[#0f766e] px-3 py-2 text-right text-white">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">Total</p>
          <p className="text-base font-bold leading-none">₹{formatInr(amountInr)}</p>
        </div>
      </div>

      {step !== "done" ? (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="font-semibold text-[#1c1c1c]">
              {STEP_LABELS[STEPS[stepIndex] as Exclude<Step, "done">]}
            </span>
            <span className="tabular-nums text-[#5f8f88]">
              {stepIndex + 1}/{STEPS.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#cce8e4]">
            <div
              className="h-full rounded-full bg-[#0f766e] transition-[width] duration-300 ease-out"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
          {error}
        </div>
      ) : null}

      {step === "you" && (
        <div className="flex flex-col gap-3">
          <input className={fieldCls} placeholder="Full name *" value={leadName} onChange={(e) => setLeadName(e.target.value)} autoComplete="name" />
          <MobileField
            placeholder="10-digit mobile *"
            value={leadPhone}
            onChange={setLeadPhone}
            autoComplete="tel"
          />
          <input className={fieldCls} type="email" inputMode="email" placeholder="Email address *" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} autoComplete="email" />
          <ChipGroup
            options={event.genders}
            value={leadGender}
            onChange={setLeadGender}
            label="Gender *"
            aside={
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f9a8d4] bg-[#db2777] px-2 py-0.5 text-[10px] leading-none text-white">
                Avail 10% off female doubles
              </span>
            }
          />
          <ChipGroup options={event.playerLevels} value={leadLevel} onChange={setLeadLevel} label="Player level *" />
          <button
            type="button"
            onClick={() => {
              setError("");
              if (!leadName.trim()) return setError("Please enter your full name.");
              if (!isValidMobile(leadPhone)) return setError("Please enter a valid 10-digit mobile number.");
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) return setError("Please enter a valid email.");
              if (!leadGender) return setError("Please select your gender.");
              if (!leadLevel) return setError("Please select your player level.");
              setStep("partner");
            }}
            className={`mt-2 ${btnPrimary}`}
          >
            Next · Partner details
          </button>
        </div>
      )}

      {step === "partner" && (
        <div className="flex flex-col gap-3">
          <input className={fieldCls} placeholder="Partner full name *" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} />
          <input className={fieldCls} type="email" inputMode="email" placeholder="Partner email *" value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} autoComplete="off" />
          <MobileField
            placeholder="10-digit mobile *"
            value={partnerPhone}
            onChange={setPartnerPhone}
          />
          <ChipGroup options={event.genders} value={partnerGender} onChange={setPartnerGender} label="Partner gender *" />
          {bothFemale ? (
            <div className="relative overflow-visible rounded-xl border-2 border-[#f9a8d4] bg-white px-3.5 py-2.5 shadow-[0_2px_0_rgba(219,39,119,0.12)]">
              <DiscountConfetti burstKey={confettiKey} />
              <p className="flex items-center gap-2 text-[13px] font-semibold leading-none text-[#9d174d]">
                <span className="text-[18px] leading-none" aria-hidden>
                  🎉
                </span>
                <span className="min-w-0 truncate">
                  Female doubles discount applied · ₹{formatInr(amountInr)}
                </span>
              </p>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <ChipGroup
              options={["Yes", "No"] as const}
              value={bringingOwnEquipment}
              onChange={setBringingOwnEquipment}
              label="Will your doubles group bring equipment? *"
              wide
            />
            {bringingOwnEquipment === "No" ? (
              <p className="text-[13px] font-medium leading-snug text-[#0f766e]">
                Don&apos;t worry, we&apos;ll provide racquets at the venue for playing.
              </p>
            ) : null}
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setStep("you")} className={btnGhost}>
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                if (!partnerName.trim()) return setError("Please enter your partner's name.");
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail.trim())) return setError("Please enter a valid partner email.");
                if (partnerEmail.trim().toLowerCase() === leadEmail.trim().toLowerCase())
                  return setError("Partner email must be different from yours.");
                if (!isValidMobile(partnerPhone)) return setError("Please enter a valid 10-digit partner mobile.");
                if (!partnerGender) return setError("Please select your partner's gender.");
                if (!bringingOwnEquipment)
                  return setError("Please tell us if your doubles group will bring equipment.");
                setStep("waiver");
              }}
              className={`flex-1 ${btnPrimary}`}
            >
              Next · Terms
            </button>
          </div>
        </div>
      )}

      {step === "waiver" && (
        <div className="flex flex-col gap-4">
          <label
            className={`flex cursor-pointer gap-3 rounded-xl border-2 px-3.5 py-3 transition ${
              waiverTerms
                ? "border-[#0f766e] bg-white shadow-[0_2px_0_rgba(15,118,110,0.12)]"
                : "border-[#7ec4bc] bg-white/80 hover:border-[#0f766e]"
            }`}
          >
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#0f766e]"
              checked={waiverTerms}
              onChange={(e) => setWaiverTerms(e.target.checked)}
            />
            <span className="text-[13px] leading-snug text-[#444]">
              I agree to the{" "}
              <a
                href="/events/sessions/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0f766e] underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Terms &amp; Conditions
              </a>
              .
            </span>
          </label>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setStep("partner")} className={btnGhost}>
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                if (!waiverTerms) return setError("Please accept the Terms & Conditions to continue.");
                void submitDetails();
              }}
              disabled={loading}
              className={`flex-1 ${btnPrimary}`}
            >
              {loading ? "Sending code…" : "Verify email"}
            </button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-[#5f8f88]">
            Enter the code sent to <span className="font-semibold text-[#1c1c1c]">{leadEmail}</span>
          </p>
          <input
            className={`${fieldCls} text-center text-2xl font-bold tracking-[0.4em]`}
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <button type="button" onClick={verifyOtp} disabled={loading} className={`mt-2 ${btnPrimary}`}>
            {loading ? "Verifying…" : "Confirm & continue"}
          </button>
          <div className="flex items-center justify-between text-[12px]">
            <button type="button" onClick={() => setStep("waiver")} className="font-semibold text-[#5f8f88] hover:text-[#0f766e]">
              ← Edit details
            </button>
            <button type="button" onClick={resendOtp} disabled={loading} className="font-semibold text-[#0f766e] underline underline-offset-2 disabled:opacity-50">
              Resend code
            </button>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div className="flex flex-col gap-4 py-1 text-center">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-semibold text-emerald-800">
            ✓ Email verified
          </p>
          <p className="text-[14px] text-[#5f8f88]">
            {loading
              ? "Opening Razorpay…"
              : bothFemale
                ? `Total ₹${formatInr(amountInr)} (10% female doubles off)`
                : `Total ₹${formatInr(amountInr)}`}
          </p>
          {!loading ? (
            <button type="button" onClick={pay} className={btnPrimary}>
              Pay ₹{formatInr(amountInr)}
            </button>
          ) : null}
          <p className="text-[11px] text-[#8aabb0]">Secured by Razorpay</p>
        </div>
      )}

      {step === "done" && (
        <div className="py-1">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] text-xl text-white">
              ✓
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#1c1c1c]">Thank you — you&apos;re in!</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5f8f88]">
              Thanks for registering for {event.seriesName}. We can&apos;t wait to see you and{" "}
              {partnerName || "your partner"} on court.
            </p>
            <p className="mt-1 text-[12px] text-[#8aabb0]">
              Confirmation email sent to {leadEmail}
              {partnerEmail ? ` and ${partnerEmail}` : ""}.
            </p>
          </div>

          {ticketCode ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#8fcfc6] bg-white">
              <div className="bg-[#0f766e] px-3.5 py-3 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                  Entry ticket
                </p>
                <p className="mt-0.5 text-[14px] font-bold">Badminton doubles</p>
                <p className="mt-1 text-[12px] text-white/80">
                  {event.date} · {event.timeWindow}
                </p>
              </div>
              <div className="space-y-3 px-3.5 py-3.5">
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#888]">You</p>
                    <p className="font-semibold text-[#1c1c1c]">{leadName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#888]">Partner</p>
                    <p className="font-semibold text-[#1c1c1c]">{partnerName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#888]">Venue</p>
                    <p className="font-medium text-[#1c1c1c]">{event.venueName}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-[#b6ddd7] bg-[#f3fbf9] px-3 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5f8f88]">
                    Verification code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-[0.18em] text-[#0f766e]">
                    {ticketCode}
                  </p>
                  <div className="mx-auto mt-3 inline-flex rounded-xl bg-white p-2 ring-1 ring-[#e0efec]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ticketQrSrc}
                      alt={`QR for ${ticketCode}`}
                      width={140}
                      height={140}
                      className="h-[140px] w-[140px]"
                    />
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-[#666]">
                    Show this QR or code at check-in for verification.
                  </p>
                  <a
                    href={ticketPath(ticketCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[12px] font-semibold text-[#0f766e] underline underline-offset-2"
                  >
                    Open full ticket
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#b6ddd7] bg-white py-2.5 text-center text-[13px] font-semibold text-[#0f766e] hover:bg-white/80">
              Venue
            </a>
            <a href={buildCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#b6ddd7] bg-white py-2.5 text-center text-[13px] font-semibold text-[#0f766e] hover:bg-white/80">
              Calendar
            </a>
          </div>

          <a
            href={event.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full flex-col items-center justify-center rounded-xl bg-[#25D366] px-3 py-3 text-white hover:brightness-110"
          >
            <span className="text-[14px] font-bold">Join WhatsApp group</span>
            <span className="mt-0.5 text-center text-[11px] font-medium text-white/90">
              For important announcements about the event
            </span>
          </a>

          <a
            href={whatsappShareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center rounded-xl border border-[#b6ddd7] bg-white py-3 text-[14px] font-bold text-[#0f766e] hover:bg-white/80"
          >
            Share ticket on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
