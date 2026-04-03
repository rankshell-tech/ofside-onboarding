"use client";

import { useMemo, useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

const CONTACT_TOPICS = [
  "General enquiry",
  "Venue onboarding",
  "Player support",
  "Business partnership",
  "Media or collaboration",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const isValid = useMemo(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return name.trim() && emailRegex.test(email) && topic.trim() && message.trim();
  }, [email, message, name, topic]);

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    const subject = `Ofside website enquiry: ${topic}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:play@ofside.in,Partnercare@ofside.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
            This opens your mail app with the form details filled in.
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
            placeholder="you@example.com"
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
            placeholder="Tell us what you need and we’ll point you in the right direction."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Send className="mr-2 h-4 w-4" />
          Send via email
        </button>
        {sent ? (
          <p className="inline-flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Your message draft has been prepared.
          </p>
        ) : (
          <p className="text-sm text-gray-500">Need urgent help? WhatsApp or call us directly below.</p>
        )}
      </div>
    </div>
  );
}
