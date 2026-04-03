import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id");

  if (!placeId?.trim()) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Maps API key not configured" }, { status: 500 });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&key=${key}` +
    `&fields=name,formatted_address,geometry,address_components`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({ result: data.result ?? null, status: data.status });
}
