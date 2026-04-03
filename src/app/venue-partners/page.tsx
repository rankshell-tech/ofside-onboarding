import {
  CtaBand,
  FaqGrid,
  IconCardGrid,
  PageHero,
  Section,
  SectionIntro,
  Checklist,
  SimpleCardGrid,
  partnerBenefitItems,
} from "../components/marketing";
import { BadgeDollarSign, ClipboardList, FileCheck2, Handshake, Megaphone, ShieldCheck } from "lucide-react";

const whyListItems = [
  {
    title: "Reach the right sports audience",
    description: "Show up in a sports-first experience instead of depending only on fragmented discovery channels.",
    icon: Megaphone,
  },
  {
    title: "Present your venue clearly",
    description: "Courts, amenities, timings, and commercial details can be structured through the onboarding journey.",
    icon: ClipboardList,
  },
  {
    title: "Build credibility faster",
    description: "A complete digital presence helps players trust what your venue offers before they arrive.",
    icon: ShieldCheck,
  },
];

const onboardingSteps = [
  {
    title: "Share venue basics",
    description: "Enter your venue details, address, contacts, opening hours, and supporting information.",
    icon: FileCheck2,
  },
  {
    title: "Add courts and operations",
    description: "Specify court-level sport data, pricing, slot duration, capacity, and peak-time setup.",
    icon: ClipboardList,
  },
  {
    title: "Review and go live",
    description: "Submit the form, align on the right commercial path, and move toward listing readiness with the Ofside team.",
    icon: Handshake,
  },
];

const commercialItems = [
  {
    title: "Single venue rollout",
    description: "A good fit for independent venues that want discoverability, structured information, and a lighter onboarding path.",
  },
  {
    title: "Growth partnership",
    description: "Designed for higher-activity venues that want stronger visibility, organized operations, and repeat player demand.",
  },
  {
    title: "Multi-location alignment",
    description: "For operators managing more than one venue or a broader network that needs a custom commercial conversation.",
  },
];

const faqs = [
  {
    question: "Who should use the venue partner onboarding page?",
    answer:
      "Any venue owner, operator, or team member looking to list courts, facilities, or sports spaces with Ofside can start here.",
  },
  {
    question: "What information should we prepare before onboarding?",
    answer:
      "Basic venue details, contact information, court information, pricing inputs, operating hours, and supporting documents help the process move faster.",
  },
  {
    question: "Do all venues follow the same commercial structure?",
    answer:
      "Not necessarily. The commercial path can be shaped around your venue format, city, sport mix, and operating setup.",
  },
  {
    question: "Can a venue add multiple courts and sports?",
    answer:
      "Yes. The existing onboarding journey already supports multiple courts along with court-specific information.",
  },
];

export default function VenuePartnersPage() {
  return (
    <main className="bg-white text-gray-950">
      <PageHero
        eyebrow="For Venue Partners"
        title="List your venue with a sports brand built for active discovery."
        description="Ofside gives venue partners a cleaner path to present their venue, reach nearby players, and join a wider sports ecosystem that goes beyond a static listing."
        primaryCta={{ label: "List Your Venue", href: "/onboarding" }}
        secondaryCta={{ label: "Contact Business Team", href: "/contact-us" }}
        aside={
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="inline-flex rounded-2xl bg-yellow-100 p-3 text-gray-950">
              <BadgeDollarSign className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-gray-950">Built for venue readiness</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              The current onboarding flow already handles venue, court, pricing, amenity, and image-level detail so partners can submit with confidence.
            </p>
            <div className="mt-8 grid gap-4">
              {["Venue details", "Court operations", "Commercial setup", "Documents and declarations"].map((item) => (
                <div key={item} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Section>
        <SectionIntro
          eyebrow="Why List With Ofside"
          title="A listing is stronger when it lives inside a real sports journey."
          description="Ofside is not just a brochure website. It is part of a larger player-facing flow around discovery, booking, scoring, and sports participation."
        />
        <div className="mt-10">
          <IconCardGrid items={whyListItems} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Benefits"
          title="What venue partners stand to gain"
          description="The app and onboarding flow together already point to benefits around discoverability, structure, and player confidence."
          align="center"
        />
        <div className="mt-10">
          <IconCardGrid items={partnerBenefitItems} columns={2} />
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="How Onboarding Works"
          title="A step-by-step path from interest to listing readiness"
          description="The process is designed to capture enough detail to represent your venue properly and help the Ofside team support your launch."
        />
        <div className="mt-10">
          <IconCardGrid items={onboardingSteps} />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="Plans / Commercial Model"
          title="Commercial conversations can scale with your venue type"
          description="Instead of forcing a one-size-fits-all structure, Ofside can align the commercial path with the scale and needs of your venue."
        />
        <div className="mt-10">
          <SimpleCardGrid items={commercialItems} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Checklist
            title="What documents are typically needed"
            description="Final requirements may vary by venue type and onboarding review, but this is the core checklist most partners should prepare."
            items={[
              "Business or venue identity details",
              "Owner or primary contact information",
              "Venue address and operational details",
              "Court photos, branding assets, or cover images",
              "Banking or billing information if needed during commercial setup",
            ]}
          />
          <Checklist
            title="Helpful information to keep ready"
            description="A smoother onboarding usually comes from operational clarity, not just paperwork."
            items={[
              "Opening and closing hours",
              "Available sports and court configurations",
              "Slot durations and pricing ranges",
              "Amenities and player-facing facilities",
              "Peak-time rules or pricing differences",
            ]}
          />
        </div>
      </Section>

      <Section className="bg-gray-50">
        <SectionIntro
          eyebrow="FAQs"
          title="Answers for prospective venue partners"
          description="These are the top things most operators want to know before they begin."
          align="center"
        />
        <div className="mt-10">
          <FaqGrid items={faqs} />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Ready to bring your venue onto Ofside?"
          description="Start the onboarding flow and share the operational details that help players understand, trust, and book your venue."
          primaryCta={{ label: "List Your Venue", href: "/onboarding" }}
          secondaryCta={{ label: "Talk to Ofside", href: "/contact-us" }}
        />
      </Section>
    </main>
  );
}
