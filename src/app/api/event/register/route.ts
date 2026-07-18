import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { EVENT, priceForPeople } from "@/lib/eventConfig";
import { generateOtp, hashOtp, OTP_TTL_MS, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type IncomingParticipant = { name?: unknown; email?: unknown };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const leadName = String(body?.leadName || "").trim();
    const leadEmail = String(body?.leadEmail || "").trim().toLowerCase();
    const leadPhone = String(body?.leadPhone || "").trim();
    const rawParticipants: IncomingParticipant[] = Array.isArray(body?.participants)
      ? body.participants
      : [];

    // Validate lead.
    if (!leadName) return NextResponse.json({ success: false, message: "Your name is required." }, { status: 400 });
    if (!EMAIL_RE.test(leadEmail))
      return NextResponse.json({ success: false, message: "A valid email is required." }, { status: 400 });
    if (!/^\+?[0-9]{7,15}$/.test(leadPhone))
      return NextResponse.json({ success: false, message: "A valid phone number is required." }, { status: 400 });

    // Validate additional participants.
    const participants = rawParticipants
      .map((p) => ({
        name: String(p?.name || "").trim(),
        email: p?.email ? String(p.email).trim().toLowerCase() : null,
      }))
      .filter((p) => p.name.length > 0);

    for (const p of participants) {
      if (p.email && !EMAIL_RE.test(p.email))
        return NextResponse.json({ success: false, message: `Invalid email for ${p.name}.` }, { status: 400 });
    }

    const totalPeople = 1 + participants.length;
    if (totalPeople > EVENT.maxGroupSize)
      return NextResponse.json(
        { success: false, message: `A single entry can include up to ${EVENT.maxGroupSize} people.` },
        { status: 400 }
      );

    await connectToDB();

    const existing = await EventRegistration.findOne({ eventSlug: EVENT.slug, leadEmail });
    if (existing && existing.status === "paid")
      return NextResponse.json(
        { success: false, message: "This email is already registered and paid for this event." },
        { status: 409 }
      );

    // Cooldown so we don't spam OTP emails.
    if (existing?.lastOtpSentAt) {
      const elapsed = Date.now() - new Date(existing.lastOtpSentAt).getTime();
      if (elapsed < OTP_RESEND_COOLDOWN_MS)
        return NextResponse.json(
          {
            success: false,
            message: "Please wait a few seconds before requesting another code.",
            retryInMs: OTP_RESEND_COOLDOWN_MS - elapsed,
          },
          { status: 429 }
        );
    }

    const otp = generateOtp();
    const amountInr = priceForPeople(totalPeople);
    const doc =
      existing ||
      new EventRegistration({ eventSlug: EVENT.slug, leadEmail });

    doc.set({
      leadName,
      leadPhone,
      participants,
      totalPeople,
      amountInr,
      currency: EVENT.currency,
      otpHash: hashOtp(otp),
      otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
      emailVerified: false,
      emailVerifiedAt: null,
      status: "pending",
    });
    await doc.save();

    await sendOtpEmail(leadEmail, otp, leadName);

    return NextResponse.json({
      success: true,
      registrationId: String(doc._id),
      email: leadEmail,
      totalPeople,
      amountInr,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/register] error:", err);
    return NextResponse.json({ success: false, message: "Could not start registration. Please try again." }, { status: 500 });
  }
}
