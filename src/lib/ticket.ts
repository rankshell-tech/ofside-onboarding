import crypto from "crypto";
import { APP_LINK_ORIGIN } from "./mobileAppLinks";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

/** Short check-in code shown on the ticket (and encoded in the QR). */
export function generateTicketCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i]! % ALPHABET.length];
  return out;
}

export function ticketPath(code: string): string {
  return `/events/sessions/ticket/${encodeURIComponent(code.trim().toUpperCase())}`;
}

export function ticketAbsoluteUrl(code: string, origin?: string): string {
  const base = (origin || APP_LINK_ORIGIN || "https://ofside.in").replace(/\/$/, "");
  return `${base}${ticketPath(code)}`;
}

export function ticketQrImageUrl(ticketUrl: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(ticketUrl)}`;
}
