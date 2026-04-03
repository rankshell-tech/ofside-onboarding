import { CtaBand, PageHero, Section, SectionIntro, SimpleCardGrid } from "../components/marketing";

const aboutCards = [
  {
    title: "Who we are",
    description:
      "Ofside is being shaped as a sports ecosystem brand for India, connecting players, venues, and sports activity through one more coherent digital experience.",
  },
  {
    title: "Vision",
    description:
      "To make local sports easier to discover, easier to organize, and easier to keep coming back to across cities, communities, and venue networks.",
  },
  {
    title: "Mission",
    description:
      "To reduce friction between intent and play by giving users and venue partners a more trustworthy, structured, and sports-native platform.",
  },
];

const whyExists = [
  {
    title: "Sports discovery is often fragmented",
    description:
      "Players usually bounce between calls, chats, listings, and guesswork just to figure out where to play next.",
  },
  {
    title: "Venues need better digital representation",
    description:
      "Operators need a cleaner way to present their venue, explain what they offer, and connect with motivated local demand.",
  },
  {
    title: "The ecosystem should feel connected",
    description:
      "Bookings, scores, leaderboards, teams, support, and venue participation work better when they feel part of one continuous system.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="About Us"
        title="Ofside exists to make local sport feel easier to find, easier to trust, and easier to grow."
        description="This brand is being built around a simple belief: sports participation should not feel scattered. Players and venue partners both deserve a smoother system."
        primaryCta={{ label: "Contact Ofside", href: "/contact-us" }}
        secondaryCta={{ label: "Explore Home", href: "/" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-yellow-600">Human and trust-building</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">Built with a two-sided sports mindset</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Ofside is trying to serve the player who wants more access and the venue team that wants more visibility, structure, and trust.
            </p>
          </div>
        }
      />

      <Section>
        <SectionIntro
          eyebrow="Our Direction"
          title="A practical product vision, not abstract brand talk"
          description="The product already signals what it wants to become: a sports ecosystem for venue discovery, bookings, matches, scoring, and local engagement."
        />
        <div className="mt-10">
          <SimpleCardGrid items={aboutCards} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Why Ofside Exists"
          title="The gap Ofside is trying to close"
          description="The idea is simple: local sports should feel less chaotic and more connected for everyone involved."
          align="center"
        />
        <div className="mt-10">
          <SimpleCardGrid items={whyExists} />
        </div>
      </Section>

      {/* <Section>
        <SectionIntro
          eyebrow="Team"
          title="Founder / team section"
          description="This section is intentionally flexible so you can later add founder names, photos, advisor profiles, or team notes without reworking the page structure."
        />
        <div
          data-reveal="feature-card"
          className="mt-10 rounded-[2rem] border border-dashed border-yellow-400 bg-yellow-50 p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-950">A place for the people behind the platform</h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700">
            Right now this block acts as a trust-building placeholder for founder or team content. Once you are ready, we can swap this with real profiles, portraits, and a more personal origin story.
          </p>
        </div>
      </Section> */}

      <Section>
        <CtaBand
          title="Want to know more about the people and thinking behind Ofside?"
          description="Use the contact page for partnerships, support, media conversations, or general questions about the brand."
          primaryCta={{ label: "Contact Us", href: "/contact-us" }}
          secondaryCta={{ label: "Venue Partners", href: "/venue-partners" }}
        />
      </Section>
    </main>
  );
}
