import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { generateTicketCode, ticketAbsoluteUrl } from "@/lib/ticket";
import { grantEventProMembership } from "@/lib/grantEventPro";
import { sendRegistrationConfirmationEmail } from "@/lib/email";

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

    if (doc.razorpayOrderId !== orderId)
      return NextResponse.json({ success: false, message: "Order mismatch." }, { status: 400 });

    if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
      doc.set({ paymentStatus: "failed" });
      await doc.save();
      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
    }

    let ticketCode = doc.ticketCode ? String(doc.ticketCode) : "";
    if (!ticketCode) {
      for (let attempt = 0; attempt < 6; attempt++) {
        const candidate = generateTicketCode();
        const clash = await EventRegistration.exists({ ticketCode: candidate });
        if (clash) continue;
        ticketCode = candidate;
        break;
      }
      if (!ticketCode)
        return NextResponse.json(
          { success: false, message: "Could not issue ticket. Contact support." },
          { status: 500 }
        );
    }

    const ticketUrl = ticketAbsoluteUrl(ticketCode, req.nextUrl?.origin);

    doc.set({
      paymentStatus: "paid",
      status: "paid",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      paidAt: doc.paidAt || new Date(),
      ticketCode,
    });
    await doc.save();

    // Free Ofside PRO for lead + partner (create accounts if missing). Non-blocking for ticket UX.
    void grantEventProMembership(String(doc._id));

    // Confirmation email with ticket — once per registration (lead + partner).
    if (!doc.confirmationEmailSentAt) {
      try {
        await sendRegistrationConfirmationEmail({
          leadName: String(doc.leadName || ""),
          partnerName: String(doc.partnerName || ""),
          leadEmail: String(doc.leadEmail || ""),
          partnerEmail: doc.partnerEmail ? String(doc.partnerEmail) : null,
          amountInr: Number(doc.amountInr) || 0,
          ticketCode,
          ticketUrl,
        });
        doc.confirmationEmailSentAt = new Date();
        await doc.save();
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn("[event/verify-payment] confirmation email failed:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed. You're in!",
      ticketCode,
      ticketUrl,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/verify-payment] error:", err);
    return NextResponse.json(
      { success: false, message: "Could not confirm payment. Please contact support." },
      { status: 500 }
    );
  }
}
