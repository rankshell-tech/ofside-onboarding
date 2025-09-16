/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/googleSheets.ts
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/** Parse credentials from env (expects JSON object or stringified JSON) */
function getServiceAccountCredentials(): any {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!raw) {
        throw new Error("Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_KEY in .env.local");
    }
    console.log(raw)
    return JSON.parse(raw); // now valid
}

/** Create authorized sheets client */
async function getSheetsClient() {
    const credentials = getServiceAccountCredentials();

    // If credentials is a string, parse it as JSON
    let credsObj: any;
    if (typeof credentials === "string") {
        try {
            credsObj = JSON.parse(credentials);
        } catch (e) {
            throw new Error("Failed to parse service account credentials string as JSON.");
        }
    } else {
        credsObj = credentials;
    }

    const jwt = new google.auth.JWT({
        email: credsObj.client_email,
        key: credsObj.private_key,
        scopes: SCOPES
    });

    await jwt.authorize();
    return google.sheets({ version: "v4", auth: jwt });
}

export async function appendRow(spreadsheetId: string, range: string, values: any[]) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
  return res.data;
}

/** Simple retry wrapper */
export async function appendWithRetries(spreadsheetId: string, range: string, values: any[], maxAttempts = 3) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      return await appendRow(spreadsheetId, range, values);
    } catch (err) {
      attempt++;
      // small exponential backoff
      const wait = Math.min(2000, 200 * 2 ** attempt) + Math.random() * 200;
      console.warn(`Google Sheets append attempt ${attempt} failed, retrying in ${Math.round(wait)}ms`, err);
      await new Promise((r) => setTimeout(r, wait));
      if (attempt >= maxAttempts) throw err;
    }
  }
}
