// Single source of truth for the event landing page + registration APIs.

export const EVENT = {
  /** Mongo / API event id — do not change once registrations exist. */
  slug: "ofside-open-2026",
  /** Public landing URL path under /events/… */
  path: "sessions-badminton-doubles-rackonnect-delhi-22-aug-2026",
  name: "SESSIONS by Ofside (Badminton doubles community games)",
  seriesName: "SESSIONS",
  tagline: "Meet. Play. Connect. Repeat.",
  edition: "Community Series",
  shortDescription:
    "Community badminton doubles for all skill levels. Guaranteed matches, goodies, and a solid night of play.",
  logoSrc: "/assets/sessions-logo-v3.png",
  detailsFinal: true,
  date: "Sat, 22nd August",
  dateShort: "Sat · 22 Aug",
  timeWindow: "7:00 PM to 9:00 PM",
  reportingNote: "Please report by 6:40 PM for smooth check-in.",
  venueName: "Rackonnect Badminton Arena",
  venueAddress:
    "Rackonnect Badminton Arena, Farm, No.-1, Ladha Sarai Village, Mehrauli, New Delhi, Delhi 110030",
  city: "New Delhi",
  mapsQuery:
    "Rackonnect Badminton Arena, Farm No. 1, Ladha Sarai Village, Mehrauli, New Delhi, Delhi 110030",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rackonnect%20Badminton%20Arena%20Farm%20No.%201%20Ladha%20Sarai%20Village%20Mehrauli%20New%20Delhi%20110030",
  calendarStartIso: "2026-08-22T19:00:00+05:30",
  calendarEndIso: "2026-08-22T21:00:00+05:30",

  sport: "Badminton Doubles",

  // Pricing — ₹290 per player → ₹580 doubles checkout (10% off if both female).
  pricePerPersonInr: 290,
  displayPriceInr: 290,
  gstMultiplier: 1,
  femalePairDiscount: 0.1,
  currency: "INR",
  playersPerCheckout: 2,
  maxRegistrations: 24,
  maxPlayers: 48,

  whatsIncluded: [
    "Guaranteed 2 Doubles Matches",
    "FREE Ofside PRO Membership worth ₹399/year",
    "10% direct off for female doubles",
    "10% off at REPPP cafeteria",
    "Badminton racquets provided by Ofside only for playing (community members)",
    "Lucky draw goodies and freebies",
    "Engagement activities and much more",
    "Event Photography",
  ],

  highlights: [
    {
      title: "Guaranteed 2 doubles matches",
      body: "Every pair gets at least 2 doubles games — structured rounds so you play, not wait.",
    },
    {
      title: "FREE Ofside PRO (worth ₹399/year)",
      body: "Included free for every community event member. Scores and match history in the app.",
    },
    {
      title: "10% off for female doubles",
      body: "Both players female get automatic 10% off on badminton doubles. Gender checked at the venue.",
    },
    {
      title: "10% off at REPPP cafeteria",
      body: "Community event members get 10% off at the REPPP cafeteria.",
    },
    {
      title: "Racquets provided",
      body: "Badminton racquets from Ofside at the venue, only for playing, exclusively for community members.",
    },
    {
      title: "Lucky draw goodies & freebies",
      body: "Lucky draw goodies, freebies, engagement activities and much more on the night.",
    },
    {
      title: "Event photography",
      body: "On-court and candid shots from the night — so you leave with memories, not just match scores.",
    },
  ],

  schedule: [
    { time: "6:40 PM", label: "Player Check-in Opens" },
    { time: "6:55 PM", label: "Welcome Briefing & House Rules" },
    { time: "7:00 PM", label: "Round 1" },
    { time: "7:20 PM", label: "Round 2" },
    { time: "7:40 PM", label: "Community Challenge 1 - Rally Royale" },
    { time: "7:45 PM", label: "Round 3" },
    { time: "8:05 PM", label: "Round 4" },
    { time: "8:25 PM", label: "Community Challenge 2 - One-Racket Challenge" },
    { time: "8:30 PM", label: "Round 5" },
    { time: "8:45 PM", label: "Round 6 & Final Rotations" },
    { time: "8:55 PM", label: "Awards, Group Photo & Networking" },
    { time: "9:00 PM", label: "Event Concludes" },
  ],

  faqs: [
    {
      q: "Who can register?",
      a: "Anyone in Delhi NCR looking for a community doubles session. Each checkout covers 2 players (you + your partner).",
    },
    {
      q: "When and where is it?",
      a: "Sat, 22nd August, 7:00 PM to 9:00 PM at Rackonnect Badminton Arena, Farm, No.-1, Ladha Sarai Village, Mehrauli, New Delhi, Delhi 110030.",
    },
    {
      q: "How does email verification work?",
      a: "We send a 6-digit code to your email before payment. Mobile is collected for coordination; verification is on email.",
    },
    {
      q: "What's included with Ofside PRO?",
      a: "Every community event member gets FREE Ofside PRO membership worth ₹399/year. Scores and match history in the app, included with your entry.",
    },
    {
      q: "What's the female doubles discount?",
      a: "If both registered players are female, 10% direct off applies automatically on badminton doubles. Misreporting gender to get the discount isn't worth it. Details are verified at the venue.",
    },
    {
      q: "Do I need to bring a racquet?",
      a: "Badminton racquets will be provided by Ofside at the venue only for playing, exclusively for community members. You can still bring your own if you prefer.",
    },
    {
      q: "What else is included?",
      a: "10% off at REPPP cafeteria, lucky draw goodies and freebies, engagement activities, event photography, and much more.",
    },
    {
      q: "When should I arrive?",
      a: "Check-in opens at 6:40 PM. Please arrive by then for smooth check-in and the welcome briefing.",
    },
    {
      q: "Can I get a refund?",
      a: "All registrations are final and non-refundable, except if Ofside cancels or reschedules the event. See the SESSIONS refund policy for details.",
    },
  ],

  playerLevels: ["Beginner", "Intermediate", "Advanced", "PRO"] as const,
  genders: ["Male", "Female", "Other"] as const,

  whatsappCommunityUrl: "https://chat.whatsapp.com/",
  organiserNote:
    "Registrations, payments and live scores are powered by Ofside. Spots are capped. Once full, the page shows sold out.",
} as const;

export type EventGender = (typeof EVENT.genders)[number];
export type EventPlayerLevel = (typeof EVENT.playerLevels)[number];

/** Pre-tax base for a doubles checkout (2 players). */
export function baseAmountInr(): number {
  return EVENT.pricePerPersonInr * EVENT.playersPerCheckout;
}

/** Final payable amount. Female-pair discount is 10% on base. */
export function priceForCheckout(bothFemale: boolean): number {
  const base = baseAmountInr();
  const afterDiscount = bothFemale ? base * (1 - EVENT.femalePairDiscount) : base;
  // Keep 2 decimal places for display; Razorpay uses paise via Math.round(amount * 100).
  return Math.round(afterDiscount * EVENT.gstMultiplier * 100) / 100;
}

/** @deprecated Use priceForCheckout — kept for any leftover call sites. */
export function priceForPeople(_count: number, bothFemale = false): number {
  return priceForCheckout(bothFemale);
}

export function formatInr(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
