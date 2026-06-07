"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

const CONTACT_TOPICS = [
  "General enquiry",
  "Player support",
  "Business partnership",
  "Media or collaboration",
  "Product feedback",
] as const;

const SUPPORT_API_PATH = "/api/support";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

function TurnstileWidget({
  resetKey,
  onToken,
  onExpire,
}: {
  resetKey: number;
  onToken: (token: string) => void;
  onExpire: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onExpire(),
        "error-callback": () => onExpire(),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }

    window.onTurnstileLoad = renderWidget;
    if (!document.querySelector("script[data-ofside-turnstile]")) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      script.setAttribute("data-ofside-turnstile", "1");
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [resetKey, onToken, onExpire]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className="min-h-[70px]" />;
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const turnstileEnabled = TURNSTILE_SITE_KEY.length > 0;

  const isValid = useMemo(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const captchaOk = !turnstileEnabled || Boolean(captchaToken);
    return (
      name.trim() &&
      emailRegex.test(email) &&
      topic.trim() &&
      message.trim() &&
      captchaOk
    );
  }, [email, message, name, topic, captchaToken, turnstileEnabled]);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaResetKey((k) => k + 1);
  }, []);

  const handleSubmit = async () => {
    if (!isValid) {
      if (turnstileEnabled && !captchaToken) {
        setErrorMessage("Please complete the security check before submitting.");
      }
      return;
    }
    setSending(true);
    setErrorMessage("");
    try {
      const response = await fetch(SUPPORT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
          summary: `${topic}: ${message.trim()}`.slice(0, 140),
          priority: topic === "Business partnership" ? "high" : "medium",
          source: "website",
          ...(captchaToken ? { captchaToken } : {}),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to submit request right now.");
      }
      setTicketId(data?.ticket?.ticketId || "");
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setCaptchaToken(null);
      setCaptchaResetKey((k) => k + 1);
    } catch (error: any) {
      setErrorMessage(error?.message || "Unable to submit request right now.");
      setCaptchaToken(null);
      setCaptchaResetKey((k) => k + 1);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      id="contact-form"
      data-reveal="feature-card"
      className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-yellow-100 p-3 text-gray-950">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">Send us a message</h2>
          <p className="text-sm text-gray-600">
            Submit your issue and get an instant ticket confirmation by email.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-gray-800">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:bg-white"
            placeholder="Your full name"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-gray-800">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:bg-white"
            placeholder="Your email address"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-gray-800 sm:col-span-2">
          Topic
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:bg-white"
          >
            {CONTACT_TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-gray-800 sm:col-span-2">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:bg-white"
            placeholder="Tell us what you need and we'll point you in the right direction."
          />
        </label>
      </div>

      <div className="mt-4">
        <TurnstileWidget
          resetKey={captchaResetKey}
          onToken={setCaptchaToken}
          onExpire={handleCaptchaExpire}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || sending}
          className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Send className="mr-2 h-4 w-4" />
          {sending ? "Submitting..." : "Submit support request"}
        </button>
        {sent ? (
          <p className="inline-flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Request submitted{ticketId ? ` · Ticket ID: ${ticketId}` : ""}.
          </p>
        ) : (
          <p className="text-sm text-gray-500">Need urgent help? Email us at play@ofside.in.</p>
        )}
      </div>
      {errorMessage ? (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
