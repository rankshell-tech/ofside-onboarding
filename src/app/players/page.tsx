import {
  AppDownloadButtons,
  CtaBand,
  IconCardGrid,
  PageHero,
  Section,
  SectionIntro,
  SimpleCardGrid,
  userBenefitItems,
} from "../components/marketing";
import { CalendarDays, Compass, Megaphone, Users } from "lucide-react";

const playerSections = [
  {
    title: "Discover sports nearby",
    description:
      "Find sports activity closer to your routine instead of relying on manual recommendations and scattered social threads.",
    icon: Compass,
  },
  {
    title: "Explore venues",
    description:
      "Understand venue options, compare what fits your game, and move toward booking with less uncertainty.",
    icon: CalendarDays,
  },
  {
    title: "Track sports ecosystem updates",
    description:
      "Stay more connected to the local sports environment and the activity happening around your preferred sports.",
    icon: Megaphone,
  },
  {
    title: "Join the local sports movement",
    description:
      "Ofside is strongest when it helps players become part of a living, repeatable culture of play and participation.",
    icon: Users,
  },
];

const userValueCards = [
  {
    title: "Less friction, more game time",
    description:
      "The product direction is built around helping people find what to play and move faster from intent to action.",
  },
  {
    title: "A fuller sports journey",
    description:
      "Ofside is not only about the booking moment. It also reflects match creation, scoring, tracking, and leaderboard behavior.",
  },
  {
    title: "Built for repeat play",
    description:
      "The experience encourages people to return, improve, compete, and stay engaged with their community over time.",
  },
];

export default function PlayersPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="For Players / Users"
        title="A simpler way to discover venues, play more often, and stay close to your sports world."
        description="Ofside is built for users who want more than a one-time booking. It supports discovery, exploration, match journeys, and a stronger connection to local sports activity."
        primaryCta={{ label: "Explore Ofside", href: "/" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-yellow-600">What users get</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">A connected player-first experience</h2>
            <div className="mt-8 grid gap-4">
              {[
                "Venue discovery nearby",
                "Exploration before booking",
                "Match and score journeys",
                "Community and leaderboard energy",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-medium text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Section>
        <SectionIntro
          eyebrow="What Users Get"
          title="Everything starts with helping players make better sports decisions."
          description="The app language already shows a product that values nearby discovery, venue exploration, match setup, scoring, and performance tracking."
        />
        <div className="mt-10">
          <IconCardGrid items={userBenefitItems} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Player Experience"
          title="The key player-facing journeys"
          description="These are the high-value moments Ofside is trying to serve for users."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={playerSections} columns={2} />
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="Why It Matters"
          title="Why users can keep coming back"
          description="Ofside becomes more useful when it helps users do more than find one slot. It should help them stay active in their sports ecosystem."
        />
        <div className="mt-10">
          <SimpleCardGrid items={userValueCards} />
        </div>
        <div className="mt-8">
          <AppDownloadButtons />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Want to explore Ofside as a player?"
          description="Start with the main website, reach out for app access, or contact the team if you want help getting into the ecosystem."
          primaryCta={{ label: "Explore Ofside", href: "/" }}
         
          showAppButtons
        />
      </Section>
    </main>
  );
}
