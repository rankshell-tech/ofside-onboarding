import crypto from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30s between sends

// Salt the hash so stored OTPs aren't trivially brute-forceable. Falls back to a
// build-local constant if OTP_SECRET isn't set (dev only).
const SECRET = process.env.OTP_SECRET || "ofside-event-otp-dev-secret";

export function generateOtp(): string {
  // 6-digit, zero-padded, cryptographically random.
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", SECRET).update(otp).digest("hex");
}

export function verifyOtp(otp: string, hash: string | null | undefined): boolean {
  if (!hash) return false;
  const candidate = hashOtp(otp);
  const a = Buffer.from(candidate);
  const b = Buffer.from(hash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
