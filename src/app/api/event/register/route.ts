import { after, NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import {
  EVENT,
  getEventBySlug,
  priceForCheckout,
  type EventGender,
  type EventPlayerLevel,
} from "@/lib/eventConfig";
import { generateOtp, hashOtp, OTP_TTL_MS, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;
const GENDERS = new Set<string>(EVENT.genders);
const LEVELS = new Set<string>(EVENT.playerLevels);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventSlug = String(body?.eventSlug || EVENT.slug).trim();
    const event = getEventBySlug(eventSlug);
    if (!event)
      return NextResponse.json({ success: false, message: "Unknown event." }, { status: 400 });

    const leadName = String(body?.leadName || "").trim();
    const leadEmail = String(body?.leadEmail || "").trim().toLowerCase();
    const leadPhone = String(body?.leadPhone || "").replace(/\D/g, "").slice(-10);
    const leadGender = String(body?.leadGender || "").trim() as EventGender;
    const leadLevel = String(body?.leadLevel || "").trim() as EventPlayerLevel;
    const emergencyContact = body?.emergencyContact ? String(body.emergencyContact).trim() : null;
    const partnerName = String(body?.partnerName || "").trim();
    const partnerEmail = String(body?.partnerEmail || "").trim().toLowerCase();
    const partnerPhone = String(body?.partnerPhone || "").replace(/\D/g, "").slice(-10);
    const partnerGender = String(body?.partnerGender || "").trim() as EventGender;
    const bringingOwnEquipmentRaw = body?.bringingOwnEquipment;
    const bringingOwnEquipment =
      typeof bringingOwnEquipmentRaw === "boolean"
        ? bringingOwnEquipmentRaw
        : bringingOwnEquipmentRaw === "Yes"
          ? true
          : bringingOwnEquipmentRaw === "No"
            ? false
            : null;
    const waiverOwnRisk = Boolean(body?.waiverOwnRisk);
    const waiverMediaConsent = Boolean(body?.waiverMediaConsent);
    const waiverTerms = Boolean(body?.waiverTerms);

    if (!leadName) return NextResponse.json({ success: false, message: "Your name is required." }, { status: 400 });
    if (!EMAIL_RE.test(leadEmail))
      return NextResponse.json({ success: false, message: "A valid email is required." }, { status: 400 });
    if (!PHONE_RE.test(leadPhone))
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    if (!GENDERS.has(leadGender))
      return NextResponse.json({ success: false, message: "Please select your gender." }, { status: 400 });
    if (!LEVELS.has(leadLevel))
      return NextResponse.json({ success: false, message: "Please select your player level." }, { status: 400 });
    if (!partnerName)
      return NextResponse.json({ success: false, message: "Partner name is required." }, { status: 400 });
    if (!EMAIL_RE.test(partnerEmail))
      return NextResponse.json({ success: false, message: "A valid partner email is required." }, { status: 400 });
    if (partnerEmail === leadEmail)
      return NextResponse.json({ success: false, message: "Partner email must be different from yours." }, { status: 400 });
    if (!PHONE_RE.test(partnerPhone))
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit partner mobile number." },
        { status: 400 }
      );
    if (!GENDERS.has(partnerGender))
      return NextResponse.json({ success: false, message: "Please select your partner's gender." }, { status: 400 });
    if (bringingOwnEquipment === null)
      return NextResponse.json(
        { success: false, message: "Please tell us if your doubles group will bring equipment." },
        { status: 400 }
      );
    if (!waiverTerms)
      return NextResponse.json(
        { success: false, message: "Please accept the Terms & Conditions to continue." },
        { status: 400 }
      );

    await connectToDB();

    const paidCount = await EventRegistration.countDocuments({
      eventSlug: event.slug,
      paymentStatus: "paid",
    });
    const existing = await EventRegistration.findOne({ eventSlug: event.slug, leadEmail });
    const isExistingPaid = existing?.status === "paid" || existing?.paymentStatus === "paid";

    if (isExistingPaid)
      return NextResponse.json(
        { success: false, message: "This email is already registered and paid for this event." },
        { status: 409 }
      );

    // Capacity: only block new emails once sold out (allow OTP resend for in-progress).
    if (!existing && paidCount >= event.maxRegistrations)
      return NextResponse.json(
        {
          success: false,
          message: `All slots booked — ${event.maxRegistrations} doubles (${event.maxPlayers} players) are full.`,
          soldOut: true,
        },
        { status: 410 }
      );

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

    const bothFemale = leadGender === "Female" && partnerGender === "Female";
    const amountInr = priceForCheckout(bothFemale, event);
    const otp = generateOtp();
    const doc = existing || new EventRegistration({ eventSlug: event.slug, leadEmail });

    doc.set({
      leadName,
      leadPhone,
      leadGender,
      leadLevel,
      emergencyContact,
      partnerName,
      partnerEmail,
      partnerPhone,
      partnerGender,
      totalPeople: event.playersPerCheckout,
      bothFemale,
      femaleDiscountApplied: bothFemale,
      bringingOwnEquipment,
      waiverOwnRisk,
      waiverMediaConsent,
      waiverTerms,
      amountInr,
      currency: event.currency,
      otpHash: hashOtp(otp),
      otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
      emailVerified: false,
      emailVerifiedAt: null,
      status: "pending",
    });
    await doc.save();

    // Don't block the response on Resend — UI moves to OTP while the email sends.
    after(async () => {
      try {
        await sendOtpEmail(leadEmail, otp, leadName);
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn("[event/register] OTP email failed:", emailErr);
      }
    });

    return NextResponse.json({
      success: true,
      registrationId: String(doc._id),
      email: leadEmail,
      totalPeople: event.playersPerCheckout,
      amountInr,
      bothFemale,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/register] error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("MONGODB_URI")) {
      return NextResponse.json(
        { success: false, message: "Registration is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: false, message: "Could not start registration. Please try again." }, { status: 500 });
  }
}
