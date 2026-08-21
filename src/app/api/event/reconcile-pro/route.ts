import { NextRequest, NextResponse } from "next/server";
import { reconcileEventProBatch, reconcileEventProForRegistration } from "@/lib/reconcileEventPro";
import { resolveGrantApiBase } from "@/lib/grantEventPro";

/**
 * Repair endpoint for event PRO grants that never landed (API down, missing
 * EVENT_INTERNAL_SECRET, deploy skew, browser closed before verify-payment finished).
 *
 * Guarded by the same shared secret as the API grant route:
 *   curl -X POST https://<site>/api/event/reconcile-pro \
 *     -H 'x-event-internal-secret: <secret>' -H 'content-type: application/json' \
 *     -d '{"eventSlug":"ofside-open-2026"}'
 */
export async function POST(req: NextRequest) {
  const expected = String(process.env.EVENT_INTERNAL_SECRET || "").trim();
  if (!expected)
    return NextResponse.json(
      { success: false, message: "EVENT_INTERNAL_SECRET is not configured on the website." },
      { status: 503 }
    );

  const provided = String(req.headers.get("x-event-internal-secret") || "").trim();
  if (!provided || provided !== expected)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const registrationId = String(body?.registrationId || "").trim();
  const eventSlug = String(body?.eventSlug || "").trim();
  const force = body?.force === true || String(body?.force || "") === "true";
  const limit = Number(body?.limit) || undefined;

  const { base, note } = resolveGrantApiBase();

  try {
    if (registrationId) {
      const result = await reconcileEventProForRegistration(registrationId, { force });
      return NextResponse.json({ success: true, apiBase: base || null, apiNote: note, result });
    }

    const { scanned, results } = await reconcileEventProBatch({
      ...(eventSlug ? { eventSlug } : {}),
      ...(limit ? { limit } : {}),
      force,
    });
    return NextResponse.json({
      success: true,
      apiBase: base || null,
      apiNote: note,
      scanned,
      repaired: results.filter((r) => r.action === "granted").length,
      failed: results.filter((r) => r.action === "failed").length,
      results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reconcile failed.";
    // eslint-disable-next-line no-console
    console.error("[event/reconcile-pro] error:", err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
