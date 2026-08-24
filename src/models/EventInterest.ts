import mongoose, { Schema, models } from "mongoose";

const eventInterestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: null },
    sourceEventSlug: { type: String, required: true, index: true },
    consent: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

eventInterestSchema.index({ email: 1 }, { unique: true });

export default models.EventInterest || mongoose.model("EventInterest", eventInterestSchema);
