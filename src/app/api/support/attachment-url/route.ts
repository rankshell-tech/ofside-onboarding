import { NextRequest, NextResponse } from "next/server";

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
    const response = await fetch(`${apiUrl}/api/support/attachment-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.log("Website support attachment proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to prepare attachment upload." },
      { status: 500 }
    );
  }
}
