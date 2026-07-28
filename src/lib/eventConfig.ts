// Single source of truth for the event landing page + registration APIs.

export const EVENT = {
  slug: "ofside-open-2026",
  name: "Delhi NCR Community Badminton Games",
  seriesName: "SESSIONS",
  tagline: "Meet. Play. Connect. Repeat.",
  edition: "Community Series",
  shortDescription:
    "Community games where players of all skill levels come together for guaranteed matches, great people, and an unforgettable sporting experience.",
  logoSrc: "/assets/sessions-logo.png",
  // Tentative — date / time / venue are not final yet.
  detailsFinal: false,
  date: "Saturday (date TBA)",
  dateShort: "Sat · TBA",
  timeWindow: "6:00 PM – 8:00 PM",
  reportingNote: "Please report 20 minutes before start for smooth check-in.",
  venueName: "REPPP, Delhi",
  venueAddress: "REPPP, Delhi NCR (exact pin shared after confirmation)",
  city: "Delhi NCR",
  mapsQuery: "REPPP Delhi",
  calendarStartIso: "2026-08-01T18:00:00+05:30",
  calendarEndIso: "2026-08-01T20:00:00+05:30",

  sport: "Badminton Doubles",

  // Pricing — base INR per player (pre-tax). Checkout is for 2 players.
  pricePerPersonInr: 249,
  displayPriceInr: 250,
  gstMultiplier: 1.18,
  femalePairDiscount: 0.1,
  currency: "INR",
  playersPerCheckout: 2,
  maxRegistrations: 24,
  maxPlayers: 48,

  whatsIncluded: [
    "Guaranteed 2 Doubles Matches",
    "FREE Ofside PRO Membership",
    "Community Networking",
    "Event Photography & Reels",
    "Community Giveaways",
  ],

  highlights: [
    {
      title: "Guaranteed 2 doubles matches",
      body: "You and your partner get at least two games. No paying just to sit on the bench.",
    },
    {
      title: "FREE Ofside PRO",
      body: "Ticket includes PRO — scores and match history in the app, no second payment.",
    },
    {
      title: "Photos, reels & giveaways",
      body: "On-court content plus community giveaways. Show up early; drops go fast.",
    },
    {
      title: "10% off for women's pairs",
      body: "Both players female → automatic 10% off. Gender checked at the venue.",
    },
  ],

  schedule: [
    { time: "T–20 min", label: "Reporting & check-in" },
    { time: "6:00 PM", label: "Warm-up & pairings" },
    { time: "6:15 PM", label: "Match block 1" },
    { time: "7:00 PM", label: "Match block 2" },
    { time: "7:45 PM", label: "Wrap, photos & giveaways" },
  ],

  faqs: [
    {
      q: "Who can register?",
      a: "Anyone in Delhi NCR looking for a community doubles session. Each checkout covers 2 players (you + your partner).",
    },
    {
      q: "Is the date / venue final?",
      a: "Not yet — time, date and venue are tentative. Confirmed details go out on email and WhatsApp once locked.",
    },
    {
      q: "How does email verification work?",
      a: "We send a 6-digit code to your email before payment. Mobile is collected for coordination; verification is on email.",
    },
    {
      q: "What's the women's pair discount?",
      a: "If both registered players are female, 10% off applies automatically. Misreporting gender to get the discount isn't worth it — details are verified at the venue.",
    },
    {
      q: "When should I arrive?",
      a: "Report 20 minutes before the session start for smooth check-in and fewer pairing errors.",
    },
    {
      q: "Can I get a refund?",
      a: "Entries are transferable but non-refundable. See our refund policy for details.",
    },
  ],

  playerLevels: ["Beginner", "Intermediate", "Semi-PRO", "Advanced"] as const,
  genders: ["Male", "Female", "Other"] as const,

  whatsappCommunityUrl: "https://chat.whatsapp.com/",
  organiserNote:
    "Registrations, payments and live scores are powered by Ofside. Spots are capped — once full, the page shows sold out.",
} as const;

export type EventGender = (typeof EVENT.genders)[number];
export type EventPlayerLevel = (typeof EVENT.playerLevels)[number];

/** Pre-tax base for a doubles checkout (2 players). */
export function baseAmountInr(): number {
  return EVENT.pricePerPersonInr * EVENT.playersPerCheckout;
}

/** Final payable amount (incl. GST). Female-pair discount is 10% on pre-tax base. */
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
