import HomeHero, { SportsWeCover } from "./components/HomeHero";
import {
  CtaBand,
  FaqGrid,
  FeatureSpotlight,
  IconCardGrid,
  MockLeaderboard,
  MockMatchSetup,
  MockScoreboard,
  Section,
  SectionIntro,
  SimpleCardGrid,
  SportPills,
  StatsStrip,
  TestimonialGrid,
  coreFeatureItems,
  howItWorksItems,
  platformStats,
  trustSignals,
  whyOfsideItems,
} from "./components/marketing";

const sports = [
  "Football",
  "Badminton",
  "Cricket",
  "Box Cricket",
  "Tennis",
  "Pickleball",
  "Volleyball",
  "Futsal",
  "Basketball",
  "Table Tennis",
  "Swimming",
  "Skating",
];

const testimonials = [
  {
    quote:
      "We used to argue about scores in our WhatsApp group. Now we just open Ofside, score live, and share the link — everyone sees the same thing in real time.",
    name: "Weekend Football Group",
    role: "Regular pickup players, Gurgaon",
  },
  {
    quote:
      "The rulebook feature alone is worth it. No more 10-minute debates about pickleball serving rules before we even start playing.",
    name: "Priya M.",
    role: "Pickleball & badminton player",
  },
  {
    quote:
      "Leaderboards got our whole office league competitive again. People actually show up on time now because they want to climb the rankings.",
    name: "Rahul K.",
    role: "Office cricket league organiser",
  },
];

const faqs = [
  {
    question: "What is Ofside?",
    answer:
      "Ofside is India's sports ecosystem app — create matches, score live, track stats, climb leaderboards, and stay connected to your local sports scene.",
  },
  {
    question: "Is Ofside free to download?",
    answer:
      "Yes. Download Ofside for free on iOS and Android. Core features like match creation, live scoring, and rulebooks are free. Ofside Pro is a paid app subscription (monthly or yearly) for premium analytics and advanced features — managed in the app.",
  },
  {
    question: "Which sports does Ofside support?",
    answer:
      "Ofside supports 40+ sports including football, cricket, badminton, tennis, pickleball, volleyball, futsal, box cricket, basketball, table tennis, and many more — each with its own scoring logic and in-app rulebook.",
  },
  {
    question: "How does live scoring work?",
    answer:
      "Create a match, add your teams, and start scoring. Updates broadcast in real time over WebSockets. Share a live score link so friends can follow along, with AI-assisted commentary filling in as the action unfolds.",
  },
  {
    question: "Can I share live scores with friends?",
    answer:
      "Yes. Every live match generates a shareable link. Send it in your group chat and anyone can follow the scoreboard and commentary as the game happens — no app install required to view.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "Reach us at play@ofside.in for player support or through the contact page on this website.",
  },
];

