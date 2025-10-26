import { NextRequest } from 'next/server';
import Venue from '@/models/Venue';
import userModel from '@/models/User';
import { connectToDB } from '@/lib/mongo';
import { appendWithRetries } from "@/lib/googleSheets";

// This POST handler creates a new venue and syncs to Google Sheets (best effort)
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    // Extract fields from body (updated as per new JSON)
    const {
      venueName,
      sportsOffered,
      description,
      venueLogo,
      is24HoursOpen,
      revenueModel,
      shopNo,
      floorTower,
      areaSectorLocality,
      latitude,
      longitude,
      city,
      state,
      landmark,
      pincode,
      fullAddress,
      contactPersonName,
      contactPhone,
      contactEmail,
      ownerName,
      ownerPhone,
      ownerEmail,
      startTime,
      endTime,
      venuePartnerAcknowledgment,
      amenities,
      availableDays,
      courts,
    } = body;

    // Required fields check (updated for new declarations)
    if (
      !venueName ||
      !description ||
      !contactPersonName ||
      !contactPhone ||
      !contactEmail ||
      !city ||
      !pincode ||
      !Array.isArray(courts) ||
      courts.length === 0 ||
      !Array.isArray(availableDays) ||
      availableDays.length === 0 ||
      !revenueModel ||
      !venuePartnerAcknowledgment
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Missing required fields: ${[
        !venueName && 'venueName',
        !description && 'description',
        !contactPersonName && 'contactPersonName',
        !contactPhone && 'contactPhone',
        !contactEmail && 'contactEmail',
        !city && 'city',
        !pincode && 'pincode',
        (!Array.isArray(courts) || courts.length === 0) && 'courts',
        (!Array.isArray(availableDays) || availableDays.length === 0) && 'availableDays',
        !revenueModel && 'revenueModel',
        !venuePartnerAcknowledgment && 'venuePartnerAcknowledgment',
          ].filter(Boolean).join(', ')}`,
          missingFields: [
        !venueName && 'venueName',
        !description && 'description',
        !contactPersonName && 'contactPersonName',
        !contactPhone && 'contactPhone',
        !contactEmail && 'contactEmail',
        !city && 'city',
        !pincode && 'pincode',
        (!Array.isArray(courts) || courts.length === 0) && 'courts',
        (!Array.isArray(availableDays) || availableDays.length === 0) && 'availableDays',
        !revenueModel && 'revenueModel',
        !venuePartnerAcknowledgment && 'venuePartnerAcknowledgment',
          ].filter(Boolean),
        }),
        { status: 400 }
      );
    }

    // Check for duplicate venue (use fullAddress if provided, else fallback)
    const addressString = fullAddress
      ? fullAddress
      : `${shopNo}, ${floorTower}, ${areaSectorLocality}`;
    const existingVenue = await Venue.findOne({
      venueName,
      'location.address': addressString,
    });

    if (existingVenue) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Venue already exists at this location!',
        }),
        { status: 409 }
      );
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
      courtSlotDuration: string | number;
      courtMaxPeople: string | number;
      courtPricePerSlot: string | number;
      courtPeakEnabled?: boolean;
      courtPeakDays?: string[];
      courtPeakStart?: string;
      courtPeakEnd?: string;
      courtPeakPricePerSlot?: string | number;
    }

    // Convert string numbers to numbers for slotDuration, maxPeople, pricePerSlot, peakPricePerSlot
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
        others: Array.isArray(court.courtImages?.others)
          ? court.courtImages.others
          : [],
      },
      slotDuration: court.courtSlotDuration
        ? Number(court.courtSlotDuration)
        : 0,
      maxPeople: court.courtMaxPeople ? Number(court.courtMaxPeople) : 0,
      pricePerSlot: court.courtPricePerSlot
        ? Number(court.courtPricePerSlot)
        : 0,
      peakEnabled: court.courtPeakEnabled || false,
      peakDays: court.courtPeakDays || [],
      peakStart: court.courtPeakStart || '',
      peakEnd: court.courtPeakEnd || '',
      peakPricePerSlot: court.courtPeakPricePerSlot
        ? Number(court.courtPeakPricePerSlot)
        : 0,
    }));

    // Venue data (updated for new fields)
    const venueData = {
      venueName,
      sportsOffered,
      description,
      venueLogo,
      is24HoursOpen,
      revenueModel,
      amenities,
      availableDays,
      location: {
        address: addressString,
        city,
        state: state || '',
        country: 'India',
        pincode,
        fullAddress: fullAddress || addressString,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        landmark: landmark || '',
        coordinates: {
          type: 'Point',
          coordinates: [
            longitude ? parseFloat(longitude) : 0,
            latitude ? parseFloat(latitude) : 0,
          ],
        },
      },
      contact: {
        name: contactPersonName,
        phone: contactPhone,
        email: contactEmail,
      },
      owner: {
        name: ownerName,
        phone: ownerPhone,
        email: ownerEmail,
      },
      startTime,
      endTime,
      courts: courtsData,

      venuePartnerAcknowledgment: !!venuePartnerAcknowledgment,
      rawVenueData: body,
      createdBy: userWhoCreated._id,
    };

    const newVenue = new Venue(venueData);
    await newVenue.save();

    // // --- Google Sheets sync (best-effort) --- this takes too long
    // await syncVenueToGoogleSheets(newVenue);


    return new Response(
      JSON.stringify({
        success: true,
        message: 'Venue created successfully',
            venueId: newVenue._id,
        data: newVenue,
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('CREATE VENUE ERROR:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while creating the venue.',
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
    // Helper function to sync venue to Google Sheets
    async function syncVenueToGoogleSheets(venue: typeof Venue.prototype) {
      try {
      if (!process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS) {
        throw new Error('GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS not set');
      }

      const row = [
        venue._id?.toString() || '',
        venue.venueName || '',
        JSON.stringify(venue.sportsOffered || []),
        venue.description || '',
        JSON.stringify(venue.amenities || []),
        venue.is24HoursOpen ? 'Yes' : 'No',
        JSON.stringify(venue.availableDays || []),
        venue.revenueModel || '',
        venue.location?.address || '',
        venue.location?.city || '',
        venue.location?.state || '',
        venue.location?.country || '',
        venue.location?.pincode || '',
        venue.location?.fullAddress || '',
        JSON.stringify(venue.location?.coordinates || {}),
        venue.contact?.name || '',
        venue.contact?.phone || '',
        venue.contact?.email || '',
        venue.owner?.name || '',
        venue.owner?.phone || '',
        venue.owner?.email || '',
        venue.venuePartnerAcknowledgment ? 'Yes' : 'No',
        JSON.stringify(venue.rawVenueData || {}),
        venue.createdBy?.toString() || '',
        (venue.createdAt || new Date()).toISOString(),
        venue.isActive ? 'Yes' : 'No',
        venue.isTrending ? 'Yes' : 'No',
        venue.isVerified ? 'Yes' : 'No',
        venue.rating?.toString() || '0',
        venue.reviewsCount?.toString() || '0',
        JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        venue.courts?.map((court) => ({
          name: court.name,
          sportType: court.sportType,
          surfaceType: court.surfaceType,
          size: court.size,
          isIndoor: court.isIndoor,
          hasLighting: court.hasLighting,
          images: court.images,
          slotDuration: court.slotDuration,
          maxPeople: court.maxPeople,
          pricePerSlot: court.pricePerSlot,
          peakEnabled: court.peakEnabled,
          peakDays: court.peakDays,
          peakStart: court.peakStart,
          peakEnd: court.peakEnd,
          peakPricePerSlot: court.peakPricePerSlot,
        })) || [],
        null,
        2
        ),
      ];

      await appendWithRetries(
        process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS,
        'Venues!A:ZZ',
        row
      );
      } catch (sheetErr) {
      console.error('❌ Failed to append venue to Google Sheets:', sheetErr);
      }
    }
