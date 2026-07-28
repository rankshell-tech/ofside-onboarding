"use client";

import { useCallback, useMemo, useState } from "react";
import {
  EVENT,
  formatInr,
  priceForCheckout,
  type EventGender,
  type EventPlayerLevel,
} from "@/lib/eventConfig";

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

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const STEPS: Step[] = ["you", "partner", "waiver", "otp", "pay"];
const STEP_LABELS: Record<Exclude<Step, "done">, string> = {
  you: "You",
  partner: "Partner",
  waiver: "Consent",
  otp: "Verify",
  pay: "Pay",
};

const fieldCls =
  "w-full rounded-xl border border-[#e5e5e5] bg-white px-3.5 py-2.5 text-[14px] text-[#1c1c1c] outline-none transition placeholder:text-[#aaa] focus:border-[#1c1c1c]";

const btnPrimary =
  "w-full rounded-xl bg-[#FFF201] py-3 text-[14px] font-bold text-[#1c1c1c] transition hover:bg-[#ffe600] disabled:opacity-60";
const btnGhost =
  "rounded-xl border border-[#e5e5e5] px-4 py-3 text-[14px] font-semibold text-[#4d4d4d] hover:bg-[#f5f5f5]";

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#888]">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                on
                  ? "bg-[#1c1c1c] text-white"
                  : "border border-[#e5e5e5] bg-white text-[#4d4d4d] hover:border-[#ccc]"
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

