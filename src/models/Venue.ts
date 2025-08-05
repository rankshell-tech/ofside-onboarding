import mongoose, { Schema, models } from 'mongoose';

// Court Schema (Nested inside Sports Facility)
const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                  // courtName
    sportType: { type: String },                             // courtSportType
    surfaceType: { type: String },                           // surfaceType
    size: { type: String },                                  // courtSize (e.g., 5-a-side, Standard)
    isIndoor: { type: Boolean, default: false },             // isIndoor
    hasLighting: { type: Boolean, default: false },          // hasLighting
    images: { type: [String], default: [] },                 // courtImages
    slotDuration: { type: Number },                          // courtSlotDuration (in minutes)
    maxPeople: { type: Number },                             // courtMaxPeople
    pricePerSlot: { type: Number },                          // courtPricePerSlot
    peakEnabled: { type: Boolean, default: false },          // courtPeakEnabled
    peakDays: { type: [String], default: [] },               // courtPeakDays
    peakStart: { type: String },                             // courtPeakStart
    peakEnd: { type: String },                               // courtPeakEnd
    peakPricePerSlot: { type: Number },                      // courtPeakPricePerSlot
  },
  { _id: false }
);

// Sports Facility Schema (One sport can have multiple courts)
const sportsFacilitySchema = new mongoose.Schema(
  {
    name: { type: String },                                  // courtName
    sportType: { type: String, required: true },             // e.g., "Football", "Tennis"
    courts: { type: [courtSchema], default: [] },
  },
  { _id: false }
);

// Main Venue Schema
const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true },               // venueName
  venueType: { type: String },                               // venueType (Turf, Stadium, etc.)
  sportsOffered: { type: [String], default: [] },            // sportsOffered
  description: { type: String, required: true },

  amenities: { type: [String], default: [] },                // e.g., Parking, Washroom, etc.

  images: {
    logo: { type: String },                                  // venueLogo
    gallery: [{ type: String }],                             // galleryImages
  },

  is24HoursOpen: { type: Boolean, default: false },

  location: {
    address: { type: String, required: true },               // fullAddress (shopNo, floorTower, areaSectorLocality)
    city: { type: String, required: true },
    // state: { type: String, required: true },
    country: { type: String, default: "India" },
    pincode: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },    // [lng, lat]
    },
  },

  contact: {
    name: { type: String, required: true },                  // contactPersonName
    phone: { type: String, required: true },                 // contactPhone
    email: { type: String, required: true },                 // contactEmail
  },

  owner: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },

  sportsFacilities: { type: [sportsFacilitySchema], default: [] },

  declarationAgreed: { type: Boolean, default: false },

  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

  pendingChanges: { type: mongoose.Schema.Types.Mixed, default: null },

  rawVenueData: { type: mongoose.Schema.Types.Mixed, default: null },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now }
});

export default models.Venue || mongoose.model('Venue', venueSchema);
