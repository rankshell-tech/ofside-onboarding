import mongoose, { Schema, models } from "mongoose";

// A participant other than the lead. Only the lead's email is verified.
const participantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: null },
  },
  { _id: false }
);

const REGISTRATION_STATUSES = ["pending", "verified", "paid"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

const PAYMENT_STATUSES = ["unpaid", "created", "paid", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const eventRegistrationSchema = new Schema(
  {
    eventSlug: { type: String, required: true, index: true },

    // Lead registrant (the person whose email is OTP-verified).
    leadName: { type: String, required: true, trim: true },
    leadEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    leadPhone: { type: String, required: true, trim: true },

    // Additional people in the same entry (lead is counted separately).
    participants: { type: [participantSchema], default: [] },
    // Total headcount = lead + participants; capped at the event max group size.
    totalPeople: { type: Number, required: true, min: 1, max: 4 },

    // Email OTP verification.
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },

    // Payment (Razorpay).
    amountInr: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "unpaid" as PaymentStatus },
    razorpayOrderId: { type: String, default: null, index: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    paidAt: { type: Date, default: null },

    status: { type: String, enum: REGISTRATION_STATUSES, default: "pending" as RegistrationStatus },
  },
  { timestamps: true }
);

// One in-progress/confirmed entry per email per event (re-registering reuses it).
eventRegistrationSchema.index({ eventSlug: 1, leadEmail: 1 }, { unique: true });

export default models.EventRegistration ||
  mongoose.model("EventRegistration", eventRegistrationSchema);
