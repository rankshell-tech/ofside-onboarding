import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";

const GRANT_PATH = "/api/subscriptions/grant-event-pro";
/** One immediate try plus two backed-off retries — enough to ride out an API restart. */
const RETRY_DELAYS_MS = [700, 2500];
const REQUEST_TIMEOUT_MS = 20_000;

export type GrantPlayerResult = {
  role?: string;
  status?: string;
  userId?: string;
  userCreated?: boolean;
  message?: string;
};

export type GrantOutcome = {
  ok: boolean;
  status?: number;
  error?: string;
  results?: GrantPlayerResult[];
};

type AttemptOutcome = GrantOutcome & { retryable?: boolean };

function isLoopbackUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(?:\/|$)/i.test(url);
}

/**
 * APP_API_URL wins, API_URL is the fallback.
 *
 * In production a loopback base is dropped: a deployed site cannot reach a dev API on
 * localhost, and a stale `APP_API_URL=http://localhost:5001` copied into the hosting env
 * silently swallows every grant.
 */
export function resolveGrantApiBase(): { base: string; note: string | null } {
  const raw = [process.env.APP_API_URL, process.env.API_URL]
    .map((v) => String(v || "").trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (!raw.length) return { base: "", note: "APP_API_URL / API_URL are not set" };

  const isProd = process.env.NODE_ENV === "production";
  const usable = isProd ? raw.filter((u) => !isLoopbackUrl(u)) : raw;

  if (!usable.length)
    return {
      base: "",
      note: `only loopback API URLs configured (${raw.join(", ")}) — set APP_API_URL to the public API origin`,
    };

  const note =
    isProd && usable[0] !== raw[0] ? `ignored loopback APP_API_URL (${raw[0]})` : null;
  return { base: usable[0], note };
}

export function isGrantFullySuccessful(results: unknown): boolean {
  if (!Array.isArray(results) || results.length === 0) return false;
  return (results as GrantPlayerResult[]).every(
    (r) => r?.status === "granted" || r?.status === "already_redeemed"
  );
}

/** Leave a trail on the registration so a failed grant is visible instead of log-only. */
async function recordAttempt(registrationId: string, error: string | null): Promise<void> {
  try {
    await connectToDB();
    await EventRegistration.updateOne(
      { _id: registrationId },
      {
        $set: {
          proGrantAttemptedAt: new Date(),
          proGrantLastError: error ? error.slice(0, 500) : null,
        },
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[event/grant-pro] could not record attempt:", err);
  }
}

async function callGrant(
  base: string,
  secret: string,
  registrationId: string,
  force: boolean
): Promise<AttemptOutcome> {
  try {
    const res = await fetch(`${base}${GRANT_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-event-internal-secret": secret,
      },
      body: JSON.stringify(force ? { registrationId, force: true } : { registrationId }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const json = (await res.json().catch(() => ({}))) as {
      message?: string;
      data?: { results?: GrantPlayerResult[] };
    };

    if (!res.ok) {
      const error = `API ${res.status} ${json?.message || res.statusText || "grant failed"}`;
      // eslint-disable-next-line no-console
      console.warn(`[event/grant-pro] ${registrationId} failed — ${error}`);
      // 5xx/429 are transient (API restarting, rate limited); 4xx will not fix itself on retry.
      return { ok: false, status: res.status, error, retryable: res.status >= 500 || res.status === 429 };
    }

    const results = Array.isArray(json?.data?.results) ? json.data.results : [];

    if (!isGrantFullySuccessful(results)) {
      const detail =
        results
          .filter((r) => r?.status !== "granted" && r?.status !== "already_redeemed")
          .map((r) => `${r?.role || "player"}: ${r?.message || r?.status || "unknown"}`)
          .join("; ") || "API returned no player results";
      const error = `Partial grant — ${detail}`;
      // eslint-disable-next-line no-console
      console.warn(`[event/grant-pro] ${registrationId} partial — ${error}`);
      // A bad phone number or duplicate key will not clear on an immediate retry; the
      // reconcile pass picks it up later.
      return { ok: false, status: res.status, error, results, retryable: false };
    }

    // eslint-disable-next-line no-console
    console.log(
      `[event/grant-pro] ${registrationId} ok — ${results
        .map((r) => `${r.role}:${r.status}${r.userCreated ? "(new)" : ""}`)
        .join(", ")}`
    );
    return { ok: true, status: res.status, results };
  } catch (err) {
    const error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    // eslint-disable-next-line no-console
    console.warn(`[event/grant-pro] ${registrationId} error — ${error}`);
    return { ok: false, error, retryable: true };
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ask the Ofside app backend to create accounts (if needed) and redeem the free-PRO
 * event coupon for lead + partner after a paid registration.
 *
 * Never throws and never rolls anything back — ticket issuance must not depend on it.
 * The outcome is written to proGrantAttemptedAt / proGrantLastError so a failure can be
 * found and retried instead of only living in a log line.
 */
export async function grantEventProMembership(
  registrationId: string,
  options: { force?: boolean } = {}
): Promise<GrantOutcome> {
  const { base, note } = resolveGrantApiBase();
  const secret = String(process.env.EVENT_INTERNAL_SECRET || "").trim();

  if (!base || !secret) {
    const reasons = [
      base ? null : `API base unusable — ${note || "APP_API_URL / API_URL not set"}`,
      secret ? null : "EVENT_INTERNAL_SECRET is not set on the website",
    ].filter(Boolean);
    const error = `Grant not attempted: ${reasons.join("; ")}`;
    // eslint-disable-next-line no-console
    console.warn(`[event/grant-pro] ${registrationId} skipped — ${error}`);
    await recordAttempt(registrationId, error);
    return { ok: false, error };
  }

  if (note) {
    // eslint-disable-next-line no-console
    console.warn(`[event/grant-pro] ${note}; using ${base}`);
  }

  let outcome: AttemptOutcome = { ok: false, error: "Grant never ran." };

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    outcome = await callGrant(base, secret, registrationId, options.force === true);
    if (outcome.ok || !outcome.retryable) break;
    const delay = RETRY_DELAYS_MS[attempt];
    if (delay === undefined) break;
    await sleep(delay);
  }

  await recordAttempt(registrationId, outcome.ok ? null : outcome.error || "Grant failed.");
  return { ok: outcome.ok, status: outcome.status, error: outcome.error, results: outcome.results };
}
