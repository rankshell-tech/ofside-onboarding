/**
 * Zoho Books integration for event registration payments.
 * Same flow as ofside-app-backend zohoBooksService:
 * upsert contact → create tax-inclusive invoice → record customer payment.
 * Failures are logged; payment confirmation must not depend on Zoho.
 */

const ZOHO_ACCOUNTS_BASE = "https://accounts.zoho.in";
const ZOHO_BOOKS_BASE = "https://www.zohoapis.in/books/v3";

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

export interface ZohoSyncResult {
  contactId: string;
  invoiceId: string;
  paymentId: string;
  lastSyncedAt: Date;
}

export function isZohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN &&
      process.env.ZOHO_ORG_ID
  );
}

function logZoho(event: string, meta?: Record<string, unknown>): void {
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(`[zoho:${event}]${suffix}`);
}

async function getAccessToken(): Promise<string> {
  if (!isZohoConfigured()) {
    throw new Error("Zoho Books is not configured");
  }
  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt > now + 60_000) {
    return cachedAccessToken;
  }

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !data.access_token) {
    logZoho("token_refresh_failed", { status: res.status, error: data });
    throw new Error(data.error || "Zoho token refresh failed");
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

async function zohoRequest(path: string, options: RequestInit = {}): Promise<Record<string, unknown>> {
  const token = await getAccessToken();
  const orgId = process.env.ZOHO_ORG_ID;
  const url = `${ZOHO_BOOKS_BASE}${path}${path.includes("?") ? "&" : "?"}organization_id=${orgId}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown> & { message?: string };
  if (!res.ok) {
    logZoho("api_error", { path, status: res.status, body });
    throw new Error(body.message || `Zoho Books API error (${res.status})`);
  }
  return body;
}

async function upsertContact(customer: {
  name: string;
  email?: string;
  phone?: string;
  registrationId: string;
}): Promise<string> {
  const { name, email, phone, registrationId } = customer;

  if (email) {
    try {
      const search = await zohoRequest(`/contacts?email=${encodeURIComponent(email)}`);
      const contacts = search.contacts as Array<{ contact_id?: string }> | undefined;
      const existing = contacts?.[0];
      if (existing?.contact_id) {
        logZoho("contact_found", { contactId: existing.contact_id, registrationId });
        return existing.contact_id;
      }
    } catch (e) {
      logZoho("contact_search_warn", {
        registrationId,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const payload = {
    contact_name: name || `Ofside Event ${registrationId}`,
    contact_type: "customer",
    ...(email ? { email } : {}),
    ...(phone ? { contact_persons: [{ first_name: name, phone }] } : {}),
    notes: `Ofside event registrationId: ${registrationId}`,
  };

  const created = await zohoRequest("/contacts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const contact = created.contact as { contact_id?: string } | undefined;
  const contactId = contact?.contact_id;
  logZoho("contact_created", { contactId, registrationId });
  if (!contactId) {
    throw new Error("Zoho did not return contact_id");
  }
  return contactId;
}

async function createInvoice(input: {
  contactId: string;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
}): Promise<string> {
  const { contactId, amount, currency, description, reference } = input;
  // Amount charged is tax-inclusive (same as subscription sync).
  const payload = {
    customer_id: contactId,
    date: new Date().toISOString().slice(0, 10),
    is_inclusive_tax: true,
    line_items: [
      {
        name: description,
        rate: amount,
        quantity: 1,
      },
    ],
    notes: reference ? `Ref: ${reference}` : undefined,
    currency_code: currency || "INR",
  };

  const created = await zohoRequest("/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const invoice = created.invoice as { invoice_id?: string } | undefined;
  const invoiceId = invoice?.invoice_id;
  logZoho("invoice_created", { invoiceId, reference });
  if (!invoiceId) {
    throw new Error("Zoho did not return invoice_id");
  }
  return invoiceId;
}

async function recordPayment(input: {
  contactId: string;
  invoiceId: string;
  amount: number;
  reference?: string;
}): Promise<string> {
  const { contactId, invoiceId, amount, reference } = input;
  const payload = {
    customer_id: contactId,
    payment_mode: "others",
    amount,
    date: new Date().toISOString().slice(0, 10),
    invoices: [{ invoice_id: invoiceId, amount_applied: amount }],
    description: reference || "Ofside event registration",
  };

  const created = await zohoRequest("/customerpayments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const payment = created.payment as { payment_id?: string } | undefined;
  const paymentId = payment?.payment_id;
  logZoho("payment_recorded", { paymentId, invoiceId });
  if (!paymentId) {
    throw new Error("Zoho did not return payment_id");
  }
  return paymentId;
}

/** Create Zoho contact + invoice + payment for a paid event registration. */
export async function syncEventRegistrationPayment(ctx: {
  registrationId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  amountInr: number;
  currency?: string;
  eventName: string;
  razorpayPaymentId?: string;
  ticketCode?: string;
}): Promise<ZohoSyncResult | null> {
  if (!isZohoConfigured()) {
    logZoho("skip_not_configured", { registrationId: ctx.registrationId });
    return null;
  }

  const amount = Number(ctx.amountInr);
  if (!Number.isFinite(amount) || amount <= 0) {
    logZoho("skip_zero_amount", { registrationId: ctx.registrationId, amount });
    return null;
  }

  const reference = ctx.razorpayPaymentId || ctx.ticketCode || ctx.registrationId;
  const description = `Ofside Event: ${ctx.eventName}`;

  try {
    const contactId = await upsertContact({
      registrationId: ctx.registrationId,
      name: ctx.leadName || "Ofside Event Guest",
      ...(ctx.leadEmail ? { email: ctx.leadEmail } : {}),
      ...(ctx.leadPhone ? { phone: ctx.leadPhone } : {}),
    });

    const invoiceId = await createInvoice({
      contactId,
      amount,
      currency: ctx.currency || "INR",
      description,
      reference,
    });

    const paymentId = await recordPayment({
      contactId,
      invoiceId,
      amount,
      reference,
    });

    return { contactId, invoiceId, paymentId, lastSyncedAt: new Date() };
  } catch (e) {
    logZoho("sync_failed", {
      registrationId: ctx.registrationId,
      message: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }
}
