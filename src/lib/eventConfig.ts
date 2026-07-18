// Single source of truth for the event landing page + registration APIs.
// Details are placeholders — swap in the real event copy once finalised.

export const EVENT = {
  slug: "ofside-open-2026",
  name: "Ofside Community Open 2026",
  tagline: "Play. Compete. Belong.",
  edition: "Season 1",
  // Ofside's role in the event.
  partnerRole: "Official Scoring Partner",
  shortDescription:
    "A weekend-long multi-sport community showdown — live-scored end to end by Ofside. Bring your crew, climb the leaderboard, and become part of the city's fastest-growing sports community.",
  date: "Saturday, 14 March 2026",
  dateShort: "14 Mar 2026",
  timeWindow: "8:00 AM – 8:00 PM",
  venueName: "DLF Sports Arena",
  venueAddress: "Sector 54, Golf Course Road, Gurugram, Haryana 122002",
  city: "Gurugram",
  mapsQuery: "DLF Sports Arena, Sector 54, Gurugram",

  sports: ["Football 5s", "Badminton", "Box Cricket", "Pickleball", "Table Tennis"],

  // Pricing — INR per person.
  pricePerPersonInr: 499,
  currency: "INR",
  maxGroupSize: 4,

  highlights: [
    {
      title: "Live scoring by Ofside",
      body: "Every match tracked ball-by-ball in the Ofside app, with real-time leaderboards on the big screen.",
    },
    {
      title: "5 sports, one arena",
      body: "Football 5s, badminton, box cricket, pickleball and table tennis running all day across pro-grade courts.",
    },
    {
      title: "Prizes worth ₹1,00,000",
      body: "Winner trophies, sponsor hampers, and Ofside Pro memberships for the podium in every sport.",
    },
    {
      title: "Community, not just competition",
      body: "Meet players near you, form teams, and keep the rivalry going long after the final whistle.",
    },
  ],

  schedule: [
    { time: "8:00 AM", label: "Check-in & warm-up" },
    { time: "9:00 AM", label: "Group stages begin (all sports)" },
    { time: "1:00 PM", label: "Lunch & community mixer" },
    { time: "2:30 PM", label: "Knockouts & semi-finals" },
    { time: "6:00 PM", label: "Finals under the lights" },
    { time: "7:30 PM", label: "Prize ceremony" },
  ],

  faqs: [
    {
      q: "Who can register?",
      a: "Anyone 16+ can join. You can register solo or as a group of up to 4 people in a single entry.",
    },
    {
      q: "What does the fee include?",
      a: "Your ₹499 per person covers arena access, match entry across sports, an event kit, and refreshments.",
    },
    {
      q: "How is scoring handled?",
      a: "Ofside is the official scoring partner — all matches are scored live in the Ofside app, and your stats stay on your profile.",
    },
    {
      q: "Can I get a refund?",
      a: "Entries are transferable but non-refundable. See our refund policy for details.",
    },
  ],

  organiserNote:
    "Ofside is the official scoring partner for this event. Registrations, payments and live scores are powered by Ofside.",
} as const;

export function priceForPeople(count: number): number {
  const n = Math.max(1, Math.min(EVENT.maxGroupSize, Math.floor(count || 1)));
  return n * EVENT.pricePerPersonInr;
}
