import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { connectToDB } from "@/lib/mongo";
import Order from "@/models/Order";

const NEXT_PUBLIC_CASHFREE_ENV =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const CASHFREE_APP_ID =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? process.env.CASHFREE_APP_ID!
    : process.env.CASHFREE_APP_ID_TEST!;

const CASHFREE_SECRET_KEY =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? process.env.CASHFREE_SECRET_KEY!
    : process.env.CASHFREE_SECRET_KEY_TEST!;

const CASHFREE_BASE =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const cashfree = new Cashfree(
  NEXT_PUBLIC_CASHFREE_ENV,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);

// 🔹 Helper to fetch full order details
async function fetchOrderDetails(orderId: string) {
  const res = await fetch(`${CASHFREE_BASE}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "x-api-version": "2022-09-01",
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch order details: ${text}`);
  }
  return res.json();
}

export async function POST(req: Request) {
  try {
    const { amount, email, phone } = await req.json();

    if (!amount || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderId = `order_${Date.now()}`;
    const customerId = `cust_${Date.now()}`;

    const baseReturnUrl =
      process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
        ? "https://ofside.in/thank-you"
        : "http://localhost:3000/thank-you";

    const returnUrl = `${baseReturnUrl}?order_id=${orderId}`;

    // Step 1: Create order on Cashfree
    const createRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: "",
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: { return_url: returnUrl },
      order_note: "Venue onboarding payment",
    };

    const createResponse = await cashfree.PGCreateOrder(createRequest);
    const createData = createResponse.data;

    // Step 2: Fetch full order details directly from Cashfree API
    const fullOrder = await fetchOrderDetails(orderId);

    // Step 3: Save verified order info to Mongo
    await connectToDB();

    // Convert created_at and order_expiry_time to local time before saving
    const createdAtUTC = fullOrder.created_at ? new Date(fullOrder.created_at) : new Date();
    const createdAtLocal = new Date(createdAtUTC.getTime() - createdAtUTC.getTimezoneOffset() * 60000);

    const orderExpiryUTC = fullOrder.order_expiry_time ? new Date(fullOrder.order_expiry_time) : undefined;
    const orderExpiryLocal = orderExpiryUTC
      ? new Date(orderExpiryUTC.getTime() - orderExpiryUTC.getTimezoneOffset() * 60000)
      : undefined;

    await Order.create({
      cf_order_id: fullOrder.cf_order_id,
      created_at: createdAtLocal,
      customer_details: {
      customer_id: fullOrder.customer_details?.customer_id,
      customer_name: fullOrder.customer_details?.customer_name ?? null,
      customer_email: fullOrder.customer_details?.customer_email,
      customer_phone: fullOrder.customer_details?.customer_phone,
      customer_uid: fullOrder.customer_details?.customer_uid ?? null,
      },
      entity: fullOrder.entity ?? "order",
      order_amount: fullOrder.order_amount,
      order_currency: fullOrder.order_currency ?? "INR",
      order_expiry_time: orderExpiryLocal,
      order_id: fullOrder.order_id,
      order_meta: {
      return_url: fullOrder.order_meta?.return_url,
      notify_url: fullOrder.order_meta?.notify_url ?? null,
      payment_methods: fullOrder.order_meta?.payment_methods ?? null,
      },
      order_note: fullOrder.order_note,
      order_splits: fullOrder.order_splits ?? [],
      order_status: fullOrder.order_status,
      order_tags: fullOrder.order_tags ?? null,
      payment_session_id: createData.payment_session_id,
      payments: fullOrder.payments ? { url: fullOrder.payments.url } : undefined,
      refunds: fullOrder.refunds ? { url: fullOrder.refunds.url } : undefined,
      settlements: fullOrder.settlements ? { url: fullOrder.settlements.url } : undefined,
      terminal_data: fullOrder.terminal_data ?? null,
      raw: fullOrder,
      isArchived: false,
    });

    // Step 4: Return order session info to frontend
    return NextResponse.json({
      success: true,
      sessionId: createData.payment_session_id,
      orderId: fullOrder.order_id,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error occurred";
    console.error("Cashfree createOrder error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
