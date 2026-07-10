import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Compass,
  HeartHandshake,
  Megaphone,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Zap,
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

import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/mobileAppLinks";

export const APP_LINKS = {
  playStore: PLAY_STORE_URL,
  appStore: APP_STORE_URL,
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
        <p className="mb-4 inline-flex rounded-full border border-yellow-300/80 bg-gradient-to-r from-yellow-100 to-amber-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-gray-800 shadow-[0_8px_24px_rgba(250,204,21,0.18)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">{description}</p>
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
  title: React.ReactNode;
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
        <div className="relative z-10 min-w-0 lg:pr-2">
          <p className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-800">
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-gray-950 sm:text-5xl sm:leading-[1.1] lg:max-w-xl lg:text-6xl lg:leading-[1.08] xl:max-w-2xl">
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
        <div className="relative z-0 min-w-0">{aside}</div>
      </div>
    </section>
  );
}

export function FeatureSpotlight({
  eyebrow,
  title,
  titleAccent,
  description,
  bullets,
  visual,
  reverse = false,
  learnMoreHref,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  bullets?: string[];
  visual: React.ReactNode;
  reverse?: boolean;
  learnMoreHref?: string;
  dark?: boolean;
}) {
  return (
    <div
      data-reveal="feature-card"
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <p
          className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
            dark
              ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
              : "border-yellow-300 bg-yellow-100 text-gray-800"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] ${
            dark ? "text-white" : "text-gray-950"
          }`}
        >
          {title}
          {titleAccent ? (
            <>
              <br />
              <span
                className={
                  dark
                    ? "bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-gray-950 via-gray-800 to-yellow-600 bg-clip-text text-transparent"
                }
              >
                {titleAccent}
              </span>
            </>
          ) : null}
        </h2>
        <p className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${dark ? "text-gray-300" : "text-gray-600"}`}>
          {description}
        </p>
        {bullets && bullets.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {bullets.map((item) => (
              <li
                key={item}
                className={`flex items-start gap-3 text-sm leading-6 ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {learnMoreHref ? (
          <Link
            href={learnMoreHref}
            className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold transition ${
              dark ? "text-yellow-300 hover:text-yellow-200" : "text-gray-950 hover:text-yellow-700"
            }`}
          >
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <div className="relative">
        {!dark ? (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_35%_30%,rgba(255,242,1,0.28),transparent_62%)] blur-xl"
          />
        ) : null}
        {visual}
      </div>
    </div>
  );
}

export function StatsStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-yellow-100 bg-white/80 p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur"
        >
          <p className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">{item.value}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function MockScoreboard() {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-gray-950 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Live
        </span>
        <span className="text-xs text-gray-400">Football · 2nd Half</span>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">Team Alpha</p>
          <p className="mt-1 text-5xl font-bold text-white">3</p>
        </div>
        <div className="text-2xl font-light text-gray-600">:</div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">Team Beta</p>
          <p className="mt-1 text-5xl font-bold text-[#FFF201]">2</p>
        </div>
      </div>
      <div className="mt-6 space-y-2 rounded-2xl bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-yellow-300">Commentary</p>
        <p className="text-sm leading-relaxed text-gray-300">
          GOAL! A brilliant finish from the edge of the box — Team Alpha take the lead!
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Share2 className="h-3.5 w-3.5" />
        Share live score link
      </div>
    </div>
  );
}

