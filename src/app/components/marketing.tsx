import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  FileCheck2,
  HeartHandshake,
  MapPinned,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type SimpleCard = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export const APP_LINKS = {
  playStore: "mailto:play@ofside.in?subject=Share%20Ofside%20Play%20Store%20link",
  appStore: "mailto:play@ofside.in?subject=Share%20Ofside%20App%20Store%20link",
} as const;

export function AppDownloadButtons({
  className = "",
  centered = false,
}: {
  className?: string;
  centered?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${centered ? "sm:justify-center" : ""} ${className}`}>
      <a
        href={APP_LINKS.playStore}
        className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-yellow-300 hover:bg-yellow-50"
      >
        <div className="shrink-0 rounded-lg bg-white">
          <Image
            src="/assets/playstore.webp"
            alt="Get it on Google Play"
            width={225}
            height={225}
            className="h-12 w-auto rounded-lg"
          />
        </div>
        <div className="text-left">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Download On</p>
          <p className="text-sm font-semibold text-gray-950">Google Play</p>
        </div>
      </a>
      <a
        href={APP_LINKS.appStore}
        className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-yellow-300 hover:bg-yellow-50"
      >
        <div className="shrink-0 rounded-lg bg-white">
          <Image
            src="/assets/appstore.webp"
            alt="Download on the App Store"
            width={225}
            height={225}
            className="h-12 w-auto rounded-lg"
          />
        </div>
        <div className="text-left">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Download On</p>
          <p className="text-sm font-semibold text-gray-950">App Store</p>
        </div>
      </a>
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionIntroProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div className={alignment}>
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-800">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">{description}</p>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  aside,
  showAppButtons = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  aside: React.ReactNode;
  showAppButtons?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,226,0,0.45),_transparent_38%),linear-gradient(180deg,_#fffdf2_0%,_#ffffff_65%,_#f8fafc_100%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-800">
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-yellow-300 hover:bg-yellow-50"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
          {showAppButtons ? (
            <div className="mt-5">
              <AppDownloadButtons />
            </div>
          ) : null}
        </div>
        <div>{aside}</div>
      </div>
    </section>
  );
}

export function StatStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <p className="text-3xl font-semibold text-gray-950">{item.value}</p>
          <p className="mt-2 text-sm text-gray-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function IconCardGrid({ items, columns = 3 }: { items: IconCard[]; columns?: 2 | 3 | 4 }) {
  const gridClass =
    columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div className={`grid gap-5 md:grid-cols-2 ${gridClass}`}>
      {items.map(({ title, description, icon: Icon }) => (
        <div
          key={title}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
        >
          <div className="inline-flex rounded-2xl bg-yellow-100 p-3 text-gray-950">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-gray-950">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
        </div>
      ))}
    </div>
  );
}

export function SimpleCardGrid({ items, columns = 3 }: { items: SimpleCard[]; columns?: 2 | 3 }) {
  const gridClass = columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div className={`grid gap-5 md:grid-cols-2 ${gridClass}`}>
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
        >
          <h3 className="text-xl font-semibold text-gray-950">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export function Checklist({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <h3 className="text-2xl font-semibold text-gray-950">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p> : null}
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
            <p className="text-sm leading-6 text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SportPills({ sports }: { sports: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {sports.map((sport) => (
        <div
          key={sport}
          className="rounded-full border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-gray-900"
        >
          {sport}
        </div>
      ))}
    </div>
  );
}

export function TestimonialGrid({
  items,
}: {
  items: { quote: string; name: string; role: string }[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.name}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
        >
          <Sparkles className="h-5 w-5 text-yellow-600" />
          <p className="mt-4 text-base leading-7 text-gray-700">“{item.quote}”</p>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="font-semibold text-gray-950">{item.name}</p>
            <p className="text-sm text-gray-500">{item.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FaqGrid({ items }: { items: FaqItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-gray-950">
            <span>{item.question}</span>
            <ChevronRight className="h-5 w-5 shrink-0 transition group-open:rotate-90" />
          </summary>
          <p className="mt-4 text-sm leading-7 text-gray-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  description,
  primaryCta,
  secondaryCta,
  showAppButtons = false,
}: {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showAppButtons?: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-gray-950 bg-gray-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:p-10">
      <p className="text-sm uppercase tracking-[0.24em] text-yellow-300">Ready to move</p>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-3xl font-semibold">{title}</h3>
          <p className="mt-3 text-base leading-7 text-gray-300">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center justify-center rounded-2xl bg-yellow-300 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-yellow-200"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
      {showAppButtons ? (
        <div className="mt-6">
          <AppDownloadButtons />
        </div>
      ) : null}
    </div>
  );
}

export const siteFacts = [
  {
    title: "Book venues faster",
    description:
      "Venue discovery, schedules, and booking journeys are built to reduce friction for players who just want to get on court.",
    icon: Clock3,
  },
  {
    title: "Track performance",
    description:
      "The app experience brings match creation, score tracking, leaderboards, and team performance into one ecosystem.",
    icon: Trophy,
  },
  {
    title: "Grow communities",
    description:
      "From local players to venue partners, Ofside is designed to help sports communities stay active, visible, and connected.",
    icon: Users,
  },
] satisfies IconCard[];

export const howItWorksItems = [
  {
    title: "Pick your sport and area",
    description:
      "Start with the sport you play and discover relevant venues, matches, and activity happening around you.",
    icon: Compass,
  },
  {
    title: "Explore, compare, and book",
    description:
      "Browse nearby venues, check what fits your game, and move from discovery to booking in a simple flow.",
    icon: MapPinned,
  },
  {
    title: "Play, track, and come back",
    description:
      "Use Ofside beyond bookings with score tracking, leaderboards, team insights, and repeat play behavior.",
    icon: CalendarRange,
  },
] satisfies IconCard[];

export const userBenefitItems = [
  {
    title: "Nearby sports discovery",
    description: "Find playable options around you instead of chasing scattered leads across apps and chats.",
    icon: MapPinned,
  },
  {
    title: "Venue exploration",
    description: "Understand what a venue offers before you commit, from sport type to fit for your crew.",
    icon: Building2,
  },
  {
    title: "Performance and competition",
    description: "Create matches, track scores, and measure performance with a more connected sports journey.",
    icon: Trophy,
  },
  {
    title: "Ecosystem updates",
    description: "Stay closer to what is happening in your local sports scene instead of operating in isolation.",
    icon: Megaphone,
  },
] satisfies IconCard[];

export const partnerBenefitItems = [
  {
    title: "Reach serious local players",
    description: "Show up where your next regulars are already looking for sports and venue options.",
    icon: Users,
  },
  {
    title: "Support smoother onboarding",
    description: "Ofside already has an onboarding flow for venue details, documents, courts, pricing, and amenities.",
    icon: FileCheck2,
  },
  {
    title: "Improve visibility",
    description: "Bring your venue into a sports-focused discovery environment built around active demand.",
    icon: Compass,
  },
  {
    title: "Build trust with players",
    description: "Structured venue information helps players understand your offering faster and book with more confidence.",
    icon: ShieldCheck,
  },
] satisfies IconCard[];

export const whyOfsideItems = [
  {
    title: "One ecosystem, not isolated tools",
    description:
      "Ofside combines venue discovery, match management, scoring, performance, and community energy in one direction.",
  },
  {
    title: "Built around sports behavior",
    description:
      "The product language from the app points to real player workflows: nearby venues, team setup, rulebooks, stats, and live usage.",
  },
  {
    title: "Useful for both sides of the game",
    description:
      "Players get convenience and continuity; venue partners get visibility, onboarding support, and a clearer digital presence.",
  },
] satisfies SimpleCard[];

export const trustSignals = [
  {
    title: "Venue onboarding flow already live",
    description: "The website already supports a detailed venue onboarding journey with structured operational inputs.",
    icon: BadgeCheck,
  },
  {
    title: "Multi-sport product direction",
    description: "The app references booking, scoring, rulebooks, leaderboards, and support across many sports categories.",
    icon: Sparkles,
  },
  {
    title: "Human support touchpoints",
    description: "Ofside already exposes player support, venue onboarding contact, phone, and social channels to help users trust the brand.",
    icon: HeartHandshake,
  },
] satisfies IconCard[];
