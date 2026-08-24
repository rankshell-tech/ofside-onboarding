"use client";

import { useState } from "react";
import { EVENT, type EventConfig } from "@/lib/eventConfig";

const fieldCls =
  "w-full rounded-xl border-2 border-[#7ec4bc] bg-white px-3.5 py-3 text-[15px] font-medium text-[#1c1c1c] shadow-[0_2px_0_rgba(15,118,110,0.12)] outline-none transition placeholder:font-normal placeholder:text-[#6b7f7c] focus:border-[#0f766e] focus:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]";

export default function FutureEventInterestForm({ event = EVENT }: { event?: EventConfig }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneMessage, setDoneMessage] = useState("");

  async function submit() {
    setError("");
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email.");
    if (!/^[0-9]{10}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (!consent) return setError("Please agree to receive updates about upcoming SESSIONS events.");

    setLoading(true);
    try {
      const res = await fetch("/api/event/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone,
          city: city.trim(),
          eventSlug: event.slug,
          consent,
          company: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Could not save your details. Please try again.");
      }
      setDoneMessage(
        data.message || "You're on the list. We'll share the latest SESSIONS updates with you."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (doneMessage) {
    return (
      <div className="rounded-2xl border border-[#8fcfc6] bg-[#c5ebe6] p-6 text-center shadow-[0_12px_40px_-16px_rgba(15,118,110,0.18)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] text-lg text-white">
          ✓
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#1c1c1c]">You&apos;re on the list</h3>
        <p className="mx-auto mt-2 text-sm leading-relaxed text-[#666]">{doneMessage}</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-[#8fcfc6] bg-[#c5ebe6] p-4 text-[#1c1c1c] shadow-[0_12px_40px_-16px_rgba(15,118,110,0.18)] sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <h3 className="text-base font-bold tracking-tight text-[#1c1c1c]">Get updates for the next session</h3>
      <p className="mt-1 text-xs leading-relaxed text-[#5f8f88]">
        Interested in a future SESSIONS night? Share your details and we&apos;ll send dates, venues, and
        when registration opens.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <input
          className={fieldCls}
          placeholder="Full name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <div className="flex w-full items-stretch overflow-hidden rounded-xl border-2 border-[#7ec4bc] bg-white shadow-[0_2px_0_rgba(15,118,110,0.12)] transition focus-within:border-[#0f766e] focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.18)]">
          <span className="flex shrink-0 items-center border-r border-[#7ec4bc]/70 bg-[#e8f7f4] px-3 text-[15px] font-bold text-[#0f766e]">
            +91
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[15px] font-medium text-[#1c1c1c] outline-none placeholder:font-normal placeholder:text-[#6b7f7c]"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile *"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            autoComplete="tel"
            aria-label="10-digit mobile"
          />
        </div>
        <input
          className={fieldCls}
          type="email"
          inputMode="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className={fieldCls}
          placeholder="City (optional)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="address-level2"
        />
        <label className="sr-only">
          Company
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
        <label className="flex items-start gap-2.5 text-[12px] leading-snug text-[#4d4d4d]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0f766e]"
          />
          <span>I agree to receive updates about upcoming SESSIONS events from Ofside.</span>
        </label>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#0f766e] py-3 text-[14px] font-bold text-white shadow-[0_3px_0_#0a5c56] transition hover:bg-[#0d9488] active:translate-y-px active:shadow-none disabled:opacity-60"
        >
          {loading ? "Saving..." : "Notify me"}
        </button>
      </div>
    </form>
  );
}
