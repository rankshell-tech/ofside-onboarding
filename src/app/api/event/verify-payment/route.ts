import { after, NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { generateTicketCode, ticketAbsoluteUrl } from "@/lib/ticket";
import { grantEventProMembership } from "@/lib/grantEventPro";
import {
  sendAdminRegistrationNotificationEmail,
  sendRegistrationConfirmationEmail,
} from "@/lib/email";

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

    const registrationIdStr = String(doc._id);
    const shouldSendConfirmation = !doc.confirmationEmailSentAt;
    const shouldNotifyAdmin = !doc.adminNotifyEmailSentAt;
    const confirmationPayload = shouldSendConfirmation
      ? {
          leadName: String(doc.leadName || ""),
          partnerName: String(doc.partnerName || ""),
          leadEmail: String(doc.leadEmail || ""),
          partnerEmail: doc.partnerEmail ? String(doc.partnerEmail) : null,
          amountInr: Number(doc.amountInr) || 0,
          ticketCode,
          ticketUrl,
        }
      : null;
    const adminPayload = shouldNotifyAdmin
      ? {
          leadName: String(doc.leadName || ""),
          leadEmail: String(doc.leadEmail || ""),
          leadPhone: String(doc.leadPhone || ""),
          leadGender: String(doc.leadGender || ""),
          leadLevel: String(doc.leadLevel || ""),
          partnerName: String(doc.partnerName || ""),
          partnerEmail: doc.partnerEmail ? String(doc.partnerEmail) : null,
          partnerPhone: String(doc.partnerPhone || ""),
          partnerGender: String(doc.partnerGender || ""),
          bothFemale: Boolean(doc.bothFemale),
          femaleDiscountApplied: Boolean(doc.femaleDiscountApplied),
          amountInr: Number(doc.amountInr) || 0,
          ticketCode,
          ticketUrl,
          razorpayPaymentId: paymentId,
          registrationId: registrationIdStr,
        }
      : null;

    // PRO grant + emails after response so the thank-you screen isn't waiting on Resend.
    after(async () => {
      await Promise.all([
        grantEventProMembership(registrationIdStr).catch((proErr) => {
          // eslint-disable-next-line no-console
          console.warn("[event/verify-payment] PRO grant failed:", proErr);
        }),
        (async () => {
          if (!confirmationPayload) return;
          try {
            await sendRegistrationConfirmationEmail(confirmationPayload);
            await EventRegistration.updateOne(
              { _id: registrationIdStr, confirmationEmailSentAt: null },
              { $set: { confirmationEmailSentAt: new Date() } }
            );
          } catch (emailErr) {
            // eslint-disable-next-line no-console
            console.warn("[event/verify-payment] confirmation email failed:", emailErr);
          }
        })(),
        (async () => {
          if (!adminPayload) return;
          try {
            await sendAdminRegistrationNotificationEmail(adminPayload);
            await EventRegistration.updateOne(
              { _id: registrationIdStr, adminNotifyEmailSentAt: null },
              { $set: { adminNotifyEmailSentAt: new Date() } }
            );
          } catch (emailErr) {
            // eslint-disable-next-line no-console
            console.warn("[event/verify-payment] admin notify email failed:", emailErr);
          }
        })(),
      ]);
    });

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
