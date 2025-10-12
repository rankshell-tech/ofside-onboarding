import { NextRequest } from 'next/server';
import Venue from '@/models/Venue'; // Adjust import as needed
import { appendWithRetries,clearSheetData } from "@/lib/googleSheets";
import { connectToDB } from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB(); // Ensure DB is connected

                // Step 1: Clear all previous data from the sheet
        if (!process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS) {
            throw new Error('GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS not set');
        }
        
        await clearSheetData(
            process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS,
            'venues_fetch' // Clears all data in the sheet, beyond column Z
        );
        console.log('✅ Cleared previous data from Google Sheets');


        const venues = await Venue.find(); // Fetch all venues
        // Clear all data except the first row (header)
        await clearSheetData(
            process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS,
            'venues_fetch!A2:Z' // Start clearing from row 2 to preserve the header
        );
        for (const venue of venues) {
            await syncVenueToGoogleSheets(venue);
        }
        
        console.log('✅ All venues saved to Google Sheets');
        return NextResponse.json({ success: true, message: 'All venues saved to Google Sheets' });
    } catch (err) {
        console.error('❌ Failed to save venues:', err);
        return NextResponse.json({ success: false, error: 'Failed to save venues' }, { status: 500 });
    }
  }

        // Helper function to sync venue to Google Sheets
    async function syncVenueToGoogleSheets(venue: typeof Venue.prototype) {
      try {
      if (!process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS) {
        throw new Error('GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS not set');
      }


      // venue.location?.address || '',
        // venue.location?.city || '',
        // venue.location?.state || '',
        // venue.location?.country || '',
 // JSON.stringify(venue.location?.coordinates || {}),
   // venue.declarationConsent ? 'Yes' : 'No',
        // venue.declarationRevenue ? 'Yes' : 'No',
        // venue.declarationAccuracy ? 'Yes' : 'No',
        // JSON.stringify(venue.rawVenueData || {}),
       
        // venue.isActive ? 'Yes' : 'No',
        // venue.isTrending ? 'Yes' : 'No',
        // venue.isVerified ? 'Yes' : 'No',
        // venue.rating?.toString() || '0',
        // venue.reviewsCount?.toString() || '0',

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
const safeString = (value: any) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.join(', ');
    return JSON.stringify(value);
  }
  return value.toString();
};

const courtColumns: string[] = [];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
(venue.courts || []).forEach(court => {
  courtColumns.push(
    safeString(court.name),
    safeString(court.sportType),
    safeString(court.surfaceType),
    // safeString(court.size),
    // court.isIndoor ? 'Yes' : 'No',
    // court.hasLighting ? 'Yes' : 'No',
    safeString(court.images),
    safeString(court.slotDuration),
    safeString(court.maxPeople),
    safeString(court.pricePerSlot),
    court.peakEnabled ? 'Yes' : 'No',
    safeString(court.peakDays),
    safeString(court.peakStart),
    safeString(court.peakEnd),
    safeString(court.peakPricePerSlot)
  );
});

const row = [
  safeString(venue.venueName),
  safeString(venue.createdAt ? venue.createdAt.toISOString() : new Date().toISOString()),
  safeString(venue.sportsOffered),
  safeString(venue.description),
  safeString(venue.amenities),
  venue.is24HoursOpen ? 'Yes' : 'No',
  safeString(venue.availableDays),
  safeString(venue.revenueModel),
  safeString(venue.location?.pincode),
  safeString(venue.location?.fullAddress),
  safeString(venue.contact?.name),
  safeString(venue.contact?.phone),
  safeString(venue.contact?.email),
  safeString(venue.owner?.name),
  safeString(venue.owner?.phone),
  safeString(venue.owner?.email),
  safeString(venue.createdBy),
  safeString(venue._id),
  ...courtColumns
];




      await appendWithRetries(
        process.env.GOOGLE_SPREADSHEET_ID_ONBOARDING_LEADS,
        'venues_fetch!A2',
        row
      );
      } catch (sheetErr) {
      console.error('❌ Failed to append venue to Google Sheets:', sheetErr);
      }
    }
