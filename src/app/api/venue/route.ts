import { NextRequest } from 'next/server';
import Venue from '@/models/Venue';
import userModel from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract fields from body
    const {
      venueName,
      venueType,
      sportsOffered,
      description,
      venueLogo,
      is24HoursOpen,
      shopNo,
      floorTower,
      areaSectorLocality,
      city,
      state,
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
      galleryImages,
      courts,
      declarationAgreed,
    } = body;

    // Required fields check
    if (!venueName || !description || !contactPersonName || !contactPhone || !contactEmail || !city || !pincode || !Array.isArray(courts) || courts.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Missing required fields.' }), { status: 400 });
    }

    // Check for duplicate venue
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

    const sportsFacilities = courts.map(court => ({
      name: court.courtName,
      sportType: court.courtSportType,
      courts: [
        {
          name: court.courtName,
          sportType: court.courtSportType,
          surfaceType: court.surfaceType,
          size: court.courtSize || '',
          isIndoor: court.isIndoor || false,
          hasLighting: court.hasLighting || false,
          images: court.courtImages || [],
          slotDuration: court.courtSlotDuration,
          maxPeople: court.courtMaxPeople,
          pricePerSlot: court.courtPricePerSlot,
          peakEnabled: court.courtPeakEnabled,
          peakDays: court.courtPeakDays,
          peakStart: court.courtPeakStart,
          peakEnd: court.courtPeakEnd,
          peakPricePerSlot: court.courtPeakPricePerSlot
        }
      ]
    }));

    const venueData = {
      venueName,
      venueType,
      sportsOffered,
      description,
      amenities,
      images: {
        logo: venueLogo,
        gallery: galleryImages
      },
      is24HoursOpen,
      location: {
        shopNo,
        floorTower,
        areaSectorLocality,
        address: `${shopNo}, ${floorTower}, ${areaSectorLocality}`,
        city,
        state: state || '',
        pincode,
        country: 'India',
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
      sportsFacilities,
      declarationAgreed,
      createdBy: userWhoCreated._id,
      rawVenueData: body
    };

    const newVenue = new Venue(venueData);
    await newVenue.save();

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
