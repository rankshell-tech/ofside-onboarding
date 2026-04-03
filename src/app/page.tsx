import {
  CtaBand,
  FaqGrid,
  IconCardGrid,
  PageHero,
  Section,
  SectionIntro,
  SimpleCardGrid,
  SportPills,
  StatStrip,
  howItWorksItems,
  partnerBenefitItems,
  siteFacts,
  trustSignals,
  userBenefitItems,
  whyOfsideItems,
  TestimonialGrid,
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
      "We needed one place to discover venues and plan play with fewer back-and-forth messages. Ofside feels built for that habit.",
    name: "Community Player",
    role: "Regular weekend football group",
  },
  {
    quote:
      "The app direction makes sense because it does not stop at booking. Scoring, teams, and leaderboard thinking make it feel more complete.",
    name: "Competitive User",
    role: "Badminton and pickleball player",
  },
  {
    quote:
      "The venue onboarding flow already asks the kind of operational details a serious partner expects to provide.",
    name: "Venue Operator",
    role: "Prospective Ofside partner",
  },
];

const faqs = [
  {
    question: "What is Ofside?",
    answer:
      "Ofside is a sports ecosystem bringing together venue discovery, bookings, scoring, performance journeys, and local sports engagement.",
  },
  {
    question: "Who is Ofside built for?",
    answer:
      "It is built for both players and venue partners. Players get a smoother way to discover and engage with sports nearby, while venues get a clearer digital onboarding and visibility path.",
  },
  {
    question: "Which sports does Ofside support?",
    answer:
      "The product direction already spans multiple sports including football, cricket, badminton, tennis, pickleball, volleyball, and several more categories reflected in the app.",
  },
  {
    question: "Can venues join Ofside today?",
    answer:
      "Yes. The website already includes a detailed onboarding flow where venue partners can submit venue, court, pricing, amenity, and document information.",
  },
  {
    question: "Is Ofside only about bookings?",
    answer:
      "No. The broader experience also points to match creation, score tracking, leaderboards, team setup, rulebooks, and community activity.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "You can contact Ofside through the contact page, by email, by phone or WhatsApp, or by using the venue onboarding journey if you are a venue partner.",
  },
];

export default function Home() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="India's Ultimate Sports Ecosystem"
        title="Book venues, build games, and grow local sports with one Ofside experience."
        description="Ofside brings together venue discovery, match journeys, scoring, leaderboard thinking, and a stronger bridge between players and venue partners."
        primaryCta={{ label: "Explore Venue Partner Flow", href: "/venue-partners" }}
        secondaryCta={{ label: "See What Players Get", href: "/players" }}
        aside={
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              <video
                className="h-full w-full rounded-[1.4rem] object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/assets/ofside.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <StatStrip
              items={[
                { value: "40+", label: "Sports categories reflected across the product ecosystem" },
                { value: "60 sec", label: "Booking promise referenced in the app experience" },
                { value: "2-sided", label: "Built for players and venue partners together" },
              ]}
            />
          </div>
        }
      />

      <Section>
        <SectionIntro
          eyebrow="About Ofside"
          title="A sports ecosystem designed around how people actually play."
          description="The frontend app already tells a strong story: discover venues nearby, create matches, track performance, explore leaderboards, and keep the local sports scene moving. This website now carries that same story in a clearer public-facing format."
        />
        <div className="mt-10">
          <IconCardGrid items={siteFacts} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="How It Works"
          title="Ofside turns scattered sports habits into one connected flow."
          description="Whether you are a player looking for your next game or a venue partner looking to reach the right audience, the experience is built around simple, repeatable actions."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={howItWorksItems} />
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="Sports Supported"
          title="Multi-sport by design"
          description="The app already references a wide set of sports, helping Ofside feel like a broader sports platform rather than a single-use booking tool."
        />
        <div className="mt-8">
          <SportPills sports={sports} />
        </div>
      </Section>

      <Section className="bg-[linear-gradient(180deg,_#ffffff_0%,_#fffdf2_100%)]">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionIntro
              eyebrow="For Users"
              title="For players who want less friction and more sport."
              description="Ofside helps users discover nearby options, explore venues with more confidence, and stay closer to their local sports ecosystem."
            />
            <div className="mt-8">
              <IconCardGrid items={userBenefitItems} columns={2} />
            </div>
          </div>
          <div>
            <SectionIntro
              eyebrow="For Venue Partners"
              title="For venue teams who want visibility, structure, and momentum."
              description="The existing onboarding system already points to a partner-friendly setup with operational details, court data, pricing inputs, and support."
            />
            <div className="mt-8">
              <IconCardGrid items={partnerBenefitItems} columns={2} />
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Why Ofside"
          title="Why this brand can matter in the local sports stack"
          description="Ofside is strongest when it connects discovery, play, performance, and partner participation instead of treating each piece like a separate product."
          align="center"
        />
        <div className="mt-10">
          <SimpleCardGrid items={whyOfsideItems} />
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="Testimonials / Trust"
          title="Trust starts with clarity, coverage, and visible product depth."
          description="These testimonials are positioning-led statements drawn from the product experience already visible across the app and onboarding flow."
        />
        <div className="mt-10">
          <TestimonialGrid items={testimonials} />
        </div>
        <div className="mt-10">
          <IconCardGrid items={trustSignals} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="FAQ"
          title="Common questions, answered simply"
          description="A clear top-level explanation helps new users and potential partners understand what Ofside does before they enter the product."
          align="center"
        />
        <div className="mt-10">
          <FaqGrid items={faqs} />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Want to explore Ofside from the angle that fits you best?"
          description="Players can learn how the ecosystem helps them discover and track sport. Venue partners can start the onboarding journey and bring their venue into the Ofside network."
          primaryCta={{ label: "List Your Venue", href: "/onboarding" }}
          secondaryCta={{ label: "Contact Ofside", href: "/contact-us" }}
          showAppButtons
        />
      </Section>
    </main>
  );
}
