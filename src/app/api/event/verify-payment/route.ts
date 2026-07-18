import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const registrationId = String(body?.registrationId || "").trim();
    const orderId = String(body?.razorpay_order_id || "").trim();
    const paymentId = String(body?.razorpay_payment_id || "").trim();
    const signature = String(body?.razorpay_signature || "").trim();

    if (!registrationId || !orderId || !paymentId || !signature)
      return NextResponse.json({ success: false, message: "Missing payment details." }, { status: 400 });

    await connectToDB();
    const doc = await EventRegistration.findById(registrationId);
    if (!doc) return NextResponse.json({ success: false, message: "Registration not found." }, { status: 404 });

    // Order must match the one we created for this registration.
    if (doc.razorpayOrderId !== orderId)
      return NextResponse.json({ success: false, message: "Order mismatch." }, { status: 400 });

    if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
      doc.set({ paymentStatus: "failed" });
      await doc.save();
      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
    }

    doc.set({
      paymentStatus: "paid",
      status: "paid",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      paidAt: new Date(),
    });
    await doc.save();

    return NextResponse.json({ success: true, message: "Payment confirmed. You're in!" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/verify-payment] error:", err);
    return NextResponse.json({ success: false, message: "Could not confirm payment. Please contact support." }, { status: 500 });
  }
}
