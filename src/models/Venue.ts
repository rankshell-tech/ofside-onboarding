import mongoose, { Schema, models } from 'mongoose';

// Sports Facility Schema (Each facility is a court for a specific sport)
const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                  // courtName
    sportType: { type: String, required: true },             // courtSportType (e.g., "Football", "Tennis")
    surfaceType: { type: String },                           // surfaceType
    size: { type: String },                                  // courtSize (e.g., 5-a-side, Standard)
    isIndoor: { type: Boolean, default: false },             // isIndoor
    hasLighting: { type: Boolean, default: false },          // hasLighting
    images: {
      cover: { type: String, default: null },                // URL or path to cover image
      logo: { type: String, default: null },                 // URL or path to logo image
      others: { type: [String], default: [] }                // Array of URLs/paths for other images
    },
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

// Main Venue Schema
const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true },               // venueName
  venueType: { type: String },                               // venueType (Turf, Stadium, etc.)
  sportsOffered: { type: [String], default: [] },            // sportsOffered
  description: { type: String, required: true },

  amenities: { type: [String], default: [] },                // e.g., Parking, Washroom, etc.

  is24HoursOpen: { type: Boolean, default: false },

  availableDays: { type: [String], default: [] },            // <-- Added as per route.ts

  revenueModel: { type: String },                            // <-- Added as per route.ts

  location: {
    address: { type: String, required: true },               // fullAddress (shopNo, floorTower, areaSectorLocality)
    city: { type: String, required: true },
    state: { type: String, default: "" },                    // <-- Added as per route.ts
    country: { type: String, default: "India" },
    pincode: { type: String, required: true },
    fullAddress: { type: String, default: "" },              // <-- Added as per route.ts
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

  courts: { type: [courtSchema], default: [] },

  declarationAgreed: { type: Boolean, default: false },
  declarationConsent: { type: Boolean, default: false },     // <-- Added as per route.ts
  declarationAgree: { type: Boolean, default: false },       // <-- Added as per route.ts

  venuePartnerAcknowledgment: { type: Boolean, default: false }, // <-- Added as per route.ts

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
