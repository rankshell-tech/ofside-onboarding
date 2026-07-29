/**
 * Notify the Ofside app backend to create accounts (if needed) and redeem
 * BadmintonDoubleFreeMembership22Aug2026 for lead + partner after paid registration.
 * Failures are logged only — ticket issuance must not roll back.
 */
export async function grantEventProMembership(registrationId: string): Promise<void> {
  const apiBase = (
    process.env.APP_API_URL ||
    process.env.API_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const secret = String(process.env.EVENT_INTERNAL_SECRET || "").trim();

  if (!apiBase || !secret) {
    console.warn(
      "[event/grant-pro] skipped — set APP_API_URL (or API_URL) and EVENT_INTERNAL_SECRET"
    );
    return;
  }

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
    if (!res.ok) {
      console.warn("[event/grant-pro] failed", res.status, json);
      return;
    }
    console.log("[event/grant-pro] ok", json?.data?.results || json);
  } catch (err) {
    console.warn("[event/grant-pro] error", err);
  }
}
