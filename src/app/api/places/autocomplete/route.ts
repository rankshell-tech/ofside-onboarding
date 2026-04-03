import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");

  if (!input?.trim()) {
    return NextResponse.json({ predictions: [] });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Maps API key not configured" }, { status: 500 });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(input)}` +
    `&key=${key}` +
    `&components=country:in` +
    `&location=20.5937,78.9629` +
    `&radius=2000000` +
    `&types=establishment`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({ predictions: data.predictions ?? [], status: data.status });
}
