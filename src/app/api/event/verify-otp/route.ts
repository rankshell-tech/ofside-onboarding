import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { verifyOtp, OTP_MAX_ATTEMPTS } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const registrationId = String(body?.registrationId || "").trim();
    const otp = String(body?.otp || "").trim();

    if (!registrationId || !/^\d{6}$/.test(otp))
      return NextResponse.json({ success: false, message: "Enter the 6-digit code." }, { status: 400 });

    await connectToDB();
    const doc = await EventRegistration.findById(registrationId);
    if (!doc) return NextResponse.json({ success: false, message: "Registration not found." }, { status: 404 });

    if (doc.emailVerified)
      return NextResponse.json({ success: true, message: "Email already verified." });

    if (!doc.otpExpiresAt || new Date(doc.otpExpiresAt).getTime() < Date.now())
      return NextResponse.json({ success: false, message: "Code expired. Please request a new one." }, { status: 400 });

    if ((doc.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS)
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please request a new code." },
        { status: 429 }
      );

    if (!verifyOtp(otp, doc.otpHash)) {
      doc.otpAttempts = (doc.otpAttempts ?? 0) + 1;
      await doc.save();
      return NextResponse.json({ success: false, message: "Incorrect code. Please try again." }, { status: 400 });
    }

    doc.set({
      emailVerified: true,
      emailVerifiedAt: new Date(),
      status: "verified",
      otpHash: null,
      otpExpiresAt: null,
      otpAttempts: 0,
    });
    await doc.save();

    return NextResponse.json({
      success: true,
      message: "Email verified.",
      totalPeople: doc.totalPeople,
      amountInr: doc.amountInr,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("[event/verify-otp] error:", err);
    return NextResponse.json({ success: false, message: "Could not verify code. Please try again." }, { status: 500 });
  }
}
