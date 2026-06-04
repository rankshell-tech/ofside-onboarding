// VENUE PARTNER — disabled (Google Places for venue onboarding addresses)
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Venue partner places autocomplete is disabled." },
    { status: 503 },
  );
}

/*
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  ... see git history for full implementation ...
}
*/
