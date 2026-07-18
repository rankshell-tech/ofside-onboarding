import { Resend } from "resend";
import { EVENT } from "./eventConfig";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Ofside <noreply@ofside.in>";

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends the verification OTP to the lead registrant's email.
 * If RESEND_API_KEY isn't configured (local dev), it logs the OTP to the server
 * console instead of throwing, so the flow stays testable without credentials.
 */
export async function sendOtpEmail(to: string, otp: string, leadName: string): Promise<void> {
  if (!resend) {
    // eslint-disable-next-line no-console
    console.log(`[event-otp] (dev, no RESEND_API_KEY) OTP for ${to}: ${otp}`);
    return;
  }

  const subject = `${otp} is your ${EVENT.name} verification code`;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:16px">
    <p style="text-transform:uppercase;letter-spacing:.2em;font-size:11px;color:#FFF201;margin:0 0 8px">${EVENT.partnerRole}</p>
    <h1 style="font-size:22px;margin:0 0 4px">Verify your email</h1>
    <p style="color:#cfcfcf;font-size:14px;margin:0 0 20px">Hi ${leadName || "there"}, use the code below to confirm your entry for <strong>${EVENT.name}</strong>.</p>
    <div style="font-size:34px;font-weight:800;letter-spacing:10px;background:#FFF201;color:#0a0a0a;text-align:center;padding:16px;border-radius:12px">${otp}</div>
    <p style="color:#9a9a9a;font-size:12px;margin:20px 0 0">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
  </div>`;

  await resend.emails.send({ from, to, subject, html });
}