function buildCalendarUrl() {
  const text = encodeURIComponent(EVENT.name);
  const details = encodeURIComponent(
    `${EVENT.shortDescription}\nVenue: ${EVENT.venueName}\n${EVENT.reportingNote}`
  );
  const location = encodeURIComponent(EVENT.venueAddress);
  const start = EVENT.calendarStartIso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = EVENT.calendarEndIso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export default function RegistrationForm({ soldOut = false }: { soldOut?: boolean }) {
  const [step, setStep] = useState<Step>("you");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadGender, setLeadGender] = useState<EventGender | "">("");
  const [leadLevel, setLeadLevel] = useState<EventPlayerLevel | "">("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerGender, setPartnerGender] = useState<EventGender | "">("");
  const [waiverOwnRisk, setWaiverOwnRisk] = useState(false);
  const [waiverMediaConsent, setWaiverMediaConsent] = useState(false);
  const [waiverTerms, setWaiverTerms] = useState(false);
  const [otp, setOtp] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bothFemale = leadGender === "Female" && partnerGender === "Female";
  const amountInr = useMemo(() => priceForCheckout(bothFemale), [bothFemale]);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;

  const payload = useCallback(
    () => ({
      leadName,
      leadEmail,
      leadPhone,
      leadGender,
      leadLevel,
      emergencyContact: emergencyContact || undefined,
      partnerName,
      partnerPhone,
      partnerGender,
      waiverOwnRisk,
      waiverMediaConsent,
      waiverTerms,
    }),
    [
      leadName,
      leadEmail,
      leadPhone,
      leadGender,
      leadLevel,
      emergencyContact,
      partnerName,
      partnerPhone,
      partnerGender,
      waiverOwnRisk,
      waiverMediaConsent,
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
      const data = await res.json();
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
      const orderRes = await fetch("/api/event/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok || !order.success) throw new Error(order.message || "Could not start payment.");

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load payment gateway. Check your connection.");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: order.eventName,
        description: "Doubles entry + FREE Ofside PRO",
        order_id: order.orderId,
        prefill: order.prefill,
        theme: { color: "#1c1c1c" },
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

  if (soldOut) {
    return (
      <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg text-red-500">
          ✕
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#1c1c1c]">We&apos;re sold out</h3>
        <p className="mx-auto mt-2 text-sm leading-relaxed text-[#666]">
          All {EVENT.maxRegistrations} doubles spots are taken. Follow Ofside for the next drop.
        </p>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step === "done" ? "pay" : step);

  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-[#1c1c1c]">Doubles entry</h3>
          <p className="text-xs text-[#888]">2 players · email verify · pay once</p>
        </div>
        <div className="shrink-0 rounded-xl bg-[#FFF201] px-3 py-2 text-right text-[#1c1c1c]">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">Total</p>
          <p className="text-base font-bold leading-none">₹{formatInr(amountInr)}</p>
        </div>
      </div>

      {step !== "done" ? (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 font-bold tracking-tight text-[#1c1c1c]">
              <span className="inline-block h-1.5 w-1.5 animate-progress-tip rounded-full bg-[#FFF201] ring-1 ring-[#e8d600]" />
              {STEP_LABELS[STEPS[stepIndex] as Exclude<Step, "done">]}
            </span>
            <span className="tabular-nums font-bold text-[#1c1c1c]">
              {stepIndex + 1}
              <span className="text-[#c4c4c4]">/{STEPS.length}</span>
            </span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-[#ececec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.09)]">
            <div
              className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(90deg,#FFD400_0%,#FFF201_55%,#FFF773_100%)] shadow-[0_0_14px_rgba(255,226,0,0.9)] transition-[width] duration-500 ease-out"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            >
              <div className="absolute inset-0 animate-progress-stripes" />
              {/* bright leading tip */}
              <div className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-white/80 blur-[1px]" />
            </div>
          </div>
          {/* step ticks */}
          <div className="mt-2 flex items-center justify-between px-0.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? "bg-[#1c1c1c]" : "bg-[#d8d8d8]"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
          {error}
        </div>
      ) : null}

      {step === "you" && (
        <div className="space-y-3">
          <input className={fieldCls} placeholder="Full name *" value={leadName} onChange={(e) => setLeadName(e.target.value)} autoComplete="name" />
          <input className={fieldCls} type="tel" inputMode="tel" placeholder="Mobile number *" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} autoComplete="tel" />
          <input className={fieldCls} type="email" inputMode="email" placeholder="Email address *" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} autoComplete="email" />
          <ChipGroup options={EVENT.genders} value={leadGender} onChange={setLeadGender} label="Gender *" />
          <ChipGroup options={EVENT.playerLevels} value={leadLevel} onChange={setLeadLevel} label="Player level *" />
          <input
            className={fieldCls}
            type="tel"
            inputMode="tel"
            placeholder="Emergency contact (optional)"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              setError("");
              if (!leadName.trim()) return setError("Please enter your full name.");
              if (!/^\+?[0-9]{7,15}$/.test(leadPhone.trim())) return setError("Please enter a valid mobile number.");
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) return setError("Please enter a valid email.");
              if (!leadGender) return setError("Please select your gender.");
              if (!leadLevel) return setError("Please select your player level.");
              setStep("partner");
            }}
            className={btnPrimary}
          >
            Next · Partner details
          </button>
        </div>
      )}

      {step === "partner" && (
        <div className="space-y-3">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900">
            <span className="font-bold">10% off</span> if both female — verified at the venue.
          </p>
          <input className={fieldCls} placeholder="Partner full name *" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} />
          <input className={fieldCls} type="tel" inputMode="tel" placeholder="Partner mobile *" value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)} />
          <ChipGroup options={EVENT.genders} value={partnerGender} onChange={setPartnerGender} label="Partner gender *" />
          {bothFemale ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-[13px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Women&apos;s discount applied · ₹{formatInr(amountInr)}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep("you")} className={btnGhost}>
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                if (!partnerName.trim()) return setError("Please enter your partner's name.");
                if (!/^\+?[0-9]{7,15}$/.test(partnerPhone.trim())) return setError("Please enter a valid partner mobile.");
                if (!partnerGender) return setError("Please select your partner's gender.");
                setStep("waiver");
              }}
              className={`flex-1 ${btnPrimary}`}
            >
              Next · Consent
            </button>
          </div>
        </div>
      )}

      {step === "waiver" && (
        <div className="space-y-2.5">
          {(
            [
              {
                id: "risk",
                checked: waiverOwnRisk,
                set: setWaiverOwnRisk,
                label: "I understand this is a community sports event and I participate at my own risk.",
              },
              {
                id: "media",
                checked: waiverMediaConsent,
                set: setWaiverMediaConsent,
                label: "I allow Ofside to use photos/videos from the event for promotional purposes.",
              },
              {
                id: "terms",
                checked: waiverTerms,
                set: setWaiverTerms,
                label: "I agree to the Terms & Conditions.",
              },
            ] as const
          ).map((w) => (
            <label
              key={w.id}
              className={`flex cursor-pointer gap-3 rounded-xl border px-3.5 py-3 transition ${
                w.checked ? "border-[#1c1c1c] bg-[#fafafa]" : "border-[#e5e5e5] bg-white hover:border-[#ccc]"
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[#1c1c1c]"
                checked={w.checked}
                onChange={(e) => w.set(e.target.checked)}
              />
              <span className="text-[13px] leading-snug text-[#4d4d4d]">{w.label}</span>
            </label>
          ))}
          <div className="flex gap-2 pt-0.5">
            <button type="button" onClick={() => setStep("partner")} className={btnGhost}>
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                if (!waiverOwnRisk || !waiverMediaConsent || !waiverTerms)
                  return setError("Please accept all three to continue.");
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
        <div className="space-y-3">
          <p className="text-[13px] text-[#666]">
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
          <button type="button" onClick={verifyOtp} disabled={loading} className={btnPrimary}>
            {loading ? "Verifying…" : "Confirm & continue"}
          </button>
          <div className="flex items-center justify-between text-[12px]">
            <button type="button" onClick={() => setStep("waiver")} className="font-semibold text-[#888] hover:text-[#1c1c1c]">
              ← Edit details
            </button>
            <button type="button" onClick={resendOtp} disabled={loading} className="font-semibold text-[#1c1c1c] underline underline-offset-2 disabled:opacity-50">
              Resend code
            </button>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div className="space-y-3">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-semibold text-emerald-700">
            ✓ Email verified · includes FREE Ofside PRO
          </p>

          <div className="rounded-xl border border-[#e8e8e8] px-3.5 py-3">
            <ul className="space-y-1.5">
              {EVENT.whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-[#4d4d4d]">
                  <span className="text-[#1c1c1c]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-end justify-between border-t border-[#f0f0f0] pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">
                {bothFemale ? "Total (10% off)" : "Total due"}
              </p>
              <p className="text-2xl font-bold tabular-nums text-[#1c1c1c]">₹{formatInr(amountInr)}</p>
            </div>
          </div>

          <button type="button" onClick={pay} disabled={loading} className={btnPrimary}>
            {loading ? "Opening payment…" : `Pay ₹${formatInr(amountInr)}`}
          </button>
          <p className="text-center text-[11px] text-[#aaa]">Secured by Razorpay</p>
        </div>
      )}

      {step === "done" && (
        <div className="py-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF201] text-xl text-[#1c1c1c]">
            ✓
          </div>
          <h3 className="mt-3 text-lg font-bold text-[#1c1c1c]">You&apos;re in!</h3>
          <p className="mt-1.5 text-sm text-[#666]">
            You + {partnerName || "partner"} · confirmation to {leadEmail}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#e5e5e5] py-2.5 text-[13px] font-semibold text-[#1c1c1c] hover:bg-[#f5f5f5]">
              Venue
            </a>
            <a href={buildCalendarUrl()} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#e5e5e5] py-2.5 text-[13px] font-semibold text-[#1c1c1c] hover:bg-[#f5f5f5]">
              Calendar
            </a>
            <a href={EVENT.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#25D366] py-2.5 text-[13px] font-bold text-white hover:brightness-110">
              WhatsApp
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`You're my doubles partner for ${EVENT.name} — we're locked in. See you there!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#FFF201] py-2.5 text-[13px] font-bold text-[#1c1c1c] hover:bg-[#ffe600]"
            >
              Invite
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
