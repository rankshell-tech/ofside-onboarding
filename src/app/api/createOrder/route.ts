import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { connectToDB } from "@/lib/mongo";
import Payment from "@/models/Payment";

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
    // Use Cashfree's placeholder for order_status: {status}
    // See: https://docs.cashfree.com/docs/pg/web-integration/checkout/return-url
    const returnUrl = `https://ofside.in/thank-you?status={status}&order_id=${orderId}`;
    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: "",
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: returnUrl,
      },
      order_note: "Venue onboarding payment",
    };

    const response = await cashfree.PGCreateOrder(request);
    const data = response.data;

    // Save payment details in Payment.ts model
    await connectToDB();
    await Payment.create({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      amount: amount,
      currency: "INR",
      status: "CREATED",
      customer: {
        id: customerId,
        name: "",
        email: email,
        phone: phone,
      },
      orderNote: "Venue onboarding payment",
      orderMeta: {
        return_url: returnUrl,
        notify_url: undefined,
        payment_methods: undefined,
      },
      raw: data,
    });

    return NextResponse.json({
      success: true,
      sessionId: data.payment_session_id,
      orderId: data.order_id,
      raw: data,
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
