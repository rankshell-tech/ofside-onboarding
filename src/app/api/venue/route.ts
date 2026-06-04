// VENUE PARTNER — disabled
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: "Venue partner onboarding is disabled." },
    { status: 503 },
  );
}

/*
import { NextRequest } from 'next/server';
import Venue from '@/models/Venue';
import userModel from '@/models/User';
import { connectToDB } from '@/lib/mongo';
import { appendWithRetries } from "@/lib/googleSheets";

// This POST handler creates a new venue and syncs to Google Sheets (best effort)
export async function POST(req: NextRequest) {
  ... see git history for full implementation ...
}
*/
