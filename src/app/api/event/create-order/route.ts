import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { EVENT, isEventHidden, resolveEvent, priceForCheckout } from "@/lib/eventConfig";
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

    const doc = await EventRegistration.findById(registrationId);
    if (!doc) return NextResponse.json({ success: false, message: "Registration not found." }, { status: 404 });

    const event = resolveEvent(String(doc.eventSlug || EVENT.slug));
    if (isEventHidden(event))
      return NextResponse.json(
        { success: false, message: "This event has ended. Registrations are closed." },
        { status: 410 }
      );

    const paidCount = await EventRegistration.countDocuments({
      eventSlug: event.slug,
      paymentStatus: "paid",
    });

    if (!doc.emailVerified)
      return NextResponse.json({ success: false, message: "Please verify your email first." }, { status: 403 });
    if (doc.paymentStatus === "paid")
      return NextResponse.json({ success: false, message: "This entry is already paid." }, { status: 409 });

    if (paidCount >= event.maxRegistrations)
      return NextResponse.json(
        {
          success: false,
          message: `All slots booked — ${event.maxRegistrations} doubles (${event.maxPlayers} players) are full.`,
          soldOut: true,
        },
        { status: 410 }
      );

    const bothFemale = Boolean(doc.bothFemale) || (doc.leadGender === "Female" && doc.partnerGender === "Female");
    const amountInr = priceForCheckout(bothFemale, event);
    const amountPaise = Math.round(amountInr * 100);

    const order = await getRazorpay().orders.create({
      amount: amountPaise,
      currency: event.currency,
      receipt: `evt_${String(doc._id).slice(-10)}`,
      notes: {
        eventSlug: event.slug,
        registrationId: String(doc._id),
        people: String(event.playersPerCheckout),
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
      currency: event.currency,
      keyId: publicRazorpayKeyId,
      prefill: { name: doc.leadName, email: doc.leadEmail, contact: doc.leadPhone },
      eventName: event.name,
      bothFemale,
      includesPro: true,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/create-order] error:", err);
    return NextResponse.json({ success: false, message: "Could not start payment. Please try again." }, { status: 500 });
  }
}
