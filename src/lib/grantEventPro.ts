import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

function isLocalUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(url);
}

const isDeployed =
  process.env.NODE_ENV === "production" || !!process.env.VERCEL;

/**
 * Where the Ofside app API lives. `APP_API_URL` wins locally, but a localhost value on a
 * deployed environment is a copied-from-.env.local mistake — it would make every grant call
 * fail from the serverless function, so fall back to API_URL instead of quietly dead-ending.
 */
function resolveApiBase(): { base: string; note?: string } {
  const candidates = [
    ["APP_API_URL", process.env.APP_API_URL],
    ["API_URL", process.env.API_URL],
  ] as const;

  let skippedLocal: string | undefined;
  for (const [name, raw] of candidates) {
    const value = String(raw || "").trim().replace(/\/$/, "");
    if (!value) continue;
    if (isDeployed && isLocalUrl(value)) {
      skippedLocal = `${name}=${value}`;
      continue;
    }
    return {
      base: value,
      ...(skippedLocal
        ? { note: `ignored localhost ${skippedLocal} on a deployed environment` }
        : {}),
    };
  }
  return { base: "", ...(skippedLocal ? { note: `only localhost configured (${skippedLocal})` } : {}) };
}

/** Record the outcome on the registration so a failed grant is visible in the DB, not just logs. */
async function recordGrantAttempt(registrationId: string, error: string | null): Promise<void> {
  try {
    await connectToDB();
    await EventRegistration.updateOne(
      { _id: registrationId },
      { $set: { proGrantAttemptedAt: new Date(), proGrantLastError: error } }
    );
  } catch (err) {
    console.warn("[event/grant-pro] could not record attempt", err);
  }
}

/**
 * Notify the Ofside app backend to create accounts (if needed) and redeem
 * BadmintonDoubleFreeMembership22Aug2026 for lead + partner after paid registration.
 *
 * Never throws — ticket issuance must not roll back. Failures are logged AND written to the
 * registration (`proGrantLastError`), so `npm run backfill:event-pro` in ofside-app-backend
 * can find and repair them.
 */
export async function grantEventProMembership(registrationId: string): Promise<void> {
  const { base: apiBase, note } = resolveApiBase();
  const secret = String(process.env.EVENT_INTERNAL_SECRET || "").trim();

  if (!apiBase || !secret) {
    const reason = [
      !apiBase ? "APP_API_URL/API_URL not usable" : "",
      !secret ? "EVENT_INTERNAL_SECRET missing" : "",
      note || "",
    ]
      .filter(Boolean)
      .join("; ");
    console.error(`[event/grant-pro] skipped — ${reason}`);
    await recordGrantAttempt(registrationId, `skipped: ${reason}`);
    return;
  }
  if (note) console.warn(`[event/grant-pro] ${note}`);

  let lastError = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${apiBase}/api/subscriptions/grant-event-pro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-event-internal-secret": secret,
        },
        body: JSON.stringify({ registrationId }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        console.log("[event/grant-pro] ok", json?.data?.results || json);
        await recordGrantAttempt(registrationId, null);
        return;
      }

      lastError = `HTTP ${res.status} ${String(json?.message || "").slice(0, 200)}`.trim();
      console.warn(`[event/grant-pro] attempt ${attempt}/${MAX_ATTEMPTS} failed`, lastError);
      // 4xx other than 404 (registration not visible yet) will not fix themselves.
      if (res.status >= 400 && res.status < 500 && res.status !== 404) break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[event/grant-pro] attempt ${attempt}/${MAX_ATTEMPTS} error`, lastError);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }

  console.error(`[event/grant-pro] gave up for ${registrationId}: ${lastError}`);
  await recordGrantAttempt(registrationId, lastError || "unknown failure");
}
