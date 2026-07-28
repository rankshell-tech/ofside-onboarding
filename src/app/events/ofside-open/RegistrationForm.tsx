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
  "dark-autofill w-full rounded-2xl border border-white/10 bg-[#12141a] px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/25";

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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                on
                  ? "bg-yellow-400 text-gray-950 shadow-[0_8px_24px_-8px_rgba(255,242,1,0.7)]"
                  : "border border-white/15 bg-white/5 text-white/75 hover:border-white/35 hover:bg-white/10"
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
        theme: { color: "#0a0a0a" },
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
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0f14] p-8 text-center text-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-2xl ring-1 ring-red-400/30">
          ✕
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight">We&apos;re sold out</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
          All {EVENT.maxRegistrations} doubles spots are taken for this session. Follow Ofside for the next drop.
        </p>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step === "done" ? "pay" : step);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0f14] p-5 text-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-300/90">Lock your court</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">Doubles registration</h3>
          <p className="mt-1 text-sm text-white/50">2 players · email verify · pay once</p>
        </div>
        <div className="rounded-2xl bg-yellow-400 px-3.5 py-2 text-right text-gray-950 shadow-[0_10px_28px_-8px_rgba(255,242,1,0.65)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">Total</p>
          <p className="text-lg font-extrabold leading-none">₹{formatInr(amountInr)}</p>
        </div>
      </div>

      {step !== "done" ? (
        <div className="relative mb-6 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= stepIndex ? "bg-yellow-400" : "bg-white/10"}`} />
              <p className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wide ${i <= stepIndex ? "text-yellow-200" : "text-white/30"}`}>
                {STEP_LABELS[s as Exclude<Step, "done">]}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="relative mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {step === "you" && (
        <div className="relative space-y-4">
          <input className={fieldCls} placeholder="Full name *" value={leadName} onChange={(e) => setLeadName(e.target.value)} autoComplete="name" />
          <input className={fieldCls} type="tel" inputMode="tel" placeholder="Mobile number *" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} autoComplete="tel" />
          <input className={fieldCls} type="email" inputMode="email" placeholder="Email address *" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} autoComplete="email" />
          <p className="-mt-2 text-[11px] text-white/40">Verification happens on email — we&apos;ll send a 6-digit code.</p>
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
            className="w-full rounded-full bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300"
          >
            Next · Partner details
          </button>
        </div>
      )}

      {step === "partner" && (
        <div className="relative space-y-4">
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
            Bring your doubles partner. <span className="font-bold">10% off</span> if you&apos;re both female —
            gender is checked at the venue, so don&apos;t game it.
          </div>
          <input className={fieldCls} placeholder="Partner full name *" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} />
          <input className={fieldCls} type="tel" inputMode="tel" placeholder="Partner mobile *" value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)} />
          <ChipGroup options={EVENT.genders} value={partnerGender} onChange={setPartnerGender} label="Partner gender *" />
          {bothFemale ? (
            <p className="rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
              Women&apos;s pair discount applied · ₹{formatInr(amountInr)} total
            </p>
          ) : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep("you")} className="rounded-full border border-white/20 px-5 py-3.5 text-sm font-bold text-white/80 hover:bg-white/5">
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
              className="flex-1 rounded-full bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300"
            >
              Next · Consent
            </button>
          </div>
        </div>
      )}

      {step === "waiver" && (
        <div className="relative space-y-3">
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
              className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                w.checked ? "border-yellow-400/40 bg-yellow-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-yellow-400"
                checked={w.checked}
                onChange={(e) => w.set(e.target.checked)}
              />
              <span className="text-sm leading-relaxed text-white/80">{w.label}</span>
            </label>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setStep("partner")} className="rounded-full border border-white/20 px-5 py-3.5 text-sm font-bold text-white/80 hover:bg-white/5">
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
              className="flex-1 rounded-full bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {loading ? "Sending code…" : "Verify email"}
            </button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="relative space-y-4">
          <p className="text-sm text-white/65">
            Drop the 6-digit code we emailed to <span className="font-semibold text-white">{leadEmail}</span>.
          </p>
          <input
            className={`${fieldCls} text-center text-2xl font-bold tracking-[0.45em]`}
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <button
            type="button"
            onClick={verifyOtp}
            disabled={loading}
            className="w-full rounded-full bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Confirm & continue"}
          </button>
          <div className="flex items-center justify-between text-[12px]">
            <button type="button" onClick={() => setStep("waiver")} className="font-semibold text-white/50 hover:text-white">
              ← Edit details
            </button>
            <button type="button" onClick={resendOtp} disabled={loading} className="font-semibold text-yellow-300 hover:underline disabled:opacity-50">
              Resend code
            </button>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div className="relative space-y-4">
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            ✓ Email verified
          </div>

          <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 to-amber-500/10 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-yellow-200">You also get</p>
            <p className="mt-1 text-lg font-extrabold text-white">FREE Ofside PRO Membership</p>
            <p className="mt-1 text-sm text-white/60">Bundled with every paid entry — no extra checkout.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">What&apos;s included</p>
            <ul className="mt-3 space-y-2">
              {EVENT.whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                  <span className="mt-0.5 text-yellow-300">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {bothFemale ? "Total (10% women's pair off)" : "Total due"}
                </p>
                <p className="text-xs text-white/35">Incl. taxes · no breakup needed</p>
              </div>
              <p className="text-3xl font-extrabold tabular-nums text-yellow-300">₹{formatInr(amountInr)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={pay}
            disabled={loading}
            className="w-full rounded-full bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Opening payment…" : `Pay ₹${formatInr(amountInr)}`}
          </button>
          <p className="text-center text-[11px] text-white/40">Secured by Razorpay. Spot locks when payment succeeds.</p>
        </div>
      )}

      {step === "done" && (
        <div className="relative py-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl text-gray-950">✓</div>
          <h3 className="mt-4 text-2xl font-extrabold">Registration confirmed!</h3>
          <p className="mt-2 text-sm text-white/60">
            You + {partnerName || "your partner"} are in. Confirmation hits {leadEmail}.
          </p>
          <p className="mt-2 text-xs text-yellow-200/80">{EVENT.reportingNote}</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 py-3 text-sm font-bold hover:bg-white/5">
              View venue
            </a>
            <a href={buildCalendarUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 py-3 text-sm font-bold hover:bg-white/5">
              Add to calendar
            </a>
            <a href={EVENT.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] py-3 text-sm font-bold text-gray-950 hover:brightness-110">
              Join WhatsApp
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`You're my doubles partner for ${EVENT.name} — we're locked in. See you there!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-yellow-400 py-3 text-sm font-extrabold text-gray-950 hover:bg-yellow-300"
            >
              Invite your partner
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
