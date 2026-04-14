import { NextRequest, NextResponse } from "next/server";

const WEBSITE_SUPPORT_SOURCE = "website";

function resolveAdminEmail(topic: string): string {
  const usersEmail = process.env.ADMIN_EMAIL_FOR_USERS || process.env.ADMIN_EMAIL || "";
  const partnershipsEmail = process.env.ADMIN_EMAIL_FOR_PARTNERSHIPS || usersEmail;
  const t = (topic || "").toLowerCase();
  const isPartnership =
    t.includes("partnership") || t.includes("business") || t.includes("onboarding");
  return (isPartnership ? partnershipsEmail : usersEmail).trim();
}

export async function POST(req: NextRequest) {
  try {
    const apiUrl = (process.env.API_URL || "").trim();
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: "API_URL is not configured" },
        { status: 500 }
      );
    }

    const payload = await req.json();
    const adminEmailOverride = resolveAdminEmail(String(payload?.topic || ""));

    const response = await fetch(`${apiUrl}/api/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        source: WEBSITE_SUPPORT_SOURCE,
        ...(adminEmailOverride ? { adminEmailOverride } : {}),
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.log("Website support proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit support request." },
      { status: 500 }
    );
  }
}
