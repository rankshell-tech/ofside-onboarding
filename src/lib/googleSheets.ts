/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/googleSheets.ts
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/** Parse credentials from env (expects JSON object or stringified JSON) */
function getServiceAccountCredentials(): any {
   const rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!rawBase64) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 in .env"
    );
  }
   const jsonString = Buffer.from(rawBase64, "base64").toString("utf8");
    return JSON.parse(jsonString);
}

/** Create authorized sheets client */
async function getSheetsClient() {
  const credsObj = getServiceAccountCredentials();

  const jwt = new google.auth.JWT({
    email: credsObj.client_email,
    key: credsObj.private_key,
    scopes: SCOPES,
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


export async function clearSheetData(spreadsheetId: string, range: string) {
  try {
      const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    console.log(`✅ Cleared data from range: ${range}`);
  } catch (error) {
    console.error('❌ Error clearing sheet data:', error);
    throw error;
  }
}

