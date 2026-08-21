import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import {
  grantEventProMembership,
  isGrantFullySuccessful,
  type GrantOutcome,
} from "@/lib/grantEventPro";

/** Don't re-hit the API on every ticket refresh. */
const RETRY_COOLDOWN_MS = 5 * 60 * 1000;
const DEFAULT_BATCH_LIMIT = 25;
const MAX_BATCH_LIMIT = 200;

type RegistrationGrantState = {
  _id?: unknown;
  paymentStatus?: string | null;
  proGrantedAt?: Date | null;
  proGrantResults?: unknown;
  proGrantAttemptedAt?: Date | null;
};

export type ReconcileResult = {
  registrationId: string;
  action: "granted" | "failed" | "skipped";
  reason?: string;
  error?: string;
  outcome?: GrantOutcome;
};

/** Paid, but lead + partner are not both on PRO yet. */
export function needsProGrant(doc: RegistrationGrantState): boolean {
  if (doc.paymentStatus !== "paid") return false;
  return !(doc.proGrantedAt && isGrantFullySuccessful(doc.proGrantResults));
}

function cooledDown(doc: RegistrationGrantState): boolean {
  if (!doc.proGrantAttemptedAt) return true;
  return Date.now() - new Date(doc.proGrantAttemptedAt).getTime() >= RETRY_COOLDOWN_MS;
}

/**
 * Re-run the PRO grant for one paid registration if it never fully landed.
 *
 * Cheap and safe to call on any page that already knows a registration id — the backend
 * grant is idempotent per user, and a cooldown keeps refreshes from hammering the API.
 */
export async function reconcileEventProForRegistration(
  registrationId: string,
  options: { force?: boolean } = {}
): Promise<ReconcileResult> {
  await connectToDB();
  const doc = (await EventRegistration.findById(registrationId)
    .select("paymentStatus proGrantedAt proGrantResults proGrantAttemptedAt")
    .lean()) as RegistrationGrantState | null;

  if (!doc) return { registrationId, action: "skipped", reason: "registration not found" };
  if (doc.paymentStatus !== "paid")
    return { registrationId, action: "skipped", reason: `payment is ${doc.paymentStatus || "unset"}` };
  if (!options.force && !needsProGrant(doc))
    return { registrationId, action: "skipped", reason: "already granted" };
  if (!options.force && !cooledDown(doc))
    return { registrationId, action: "skipped", reason: "retried too recently" };

  const outcome = await grantEventProMembership(registrationId, { force: options.force });
  return {
    registrationId,
    action: outcome.ok ? "granted" : "failed",
    ...(outcome.ok ? {} : { error: outcome.error }),
    outcome,
  };
}

/** Sweep paid registrations whose PRO grant never landed. Used by the reconcile endpoint. */
export async function reconcileEventProBatch(
  options: { eventSlug?: string; limit?: number; force?: boolean } = {}
): Promise<{ scanned: number; results: ReconcileResult[] }> {
  await connectToDB();
  const limit = Math.min(Math.max(Number(options.limit) || DEFAULT_BATCH_LIMIT, 1), MAX_BATCH_LIMIT);

  const query: Record<string, unknown> = { paymentStatus: "paid" };
  if (options.eventSlug) query.eventSlug = options.eventSlug;

  const docs = (await EventRegistration.find(query)
    .select("paymentStatus proGrantedAt proGrantResults proGrantAttemptedAt")
    .sort({ paidAt: 1 })
    .limit(limit)
    .lean()) as RegistrationGrantState[];

  const results: ReconcileResult[] = [];
  for (const doc of docs) {
    if (!options.force && !needsProGrant(doc)) continue;
    // Sequential on purpose: the grant creates users and redeems a shared coupon.
    results.push(await reconcileEventProForRegistration(String(doc._id), { force: options.force }));
  }

  return { scanned: docs.length, results };
}
