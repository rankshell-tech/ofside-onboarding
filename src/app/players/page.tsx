import {
  AppDownloadButtons,
  CtaBand,
  IconCardGrid,
  PageHero,
  Section,
  SectionIntro,
  SimpleCardGrid,
  coreFeatureItems,
  userBenefitItems,
} from "../components/marketing";
import { BookOpen, Radio, Share2, Users } from "lucide-react";

const playerSections = [
  {
    title: "Create matches instantly",
    description:
      "Pick your sport, set up teams, and get your crew organized — no more scattered WhatsApp threads before every game.",
    icon: Users,
  },
  {
    title: "Score live with commentary",
    description:
      "Real-time scoreboards with sport-specific logic. Share a live score link so friends can follow the action from anywhere.",
    icon: Radio,
  },
  {
    title: "40+ sport rulebooks",
    description:
      "Settle disputes and onboard newcomers with in-app rulebooks for every sport Ofside supports — from futsal to pickleball.",
    icon: BookOpen,
  },
  {
    title: "Share & grow your circle",
    description:
      "Invite friends via referral links, follow players, and build a local sports community that keeps coming back.",
    icon: Share2,
  },
];

const userValueCards = [
  {
    title: "Less chaos, more game time",
    description:
      "Stop spending 20 minutes organizing before you play. Create a match, add teams, and get on the field faster.",
  },
  {
    title: "A fuller sports journey",
    description:
      "Match creation, live scoring, stats, leaderboards, and rulebooks — everything connected in one flow.",
  },
  {
    title: "Built for repeat play",
    description:
      "Leaderboards and performance tracking encourage you to return, improve, and stay engaged with your local scene.",
  },
];

export default function PlayersPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="Features"
        title="Everything you need to play, score, and compete — in one app."
        description="Ofside is built for players who want more than a one-off game. Create matches, score live, track stats, climb leaderboards, and stay connected to your local sports world."
        primaryCta={{ label: "Download the App", href: "#download" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-yellow-600">What you get</p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">A connected player experience</h2>
            <div className="mt-8 grid gap-4">
              {[
                "Instant match creation",
                "Live scoring & commentary",
                "Stats & city leaderboards",
                "40+ sport rulebooks",
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
          eyebrow="Core Features"
          title="Built around how you actually play"
          description="Every feature in Ofside is designed to reduce friction between deciding to play and knowing the final score."
        />
        <div className="mt-10">
          <IconCardGrid items={userBenefitItems} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Player Journeys"
          title="The key moments Ofside serves"
          description="From organizing your crew to sharing the final score — Ofside covers the full journey."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={playerSections} columns={2} />
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="More Features"
          title="Tools for every type of player"
          description="Whether you organize office leagues or show up for weekend pickup games, Ofside has you covered."
        />
        <div className="mt-10">
          <IconCardGrid items={coreFeatureItems} columns={2} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Why It Matters"
          title="Why players keep coming back"
          description="Ofside becomes more useful when it helps you do more than play one game — it helps you build a sports identity locally."
        />
        <div className="mt-10">
          <SimpleCardGrid items={userValueCards} />
        </div>
        <div id="download" className="mt-8">
          <AppDownloadButtons centered />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Ready to play smarter?"
          description="Download Ofside free on iOS and Android. Create your first match in under a minute."
          primaryCta={{ label: "Contact Support", href: "/contact-us" }}
          showAppButtons
        />
      </Section>
    </main>
  );
}
