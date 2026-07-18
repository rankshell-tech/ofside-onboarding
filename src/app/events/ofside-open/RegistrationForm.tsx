"use client";

import { useCallback, useMemo, useState } from "react";
import { EVENT, priceForPeople } from "@/lib/eventConfig";

type Step = "details" | "otp" | "pay" | "done";
type Participant = { name: string; email: string };

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

const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-yellow-300 placeholder:text-gray-400";

export default function RegistrationForm() {
  const [step, setStep] = useState<Step>("details");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [otp, setOtp] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPeople = 1 + participants.length;
  const amountInr = useMemo(() => priceForPeople(totalPeople), [totalPeople]);
  const canAddMore = totalPeople < EVENT.maxGroupSize;

  const addParticipant = () => {
    if (canAddMore) setParticipants((p) => [...p, { name: "", email: "" }]);
  };
  const removeParticipant = (i: number) =>
    setParticipants((p) => p.filter((_, idx) => idx !== i));
  const updateParticipant = (i: number, key: keyof Participant, val: string) =>
    setParticipants((p) => p.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)));

  const submitDetails = useCallback(async () => {
    setError("");
    if (!leadName.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) return setError("Please enter a valid email.");
    if (!/^\+?[0-9]{7,15}$/.test(leadPhone.trim())) return setError("Please enter a valid phone number.");
    for (const p of participants) if (!p.name.trim()) return setError("Please fill in every participant's name.");

    setLoading(true);
    try {
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadName,
          leadEmail,
          leadPhone,
          participants: participants.map((p) => ({ name: p.name, email: p.email || undefined })),
        }),
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
  }, [leadName, leadEmail, leadPhone, participants]);

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
        body: JSON.stringify({
          leadName,
          leadEmail,
          leadPhone,
          participants: participants.map((p) => ({ name: p.name, email: p.email || undefined })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not resend code.");
      setRegistrationId(data.registrationId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }, [leadName, leadEmail, leadPhone, participants]);

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
        description: `Entry for ${totalPeople} ${totalPeople > 1 ? "people" : "person"}`,
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
  }, [registrationId, totalPeople]);

  return (
    <div className="w-full rounded-3xl bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-7">
      {/* Header + price */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Register now</p>
          <h3 className="mt-1 text-xl font-bold text-gray-950">Reserve your spot</h3>
        </div>
        <div className="rounded-2xl bg-gray-950 px-4 py-2 text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-yellow-300">Total</p>
          <p className="text-lg font-extrabold text-white">
            ₹{amountInr.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-5 flex items-center gap-1.5">
        {(["details", "otp", "pay"] as Step[]).map((s, i) => {
          const order: Step[] = ["details", "otp", "pay", "done"];
          const active = order.indexOf(step) >= i;
          return (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition ${active ? "bg-yellow-400" : "bg-gray-200"}`}
            />
          );
        })}
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {step === "details" && (
        <div className="space-y-3">
          <input className={inputCls} placeholder="Your full name" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
          <input className={inputCls} type="email" inputMode="email" placeholder="Email address" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
          <input className={inputCls} type="tel" inputMode="tel" placeholder="Phone number" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} />

          {participants.length > 0 && (
            <div className="space-y-3 rounded-2xl bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Additional people</p>
              {participants.map((p, i) => (
                <div key={i} className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">Person {i + 2}</span>
                    <button type="button" onClick={() => removeParticipant(i)} className="text-xs font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                  <input className={inputCls} placeholder="Full name" value={p.name} onChange={(e) => updateParticipant(i, "name", e.target.value)} />
                  <input className={inputCls} type="email" placeholder="Email (optional)" value={p.email} onChange={(e) => updateParticipant(i, "email", e.target.value)} />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addParticipant}
            disabled={!canAddMore}
            className="w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {canAddMore ? `+ Add another person (up to ${EVENT.maxGroupSize})` : `Maximum ${EVENT.maxGroupSize} people per entry`}
          </button>

          <button
            type="button"
            onClick={submitDetails}
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-gray-950 py-3.5 text-[15px] font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Sending code…" : `Continue · ₹${amountInr.toLocaleString("en-IN")}`}
          </button>
          <p className="text-center text-[11px] text-gray-500">
            We&apos;ll email a 6-digit code to verify {leadEmail || "your email"}.
          </p>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code we sent to <span className="font-semibold text-gray-900">{leadEmail}</span>.
          </p>
          <input
            className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`}
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
            className="w-full rounded-xl bg-gray-950 py-3.5 text-[15px] font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>
          <div className="flex items-center justify-between text-[12px]">
            <button type="button" onClick={() => setStep("details")} className="font-semibold text-gray-600 hover:underline">
              ← Edit details
            </button>
            <button type="button" onClick={resendOtp} disabled={loading} className="font-semibold text-gray-900 hover:underline disabled:opacity-50">
              Resend code
            </button>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <span>✓</span> Email verified
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <div className="flex justify-between"><span>Entry</span><span>{totalPeople} × ₹{EVENT.pricePerPersonInr}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-1 font-bold text-gray-950"><span>Total</span><span>₹{amountInr.toLocaleString("en-IN")}</span></div>
            </div>
          </div>
          <button
            type="button"
            onClick={pay}
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 py-3.5 text-[15px] font-extrabold text-gray-950 transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Opening payment…" : `Pay ₹${amountInr.toLocaleString("en-IN")} with Razorpay`}
          </button>
          <p className="text-center text-[11px] text-gray-500">Secured by Razorpay. Your entry is confirmed once payment succeeds.</p>
        </div>
      )}

      {step === "done" && (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-3xl">🎉</div>
          <h3 className="mt-4 text-xl font-bold text-gray-950">You&apos;re in!</h3>
          <p className="mt-2 text-sm text-gray-600">
            Your entry for <span className="font-semibold">{EVENT.name}</span> is confirmed for {totalPeople}{" "}
            {totalPeople > 1 ? "people" : "person"}. A confirmation is on its way to {leadEmail}.
          </p>
          <div className="mt-4 rounded-2xl bg-gray-950 px-4 py-3 text-left">
            <p className="text-[11px] uppercase tracking-[0.14em] text-yellow-300">See you at</p>
            <p className="text-sm font-semibold text-white">{EVENT.venueName} · {EVENT.dateShort}</p>
          </div>
        </div>
      )}
    </div>
  );
}
