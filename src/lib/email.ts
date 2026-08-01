import { Resend } from "resend";
import { EVENT, formatInr } from "./eventConfig";
import { ticketQrImageUrl } from "./ticket";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Ofside <noreply@ofside.in>";
const ADMIN_NOTIFY_EMAIL =
  process.env.EVENT_ADMIN_EMAIL?.trim() || "tech.rankshell@gmail.com";

const resend = apiKey ? new Resend(apiKey) : null;

function requireResendInProduction(context: string): void {
  if (resend) return;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`[email] RESEND_API_KEY is required in production (${context}).`);
  }
}

async function sendHtmlEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  context: string;
}): Promise<void> {
  const recipients = (Array.isArray(opts.to) ? opts.to : [opts.to])
    .map((e) => String(e || "").trim().toLowerCase())
    .filter((e) => e.includes("@"));

  if (!recipients.length) return;

  if (!resend) {
    requireResendInProduction(opts.context);
    // eslint-disable-next-line no-console
    console.log(`[${opts.context}] (dev, no RESEND_API_KEY) would email ${recipients.join(", ")}: ${opts.subject}`);
    return;
  }

  const { data, error } = await resend.emails.send({
    from,
    to: recipients,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error(`[${opts.context}] Resend error:`, error);
    throw new Error(error.message || `Failed to send ${opts.context} email.`);
  }

  // eslint-disable-next-line no-console
  console.log(`[${opts.context}] sent`, { to: recipients, id: data?.id });
}

/**
 * Sends the verification OTP to the lead registrant's email.
 * If RESEND_API_KEY isn't configured (local dev), it logs the OTP to the server
 * console instead of throwing, so the flow stays testable without credentials.
 */
export async function sendOtpEmail(to: string, otp: string, leadName: string): Promise<void> {
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[event-otp] RESEND_API_KEY is required in production.");
    }
    // eslint-disable-next-line no-console
    console.log(`[event-otp] (dev, no RESEND_API_KEY) OTP for ${to}: ${otp}`);
    return;
  }

  const subject = `${otp} is your ${EVENT.seriesName} verification code`;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:16px">
    <p style="text-transform:uppercase;letter-spacing:.2em;font-size:11px;color:#FFF201;margin:0 0 8px">${EVENT.edition}</p>
    <h1 style="font-size:22px;margin:0 0 4px">Verify your email</h1>
    <p style="color:#cfcfcf;font-size:14px;margin:0 0 20px">Hi ${escapeHtml(leadName || "there")}, use the code below to confirm your entry for <strong>${escapeHtml(EVENT.name)}</strong>.</p>
    <div style="font-size:34px;font-weight:800;letter-spacing:10px;background:#FFF201;color:#0a0a0a;text-align:center;padding:16px;border-radius:12px">${otp}</div>
    <p style="color:#9a9a9a;font-size:12px;margin:20px 0 0">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
  </div>`;

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[event-otp] Resend error:", error);
    throw new Error(error.message || "Failed to send verification email.");
  }
}

export type RegistrationConfirmationInput = {
  leadName: string;
  partnerName: string;
  leadEmail: string;
  partnerEmail?: string | null;
  amountInr: number;
  ticketCode: string;
  ticketUrl: string;
};

/** Confirmation + ticket email after successful payment (lead + partner). */
export async function sendRegistrationConfirmationEmail(
  input: RegistrationConfirmationInput
): Promise<void> {
  const recipients = [input.leadEmail, input.partnerEmail]
    .map((e) => String(e || "").trim().toLowerCase())
    .filter((e, i, arr) => e.includes("@") && arr.indexOf(e) === i);

  if (!recipients.length) return;

  const qrSrc = ticketQrImageUrl(input.ticketUrl, 200);
  const subject = `You're in · ${EVENT.seriesName} ticket ${input.ticketCode}`;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#f3f3f3;color:#1c1c1c">
    <div style="background:#0f766e;color:#fff;border-radius:16px 16px 0 0;padding:20px 22px">
      <p style="text-transform:uppercase;letter-spacing:.14em;font-size:11px;opacity:.75;margin:0">${escapeHtml(EVENT.edition)}</p>
      <h1 style="font-size:22px;margin:8px 0 0;line-height:1.25">Registration confirmed</h1>
      <p style="margin:10px 0 0;opacity:.9;font-size:14px">${escapeHtml(EVENT.date)} · ${escapeHtml(EVENT.timeWindow)}</p>
    </div>
    <div style="background:#fff;border:1px solid #d7ebe7;border-top:0;border-radius:0 0 16px 16px;padding:22px">
      <p style="margin:0 0 14px;font-size:15px;line-height:1.5">
        Hi ${escapeHtml(input.leadName)}, your doubles entry for
        <strong>${escapeHtml(EVENT.seriesName)}</strong> is confirmed with
        <strong>${escapeHtml(input.partnerName)}</strong>.
      </p>
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888">Venue</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.45">${escapeHtml(EVENT.venueName)}<br/><span style="color:#666">${escapeHtml(EVENT.venueAddress)}</span></p>
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888">Paid</p>
      <p style="margin:0 0 18px;font-size:16px;font-weight:700">₹${formatInr(Number(input.amountInr) || 0)}</p>

      <div style="text-align:center;background:#f3fbf9;border:1px dashed #b6ddd7;border-radius:14px;padding:18px">
        <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#5f8f88">Verification code</p>
        <p style="margin:10px 0 0;font-family:ui-monospace,Menlo,monospace;font-size:28px;font-weight:800;letter-spacing:.18em;color:#0f766e">${escapeHtml(input.ticketCode)}</p>
        <img src="${qrSrc}" alt="Ticket QR" width="160" height="160" style="display:block;margin:14px auto 0;border-radius:12px;background:#fff" />
        <p style="margin:12px 0 0;font-size:12px;color:#666">${escapeHtml(EVENT.reportingNote)}</p>
      </div>

      <p style="margin:18px 0 0;text-align:center">
        <a href="${escapeAttr(input.ticketUrl)}" style="display:inline-block;background:#FFF201;color:#1c1c1c;text-decoration:none;font-weight:800;font-size:14px;padding:12px 18px;border-radius:10px">
          Open your ticket
        </a>
      </p>
      <div style="margin:18px 0 0;padding:14px 16px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px">
        <p style="margin:0 0 8px;font-size:13px;line-height:1.45;color:#065f46">
          Join the <strong>SESSIONS by Ofside</strong> WhatsApp group for important announcements about the event.
        </p>
        <p style="margin:0;text-align:center">
          <a href="${escapeAttr(EVENT.whatsappCommunityUrl)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:800;font-size:13px;padding:10px 16px;border-radius:10px">
            Join WhatsApp group
          </a>
        </p>
      </div>
      <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#888">
        Free Ofside PRO is unlocked for both players when they sign in to the Ofside app with the same phone/email used here.
      </p>
    </div>
  </div>`;

  await sendHtmlEmail({
    to: recipients,
    subject,
    html,
    context: "event-confirmation",
  });
}

export type AdminRegistrationNotifyInput = {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadGender: string;
  leadLevel: string;
  partnerName: string;
  partnerEmail?: string | null;
  partnerPhone: string;
  partnerGender: string;
  bothFemale: boolean;
  femaleDiscountApplied: boolean;
  amountInr: number;
  ticketCode: string;
  ticketUrl: string;
  razorpayPaymentId?: string | null;
  registrationId: string;
};

/** Internal alert to admin whenever a paid event entry is confirmed. */
export async function sendAdminRegistrationNotificationEmail(
  input: AdminRegistrationNotifyInput
): Promise<void> {
  const subject = `New ${EVENT.seriesName} entry · ${input.ticketCode} · ${input.leadName}`;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f5f5f5;color:#1c1c1c">
    <div style="background:#111;color:#fff;border-radius:14px 14px 0 0;padding:18px 20px">
      <p style="margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#FFF201">Admin alert</p>
      <h1 style="margin:8px 0 0;font-size:20px">New paid registration</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:.85">${escapeHtml(EVENT.name)}</p>
    </div>
    <div style="background:#fff;border:1px solid #e5e5e5;border-top:0;border-radius:0 0 14px 14px;padding:20px">
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.45">
        <tr><td style="padding:6px 0;color:#888;width:140px">Ticket</td><td style="padding:6px 0;font-weight:700;font-family:ui-monospace,Menlo,monospace">${escapeHtml(input.ticketCode)}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Amount</td><td style="padding:6px 0;font-weight:700">₹${formatInr(Number(input.amountInr) || 0)}${input.femaleDiscountApplied ? " (female doubles −10%)" : ""}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Lead</td><td style="padding:6px 0">${escapeHtml(input.leadName)} · ${escapeHtml(input.leadEmail)} · ${escapeHtml(input.leadPhone)} · ${escapeHtml(input.leadGender)} · ${escapeHtml(input.leadLevel)}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Partner</td><td style="padding:6px 0">${escapeHtml(input.partnerName)} · ${escapeHtml(input.partnerEmail || "—")} · ${escapeHtml(input.partnerPhone)} · ${escapeHtml(input.partnerGender)}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Both female</td><td style="padding:6px 0">${input.bothFemale ? "Yes" : "No"}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Payment ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:12px">${escapeHtml(input.razorpayPaymentId || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Registration ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:12px">${escapeHtml(input.registrationId)}</td></tr>
      </table>
      <p style="margin:18px 0 0;text-align:center">
        <a href="${escapeAttr(input.ticketUrl)}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 16px;border-radius:10px">
          Open ticket
        </a>
      </p>
    </div>
  </div>`;

  await sendHtmlEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject,
    html,
    context: "event-admin-notify",
  });
}

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
