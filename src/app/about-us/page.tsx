import Image from "next/image";
import { CtaBand, PageHero, Section, SectionIntro, SimpleCardGrid } from "../components/marketing";

const teamMembers = [
  {
    name: "Hardik Jain",
    role: "Co-Founder",
    image: "/assets/Hardik_jain.jpeg",
    bio: "With 5+ years of experience in client servicing, public relations, marketing, and strategic partnerships, Hardik brings a strong understanding of brand building and customer engagement. Having worked with leading brands like Decathlon, Domino's, Pizza Hut, and Tata, he focuses on partnerships, community growth, and creating meaningful experiences that connect athletes, venues, and sports enthusiasts across India.",
  },
  {
    name: "Aakansha Gangwal",
    role: "Chief Technology Officer (CTO)",
    image: "/assets/Aakansha_gangwal.PNG",
    bio: "With 7.4+ years of experience in Full-Stack Development, Aakansha leads the technology vision at Ofside. Having worked with global organizations like Ericsson, IHG Hotels & Resorts, and Rapiscan Systems, she specializes in building secure, scalable, and high-performance digital products. At Ofside, she is driving the technology that powers India's next-generation sports ecosystem.",
  },
];

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

      <Section>
        <SectionIntro
          eyebrow="Our Team"
          title="The people building India's sports ecosystem"
          description="Ofside is shaped by operators and engineers who care about how local sport actually works — on the ground, in communities, and at scale."
          align="center"
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="relative aspect-[4/5] w-full bg-gray-50 sm:aspect-[5/4]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-contain object-center p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
                  {member.role}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-950">{member.name}</h3>
                <p className="mt-4 text-base leading-7 text-gray-600">{member.bio}</p>
              </div>
            </article>
          ))}
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
