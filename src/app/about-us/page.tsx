import { CtaBand, PageHero, Section, SectionIntro, SimpleCardGrid } from "../components/marketing";

const aboutCards = [
  {
    title: "Who we are",
    description:
      "Ofside is India's sports ecosystem — a digital platform that connects people who want to play with the tools to organize, score, and track their games.",
  },
  {
    title: "Vision",
    description:
      "Make local sports easier to discover, organize, and return to — across cities, communities, and sports cultures.",
  },
  {
    title: "Mission",
    description:
      "Reduce friction between intent and play by giving players a trustworthy, structured, sports-native platform for the full journey from match creation to final whistle.",
  },
];

const whyExists = [
  {
    title: "Sports organization is fragmented",
    description:
      "Players bounce between WhatsApp groups, phone calls, and word-of-mouth just to figure out who's playing and what the score is.",
  },
  {
    title: "Scoring and stats live in separate tools",
    description:
      "Match setup, live scoring, performance tracking, and leaderboards should be one connected flow — not four different apps.",
  },
  {
    title: "Local sport deserves better infrastructure",
    description:
      "India's recreational sports market is huge but undersupported by software built for how people actually behave on the ground.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="About Us"
        title="Ofside exists to make local sport feel easier to organize, score, and return to."
        description="This brand is built around a simple belief: sports participation should not feel scattered. Players deserve a smoother system from the idea of a game to the final whistle."
        primaryCta={{ label: "Contact Ofside", href: "/contact-us" }}
        secondaryCta={{ label: "Explore Features", href: "/players" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-yellow-600">Our belief</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">Built for how India plays</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Local sport in India is often fragmented, informal, and hard to trust. Ofside pulls match management, scoring, performance tracking, and community engagement into one coherent experience.
            </p>
          </div>
        }
      />

      <Section>
        <SectionIntro
          eyebrow="Our Direction"
          title="A practical product vision"
          description="Ofside is a sports ecosystem for match creation, live scoring, stats, leaderboards, rulebooks, and local community engagement."
        />
        <div className="mt-10">
          <SimpleCardGrid items={aboutCards} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Why Ofside Exists"
          title="The gap Ofside is trying to close"
          description="The idea is simple: local sports should feel less chaotic and more connected for everyone who plays."
          align="center"
        />
        <div className="mt-10">
          <SimpleCardGrid items={whyExists} />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Want to know more about Ofside?"
          description="Use the contact page for support, partnerships, media conversations, or general questions about the brand."
          primaryCta={{ label: "Contact Us", href: "/contact-us" }}
          secondaryCta={{ label: "See Features", href: "/players" }}
        />
      </Section>
    </main>
  );
}
