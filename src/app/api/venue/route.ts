import { NextRequest } from 'next/server';
import Venue from '@/models/Venue';
import userModel from '@/models/User';
import { connectToDB } from '@/lib/mongo';
import { appendWithRetries } from "@/lib/googleSheets"; // <-- new

export async function POST(req: NextRequest) {
  try {
    await connectToDB(); 
    const body = await req.json();

    // Extract fields from body
    const {
      venueName,
      venueType,
      sportsOffered,
      description,
      is24HoursOpen,
      shopNo,
      floorTower,
      areaSectorLocality,
      city,
      pincode,
      latitude,
      longitude,
      contactPersonName,
      contactPhone,
      contactEmail,
      ownerName,
      ownerPhone,
      ownerEmail,
      amenities,
   
      courts,
      declarationAgreed,
    } = body;

    // Required fields check
    if (!venueName || !description || !contactPersonName || !contactPhone || !contactEmail || !city || !pincode || !Array.isArray(courts) || courts.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Missing required fields.' }), { status: 400 });
    }

    // Check for duplicate venuea
    const existingVenue = await Venue.findOne({
      venueName,
      'location.address': `${shopNo}, ${floorTower}, ${areaSectorLocality}`
    });

    if (existingVenue) {
      return new Response(JSON.stringify({ success: false, message: 'Venue already exists at this location!' }), { status: 409 });
    }

    // Promote user if needed
    let userWhoCreated = await userModel.findOne({ email: contactEmail });
    if (!userWhoCreated) {
      userWhoCreated = new userModel({
        name: contactPersonName,
        phone: contactPhone,
        email: contactEmail,
        password: 'defaultPassword123',
        role: 1,
        totalVenueCreated: 0,
      });
      await userWhoCreated.save();
    }
    if (userWhoCreated.role === 0) userWhoCreated.role = 1;
    userWhoCreated.totalVenueCreated++;
    await userWhoCreated.save();

    // Map courts directly to sportsFacilities as per schema
    interface Court {
      courtName: string;
      courtSportType: string;
      surfaceType: string;
      courtSize?: string;
      isIndoor?: boolean;
      hasLighting?: boolean;
      courtImages?: {
        cover?: string;
        logo?: string;
        others?: string[];
      };
      courtSlotDuration: number;
      courtMaxPeople: number;
      courtPricePerSlot: number;
      courtPeakEnabled?: boolean;
      courtPeakDays?: string[];
      courtPeakStart?: string;
      courtPeakEnd?: string;
      courtPeakPricePerSlot?: number;
    }

    const courtsData = (courts as Court[]).map((court) => ({
      name: court.courtName,
      sportType: court.courtSportType,
      surfaceType: court.surfaceType,
      size: court.courtSize || '',
      isIndoor: court.isIndoor || false,
      hasLighting: court.hasLighting || false,
      images: {
        cover: court.courtImages?.cover,
        logo: court.courtImages?.logo,
        others: Array.isArray(court.courtImages?.others) ? court.courtImages.others : [],
      },
      slotDuration: court.courtSlotDuration,
      maxPeople: court.courtMaxPeople,
      pricePerSlot: court.courtPricePerSlot,
      peakEnabled: court.courtPeakEnabled,
      peakDays: court.courtPeakDays,
      peakStart: court.courtPeakStart,
      peakEnd: court.courtPeakEnd,
      peakPricePerSlot: court.courtPeakPricePerSlot
    }));
    console.log(courtsData);

    const venueData = {
      venueName,
      venueType,
      sportsOffered,
      description,
      amenities,
      is24HoursOpen,
      location: {
      address: `${shopNo}, ${floorTower}, ${areaSectorLocality}`,
      city,
      // state is not required in schema, but you can add if needed
      country: 'India',
      pincode,
      coordinates: {
        type: 'Point',
        coordinates: [
        longitude ? parseFloat(longitude) : 0,
        latitude ? parseFloat(latitude) : 0
        ]
      }
      },
      contact: {
      name: contactPersonName,
      phone: contactPhone,
      email: contactEmail
      },
      owner: {
      name: ownerName,
      phone: ownerPhone,
      email: ownerEmail
      },
      courts: courtsData,
      declarationAgreed,
      rawVenueData: body,
      createdBy: userWhoCreated._id
    };

  
    const newVenue = new Venue(venueData);
    await newVenue.save();

// --- Google Sheets sync (best-effort) ---
try {
  if (!process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS) {
    throw new Error("GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS not set");
  }

  const row = [
    newVenue._id.toString(),                 // A: Venue ID
    newVenue.name || "",                     // B: Venue name
    newVenue.venueType || "",                // C: Venue type
    Array.isArray(newVenue.sportsOffered)
      ? newVenue.sportsOffered.join(", ")
      : newVenue.sportsOffered || "",        // D: Sports
    newVenue.city || "",                     // E: City
    newVenue.pincode || "",                  // F: Pincode
    newVenue.contactPersonName || "",        // G: Contact name
    newVenue.contactPhone || "",             // H: Contact phone
    newVenue.contactEmail || "",             // I: Contact email
    newVenue.ownerName || "",                // J: Owner name
    newVenue.ownerPhone || "",               // K: Owner phone
    newVenue.ownerEmail || "",               // L: Owner email
    newVenue.courts?.length ?? 0,            // M: # courts
    (newVenue.createdAt || new Date()).toISOString(), // N: createdAt
  ];

  // Append to sheet named "Venues", columns A:N
  await appendWithRetries(
    process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS,
    "Venues!A:N",
    row
  );
} catch (sheetErr) {
  console.error("❌ Failed to append venue to Google Sheets:", sheetErr);
  // Optional: log to DB for retry later
}


    return new Response(JSON.stringify({
      success: true,
      message: 'Venue created successfully',
      data: newVenue
    }), { status: 201 });
  } catch (error: unknown) {
    console.error("CREATE VENUE ERROR:", error);
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred while creating the venue.',
      error: error instanceof Error ? error.message : String(error)
    }), { status: 500 });
  }
}
