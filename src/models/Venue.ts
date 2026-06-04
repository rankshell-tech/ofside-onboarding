// VENUE PARTNER — disabled (mongoose Venue model for partner onboarding)

/*
import mongoose, { Schema, models } from 'mongoose';

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sportType: { type: String, required: true },
    surfaceType: { type: String },
    size: { type: String },
    isIndoor: { type: Boolean, default: false },
    hasLighting: { type: Boolean, default: false },
    images: {
      cover: { type: String, default: null },
      logo: { type: String, default: null },
      others: { type: [String], default: [] },
    },
    slotDuration: { type: Number },
    maxPeople: { type: Number },
    pricePerSlot: { type: Number },
    peakEnabled: { type: Boolean, default: false },
    peakDays: { type: [String], default: [] },
    peakStart: { type: String },
    peakEnd: { type: String },
    peakPricePerSlot: { type: Number },
  },
  { _id: false },
);

const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true },
  venueType: { type: String },
  sportsOffered: { type: [String], default: [] },
  description: { type: String, required: true },
  amenities: { type: [String], default: [] },
  is24HoursOpen: { type: Boolean, default: false },
  availableDays: { type: [String], default: [] },
  revenueModel: { type: String },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    pincode: { type: String, required: true },
    fullAddress: { type: String, default: "" },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
  },
  contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  owner: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  courts: { type: [courtSchema], default: [] },
  declarationAgreed: { type: Boolean, default: false },
  declarationConsent: { type: Boolean, default: false },
  declarationAgree: { type: Boolean, default: false },
  venuePartnerAcknowledgment: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  pendingChanges: { type: mongoose.Schema.Types.Mixed, default: null },
  rawVenueData: { type: mongoose.Schema.Types.Mixed, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Venue || mongoose.model("Venue", venueSchema);
*/

export {};