export default function Home() {
  return (
    <main className="bg-[linear-gradient(180deg,#ffffff_0%,#fffef9_36%,#ffffff_100%)] text-gray-950">
      <HomeHero />

      {/* Sports carousel */}
      <Section className="relative overflow-hidden border-b border-gray-100/80 bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_55%,#fafafa_100%)] py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-4 h-56 w-56 rounded-full bg-yellow-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl"
        />
        <SectionIntro
          eyebrow="Sports We Cover"
          title="40+ sports, one platform"
          description="From futsal turfs to badminton courts — every game you play, scored and tracked the right way."
          align="center"
        />
        <div className="relative mt-10 sm:mt-12">
          <SportsWeCover />
        </div>
      </Section>

      {/* Pillar 1: Play Smarter */}
      <Section className="relative py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-6 h-52 w-52 rounded-full bg-yellow-200/30 blur-3xl"
        />
        <FeatureSpotlight
          eyebrow="Play Smarter"
          title="Organize your game"
          titleAccent="in seconds"
          description="Stop juggling WhatsApp groups and phone calls. Create a match, pick your sport, add teams, and get everyone on the same page before the first whistle."
          bullets={[
            "Instant match creation across 40+ sports",
            "Team setup with player assignment",
            "Built-in rulebooks to settle disputes on the spot",
          ]}
          visual={<MockMatchSetup />}
          learnMoreHref="/players"
        />
      </Section>

      {/* Pillar 2: Score Live */}
      <Section className="relative overflow-hidden bg-gray-950 py-20 text-white sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-6 h-56 w-56 rounded-full bg-yellow-300/15 blur-3xl"
        />
        <FeatureSpotlight
          eyebrow="Score Live"
          title="Connect to the action"
          titleAccent="as it happens"
          description="Real-time scoreboards with sport-specific logic, live commentary, and shareable links. Turn every pickup game into a moment your crew can follow — even if they're not there."
          bullets={[
            "WebSocket-powered live score updates",
            "AI-assisted commentary that never blocks the scoreboard",
            "Shareable live score links for friends and followers",
          ]}
          visual={<MockScoreboard />}
          reverse
          dark
        />
      </Section>

      {/* Pillar 3: Track & Compete */}
      <Section className="relative py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-12 h-52 w-52 rounded-full bg-amber-200/30 blur-3xl"
        />
        <FeatureSpotlight
          eyebrow="Track & Compete"
          title="Build your sports"
          titleAccent="identity locally"
          description="Individual stats, team performance, city leaderboards, and insights that turn casual games into friendly rivalry. Past, Live, and Upcoming — always know where you stand."
          bullets={[
            "Individual and team performance tracking",
            "City and area leaderboards",
            "Past, Live, and Upcoming match tabs",
          ]}
          visual={<MockLeaderboard />}
          learnMoreHref="/players"
        />
      </Section>

      {/* Stats strip */}
      <Section className="border-y border-gray-100 bg-[linear-gradient(180deg,_#fffdf2_0%,_#ffffff_100%)] py-16">
        <StatsStrip items={platformStats} />
      </Section>

      {/* How it works */}
      <Section className="bg-[linear-gradient(180deg,#fafafa_0%,#fffef7_100%)]">
        <SectionIntro
          eyebrow="How It Works"
          title="From idea to final whistle in three steps"
          description="Ofside turns scattered sports habits into one connected flow — no more chaos between deciding to play and knowing the score."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={howItWorksItems} />
        </div>
      </Section>

      {/* Core features grid */}
      <Section>
        <SectionIntro
          eyebrow="Core Features"
          title="Robust tools for every player"
          description="Everything you need to organize, score, track, and compete — built for how sports actually happen in Indian cities."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={coreFeatureItems} columns={2} />
        </div>
      </Section>

      {/* Sports supported */}
      <Section className="bg-[linear-gradient(180deg,#fafafa_0%,#fffef7_100%)]">
        <SectionIntro
          eyebrow="Sports Supported"
          title="Multi-sport by design"
          description="One platform for every game you play — from futsal turfs to badminton courts, box cricket to pickleball."
          align="center"
        />
        <div className="mt-8 flex justify-center">
          <SportPills sports={sports} />
        </div>
      </Section>

      {/* Why Ofside */}
      <Section>
        <SectionIntro
          eyebrow="Why Ofside"
          title="More than a scoreboard — a sports ecosystem"
          description="Local sport in India deserves better than scattered chats and guesswork. Ofside is infrastructure for how people actually play."
          align="center"
        />
        <div className="mt-10">
          <SimpleCardGrid items={whyOfsideItems} />
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-[linear-gradient(180deg,#fafafa_0%,#fffef7_100%)]">
        <SectionIntro
          eyebrow="From the community"
          title="A few words from our cheering section"
          description="Players across India are using Ofside to organize games, score live, and stay connected to their local sports scene."
          align="center"
        />
        <div className="mt-10">
          <TestimonialGrid items={testimonials} />
        </div>
        <div className="mt-10">
          <IconCardGrid items={trustSignals} />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionIntro
          eyebrow="FAQ"
          title="Common questions, answered simply"
          description="New to Ofside? Here's what you need to know before downloading."
          align="center"
        />
        <div className="mt-10">
          <FaqGrid items={faqs} />
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <CtaBand
          title="The only app you need this season"
          description="Download Ofside free and start creating matches, scoring live, and tracking your performance today."
          primaryCta={{ label: "Download the App", href: "/players" }}
          secondaryCta={{ label: "Contact Us", href: "/contact-us" }}
          showAppButtons
        />
      </Section>
    </main>
  );
}