export function MockMatchSetup() {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.1)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600">Create Match</p>
      <h3 className="mt-2 text-xl font-semibold text-gray-950">Weekend Futsal</h3>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {["Football", "Badminton", "Cricket", "Pickleball"].map((sport) => (
          <div
            key={sport}
            className={`rounded-xl px-3 py-2.5 text-center text-sm font-medium ${
              sport === "Football"
                ? "bg-[#FFF201] text-gray-950"
                : "border border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {sport}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500">Teams</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-bold text-gray-600"
              >
                {i}
              </div>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-950">8 players ready</span>
        </div>
      </div>
      <button
        type="button"
        className="mt-5 w-full rounded-2xl bg-gray-950 py-3 text-sm font-semibold text-white"
      >
        Start Match
      </button>
    </div>
  );
}

export function MockLeaderboard() {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.1)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600">Leaderboard</p>
        <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          Delhi NCR
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {[
          { rank: 1, name: "Arjun S.", stat: "12 wins", highlight: true },
          { rank: 2, name: "Priya M.", stat: "10 wins", highlight: false },
          { rank: 3, name: "Rahul K.", stat: "9 wins", highlight: false },
          { rank: 4, name: "You", stat: "7 wins", highlight: false },
        ].map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
              player.highlight ? "bg-[#FFF201]/20 ring-1 ring-[#FFF201]/40" : "bg-gray-50"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white">
              {player.rank}
            </span>
            <span className="flex-1 text-sm font-semibold text-gray-950">{player.name}</span>
            <span className="text-sm text-gray-500">{player.stat}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        {["Past", "Live", "Upcoming"].map((tab, i) => (
          <span
            key={tab}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              i === 1 ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
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
          className="group rounded-3xl border border-gray-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fffef8_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-200 hover:shadow-[0_26px_70px_rgba(15,23,42,0.1)]"
        >
          <div className="inline-flex rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 p-3 text-gray-950 ring-1 ring-yellow-200/80 transition group-hover:scale-105">
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
          className="rounded-3xl border border-gray-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fffef8_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-yellow-200"
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
    <div className="flex flex-wrap justify-center gap-3">
      {sports.map((sport) => (
        <div
          key={sport}
          className="rounded-full border border-yellow-300/80 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 text-sm font-medium text-gray-900 shadow-[0_8px_20px_rgba(250,204,21,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(250,204,21,0.2)]"
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
          className="rounded-3xl border border-gray-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fefce8_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.1)]"
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
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      {items.map((item) => (
        <details
          key={item.question}
          className="group w-full rounded-3xl border border-gray-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition duration-300 hover:border-yellow-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
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
    <div className="relative overflow-hidden rounded-[2rem] border border-gray-950 bg-gray-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl"
      />
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
    title: "Create matches instantly",
    description:
      "Set up a game in seconds across 40+ sports — pick your sport, add teams, and get on the field without the WhatsApp chaos.",
    icon: Swords,
  },
  {
    title: "Score live with commentary",
    description:
      "Real-time scoreboards with sport-specific logic and AI-assisted commentary. Share live score links so friends can follow along.",
    icon: Radio,
  },
  {
    title: "Track stats & compete",
    description:
      "Individual and team performance, city leaderboards, and insights that turn casual games into a lightweight competitive identity.",
    icon: Trophy,
  },
] satisfies IconCard[];

export const howItWorksItems = [
  {
    title: "Pick your sport",
    description:
      "Choose from 40+ sports — football, badminton, cricket, pickleball, volleyball, and many more — with built-in rulebooks for each.",
    icon: Compass,
  },
  {
    title: "Create a match & add teams",
    description:
      "Instantly set up sides, assign players, and organize your crew. No more scattered group chats to figure out who's playing.",
    icon: Users,
  },
  {
    title: "Score live & share",
    description:
      "Track every point, goal, and run in real time. Share a live score link so anyone can follow the action as it happens.",
    icon: Zap,
  },
] satisfies IconCard[];

export const userBenefitItems = [
  {
    title: "Match creation",
    description: "Create matches instantly across multiple sports with team setup and player assignment built in.",
    icon: Swords,
  },
  {
    title: "Live scoring",
    description: "Real-time scoreboards with sport-specific rules, live commentary, and shareable score links.",
    icon: Radio,
  },
  {
    title: "Stats & leaderboards",
    description: "Track individual and team performance. Compare standings in your city with Past, Live, and Upcoming tabs.",
    icon: Trophy,
  },
  {
    title: "Community & referrals",
    description: "Follow players, host games, and grow your local sports circle through invite-and-earn links.",
    icon: Megaphone,
  },
] satisfies IconCard[];

export const coreFeatureItems = [
  {
    title: "40+ sport rulebooks",
    description: "Settle disputes and onboard newcomers with in-app rulebooks covering every sport Ofside supports.",
    icon: BookOpen,
  },
  {
    title: "Team management",
    description: "Build teams, assign players to sides, and manage rosters for repeat games and tournaments.",
    icon: Users,
  },
  {
    title: "Live score sharing",
    description: "Turn casual games into watchable moments — share live score links with friends and followers mid-match.",
    icon: Share2,
  },
  {
    title: "Performance analytics",
    description: "Individual stats, team insights, and leaderboard rankings that encourage repeat play and friendly rivalry.",
    icon: CalendarRange,
  },
] satisfies IconCard[];

export const whyOfsideItems = [
  {
    title: "One app, the full journey",
    description:
      "Ofside connects match creation, live scoring, stats, leaderboards, and community — not just one slice of the sports experience.",
  },
  {
    title: "Built for how India plays",
    description:
      "Multi-sport by design, with rulebooks, pickup-game workflows, and local leaderboard energy tuned for Indian cities.",
  },
  {
    title: "From intent to final whistle",
    description:
      "The product is built around real player behavior: organize a game, score it live, track performance, and come back for more.",
  },
] satisfies SimpleCard[];

export const trustSignals = [
  {
    title: "Multi-sport from day one",
    description: "Football, cricket, badminton, pickleball, volleyball, futsal, and 30+ more — one platform for every game you play.",
    icon: BadgeCheck,
  },
  {
    title: "Real-time scoring engine",
    description: "WebSocket-powered live updates with sport-specific logic and async AI commentary that never blocks the scoreboard.",
    icon: Sparkles,
  },
  {
    title: "Human support when you need it",
    description: "Reach the Ofside team via email for player support and product questions.",
    icon: HeartHandshake,
  },
] satisfies IconCard[];

export const platformStats = [
  { value: "40+", label: "Sports Supported" },
  { value: "Live", label: "Real-Time Scoring" },
  { value: "1 App", label: "Full Sports Journey" },
];
