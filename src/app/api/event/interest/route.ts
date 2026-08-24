import { after, NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import EventInterest from "@/models/EventInterest";
import { EVENT, getEventBySlug } from "@/lib/eventConfig";
import {
  sendAdminInterestNotificationEmail,
  sendInterestConfirmationEmail,
} from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (String(body?.company || "").trim()) {
      return NextResponse.json({ success: true });
    }

    const name = String(body?.name || "").trim().slice(0, 80);
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").replace(/\D/g, "").slice(-10);
    const city = String(body?.city || "").trim().slice(0, 60) || null;
    const eventSlug = String(body?.eventSlug || EVENT.slug).trim();
    const consent = Boolean(body?.consent);
    const event = getEventBySlug(eventSlug) ?? EVENT;

    if (!name) return NextResponse.json({ success: false, message: "Your name is required." }, { status: 400 });
    if (!EMAIL_RE.test(email))
      return NextResponse.json({ success: false, message: "A valid email is required." }, { status: 400 });
    if (!PHONE_RE.test(phone))
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    if (!consent)
      return NextResponse.json(
        { success: false, message: "Please agree to receive updates about upcoming SESSIONS events." },
        { status: 400 }
      );

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, message: "Could not save your details right now. Please try again." },
        { status: 503 }
      );
    }

    await connectToDB();

    let alreadySubscribed = false;
    let savedName = name;
    let savedEmail = email;
    let savedPhone = phone;

    try {
      const existing = await EventInterest.findOne({ email });
      alreadySubscribed = Boolean(existing);
      const doc = await EventInterest.findOneAndUpdate(
        { email },
        {
          $set: {
            name,
            phone,
            city,
            sourceEventSlug: event.slug,
            consent: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      savedName = String(doc?.name || name);
      savedEmail = String(doc?.email || email);
      savedPhone = String(doc?.phone || phone);
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code?: number }).code : null;
      if (code !== 11000) throw err;
      alreadySubscribed = true;
    }

    after(async () => {
      try {
        await sendInterestConfirmationEmail(savedEmail, savedName);
      } catch (err) {
        console.warn("[event/interest] confirmation email failed:", err);
      }
      if (!alreadySubscribed) {
        try {
          await sendAdminInterestNotificationEmail({
            name: savedName,
            email: savedEmail,
            phone: savedPhone,
            city,
            eventName: event.name,
          });
        } catch (err) {
          console.warn("[event/interest] admin notify email failed:", err);
        }
      }
    });

    return NextResponse.json({
      success: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "You're already on the list. We'll keep sharing the latest SESSIONS updates."
        : "You're on the list. We'll share the latest SESSIONS updates with you.",
    });
  } catch (err) {
    console.error("[event/interest]", err);
    return NextResponse.json(
      { success: false, message: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }
}
