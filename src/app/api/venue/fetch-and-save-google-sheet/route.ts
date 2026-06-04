// VENUE PARTNER — disabled
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Venue partner Google Sheets sync is disabled." },
    { status: 503 },
  );
}

/*
import { NextRequest } from 'next/server';
import Venue from '@/models/Venue';
import { appendWithRetries,clearSheetData } from "@/lib/googleSheets";
import { connectToDB } from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
  ... see git history for full implementation ...
}
*/
