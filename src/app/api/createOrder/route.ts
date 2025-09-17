import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const CASHFREE_ENV =
  process.env.CASHFREE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

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

const cashfree = new Cashfree(
  CASHFREE_ENV,
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
    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: "",
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        // return_url: `https://ofside.com/pgappsdemos/return.php?order_id=${orderId}`,
         return_url: `https://ofside.in/`,
      },
      order_note: "Venue onboarding payment",
    };

    const response = await cashfree.PGCreateOrder(request);
    const data = response.data;

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
