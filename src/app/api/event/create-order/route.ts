import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { EVENT, priceForCheckout } from "@/lib/eventConfig";
import { getRazorpay, razorpayConfigured, publicRazorpayKeyId } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const registrationId = String(body?.registrationId || "").trim();
    if (!registrationId)
      return NextResponse.json({ success: false, message: "Missing registration." }, { status: 400 });

    if (!razorpayConfigured)
      return NextResponse.json(
        { success: false, message: "Payments are not configured yet. Please try again later." },
        { status: 503 }
      );

    await connectToDB();

    const paidCount = await EventRegistration.countDocuments({
      eventSlug: EVENT.slug,
      paymentStatus: "paid",
    });

    const doc = await EventRegistration.findById(registrationId);
    if (!doc) return NextResponse.json({ success: false, message: "Registration not found." }, { status: 404 });
    if (!doc.emailVerified)
      return NextResponse.json({ success: false, message: "Please verify your email first." }, { status: 403 });
    if (doc.paymentStatus === "paid")
      return NextResponse.json({ success: false, message: "This entry is already paid." }, { status: 409 });

    if (paidCount >= EVENT.maxRegistrations)
      return NextResponse.json(
        { success: false, message: "We're sold out — all spots for this session are taken.", soldOut: true },
        { status: 410 }
      );

    const bothFemale = Boolean(doc.bothFemale) || (doc.leadGender === "Female" && doc.partnerGender === "Female");
    const amountInr = priceForCheckout(bothFemale);
    const amountPaise = Math.round(amountInr * 100);

    const order = await getRazorpay().orders.create({
      amount: amountPaise,
      currency: EVENT.currency,
      receipt: `evt_${String(doc._id).slice(-10)}`,
      notes: {
        eventSlug: EVENT.slug,
        registrationId: String(doc._id),
        people: String(EVENT.playersPerCheckout),
        bothFemale: String(bothFemale),
      },
    });

    doc.set({
      amountInr,
      bothFemale,
      femaleDiscountApplied: bothFemale,
      razorpayOrderId: order.id,
      paymentStatus: "created",
    });
    await doc.save();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountPaise,
      amountInr,
      currency: EVENT.currency,
      keyId: publicRazorpayKeyId,
      prefill: { name: doc.leadName, email: doc.leadEmail, contact: doc.leadPhone },
      eventName: EVENT.name,
      bothFemale,
      includesPro: true,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/create-order] error:", err);
    return NextResponse.json({ success: false, message: "Could not start payment. Please try again." }, { status: 500 });
  }
}
