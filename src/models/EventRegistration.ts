import mongoose, { Schema, models } from "mongoose";

const GENDERS = ["Male", "Female", "Other"] as const;
const LEVELS = ["Beginner", "Intermediate", "Semi-PRO", "Advanced"] as const;

const REGISTRATION_STATUSES = ["pending", "verified", "paid"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

const PAYMENT_STATUSES = ["unpaid", "created", "paid", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const eventRegistrationSchema = new Schema(
  {
    eventSlug: { type: String, required: true, index: true },

    // Lead registrant (email OTP-verified).
    leadName: { type: String, required: true, trim: true },
    leadEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    leadPhone: { type: String, required: true, trim: true },
    leadGender: { type: String, enum: GENDERS, required: true },
    leadLevel: { type: String, enum: LEVELS, required: true },
    emergencyContact: { type: String, trim: true, default: null },

    // Doubles partner (always 2 players per checkout).
    partnerName: { type: String, required: true, trim: true },
    partnerPhone: { type: String, required: true, trim: true },
    partnerGender: { type: String, enum: GENDERS, required: true },

    totalPeople: { type: Number, required: true, min: 2, max: 2, default: 2 },
    bothFemale: { type: Boolean, default: false },
    femaleDiscountApplied: { type: Boolean, default: false },

    // Waivers
    waiverOwnRisk: { type: Boolean, default: false },
    waiverMediaConsent: { type: Boolean, default: false },
    waiverTerms: { type: Boolean, default: false },

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

eventRegistrationSchema.index({ eventSlug: 1, leadEmail: 1 }, { unique: true });

export default models.EventRegistration ||
  mongoose.model("EventRegistration", eventRegistrationSchema);
