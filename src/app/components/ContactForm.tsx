"use client";

import { useMemo, useRef, useState } from "react";
import { Mail, Send, CheckCircle2, Paperclip, X } from "lucide-react";
import {
  MAX_SUPPORT_ATTACHMENT_COUNT,
  SupportAttachment,
  uploadSupportAttachment,
} from "@/lib/supportAttachmentUpload";

const CONTACT_TOPICS = [
  "General enquiry",
  "Player support",
  "Business partnership",
  "Media or collaboration",
  "Product feedback",
] as const;

const SUPPORT_API_PATH = "/api/support";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = useMemo(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return (
      name.trim() &&
      emailRegex.test(email) &&
      topic.trim() &&
      message.trim()
    );
  }, [email, message, name, topic]);

  const handleAttachmentSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (attachments.length >= MAX_SUPPORT_ATTACHMENT_COUNT) {
      setErrorMessage(
        `You can attach up to ${MAX_SUPPORT_ATTACHMENT_COUNT} files.`
      );
      return;
    }

    setUploadingAttachment(true);
    setErrorMessage("");
    try {
      const uploaded = await uploadSupportAttachment(file);
      setAttachments((prev) => [...prev, uploaded]);
    } catch (error: any) {
      setErrorMessage(error?.message || "Unable to upload attachment.");
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async () => {
    if (!isValid || uploadingAttachment) return;
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
          attachments,
          summary: `${topic}: ${message.trim()}`.slice(0, 140),
          priority: topic === "Business partnership" ? "high" : "medium",
          source: "website",
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
      setAttachments([]);
    } catch (error: any) {
      setErrorMessage(error?.message || "Unable to submit request right now.");
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
        <div className="grid gap-2 text-sm font-medium text-gray-800 sm:col-span-2">
          <span>Attachments (optional)</span>
          <p className="text-xs font-normal text-gray-500">
            Add screenshots, images, or PDFs to help us understand your issue (max{" "}
            {MAX_SUPPORT_ATTACHMENT_COUNT}, 5 MB each).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleAttachmentSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={
              uploadingAttachment ||
              attachments.length >= MAX_SUPPORT_ATTACHMENT_COUNT
            }
            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Paperclip className="mr-2 h-4 w-4" />
            {uploadingAttachment ? "Uploading..." : "Add attachment"}
          </button>
          {attachments.length > 0 ? (
            <ul className="grid gap-2">
              {attachments.map((attachment, index) => (
                <li
                  key={`${attachment.url}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700"
                >
                  <span className="truncate pr-3">{attachment.fileName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="rounded-full p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                    aria-label={`Remove ${attachment.fileName}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || sending || uploadingAttachment}
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
