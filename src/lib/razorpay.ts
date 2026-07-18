import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpayConfigured = Boolean(keyId && keySecret);

// Public key id for the client checkout. NEXT_PUBLIC_ is exposed to the browser;
// falls back to the server key id at build if only that is set.
export const publicRazorpayKeyId =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";

let client: Razorpay | null = null;
export function getRazorpay(): Razorpay {
  if (!razorpayConfigured) {
    throw new Error("Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).");
  }
  if (!client) {
    client = new Razorpay({ key_id: keyId as string, key_secret: keySecret as string });
  }
  return client;
}

/** Verifies the Razorpay checkout signature: HMAC_SHA256(order_id|payment_id, secret). */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!keySecret) return false;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature || "");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
