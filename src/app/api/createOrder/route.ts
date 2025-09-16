// src/app/api/createOrder/route.ts

import { NextResponse } from "next/server";

const CASHFREE_APP_ID =
  process.env.CASHFREE_ENV === "production"
    ? process.env.CASHFREE_APP_ID!
    : process.env.CASHFREE_APP_ID_TEST!;

const CASHFREE_SECRET_KEY =
  process.env.CASHFREE_ENV === "production"
    ? process.env.CASHFREE_SECRET_KEY!
    : process.env.CASHFREE_SECRET_KEY_TEST!;

const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export async function POST(req: Request) {
  try {
    const { amount, email, phone } = await req.json();

    if (!amount || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderPayload = {
      order_id: `order_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_email: email,
        customer_phone: phone,
      },
      order_note: "Venue onboarding payment",
    };

    const res = await fetch(`${CASHFREE_BASE}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      return NextResponse.json(
        { error: `Cashfree API error: ${res.status} - ${errTxt}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      sessionId: data.payment_session_id,
      orderId: data.order_id,
      raw: data,
    });
  } catch (err: unknown) {
    console.error("Cashfree createOrder error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
