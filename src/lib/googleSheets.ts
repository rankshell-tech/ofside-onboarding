// VENUE PARTNER — disabled

export async function appendWithRetries(): Promise<never> {
  throw new Error("Venue partner Google Sheets sync is disabled.");
}

export async function clearSheetData(): Promise<never> {
  throw new Error("Venue partner Google Sheets sync is disabled.");
}

/*
eslint-disable @typescript-eslint/no-explicit-any
// lib/googleSheets.ts
import { google } from "googleapis";
... see git history for full implementation ...
*/
