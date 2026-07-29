import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT, formatInr, priceForCheckout } from "@/lib/eventConfig";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/mobileAppLinks";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import RegistrationForm from "./RegistrationForm";
import SessionsBrand from "./SessionsBrand";

export const metadata: Metadata = {
  title: "SESSIONS Badminton Doubles at Rackonnect Delhi | 22 Aug 2026 | Ofside",
  description:
    "Join SESSIONS by Ofside on 22 August 2026 — community badminton doubles at Rackonnect Badminton Arena, Mehrauli, New Delhi. Guaranteed matches and free Ofside PRO.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "SESSIONS Badminton Doubles · Rackonnect Delhi · 22 Aug 2026",
    description:
      "Community badminton doubles for all skill levels. Meet. Play. Connect. Repeat.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const mapsUrl =
  EVENT.mapsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;
const baseTotal = priceForCheckout(false);

const thingsToKnow = [
  { icon: "clock", label: "Duration", value: "2 Hours" },
  { icon: "lang", label: "Languages", value: "Hindi, English" },
  { icon: "ticket", label: "Ticket needed", value: "For all participants" },
  { icon: "entry", label: "Entry allowed", value: "Ages 15 to 35" },
  { icon: "layout", label: "Layout", value: "Indoor courts" },
  { icon: "seat", label: "Format", value: "Badminton doubles" },
  { icon: "people", label: "Capacity", value: `${EVENT.maxPlayers} players max` },
  { icon: "pet", label: "Pets", value: "Not allowed" },
];

async function getSoldOut(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  try {
    await connectToDB();
    const paid = await EventRegistration.countDocuments({
      eventSlug: EVENT.slug,
      paymentStatus: "paid",
    });
    return paid >= EVENT.maxRegistrations;
  } catch {
    return false;
  }
}

function ThingIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "lang":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...common}>
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
          <path d="M13 5v14" />
        </svg>
      );
    case "entry":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "layout":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "seat":
      return (
        <svg {...common}>
          <path d="M6 19v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
          <path d="M4 19h16M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M10 5.2A4 4 0 0 1 18 7v1" />
          <path d="M6 8v1a6 6 0 0 0 12 0V8" />
          <circle cx="12" cy="17" r="1" />
        </svg>
      );
  }
}

export default async function EventPage() {
  const soldOut = await getSoldOut();

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1c1c1c]">
      <div className="mx-auto max-w-7xl px-3 pb-28 pt-4 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6">
        {/* ===================== HERO ===================== */}
        <section className="relative w-full overflow-hidden rounded-2xl bg-[#0b0b0d] sm:rounded-3xl">
          {/* Mobile: tall asset. Small/medium laptops: 1232×530 (full frame). Very large: original desktop crop. */}
          <div className="relative flex aspect-[702/524] w-full flex-col sm:aspect-[1232/530] 2xl:aspect-auto 2xl:h-[520px]">
            <Image
              src="/assets/event_banner_mobile.PNG"
              alt={EVENT.name}
              fill
              priority
              sizes="(max-width: 639px) 100vw, 1px"
              className="object-cover object-center sm:hidden"
            />
            <Image
              src="/assets/banner_1232_530.png"
              alt=""
              fill
              priority
              sizes="(max-width: 639px) 1px, (max-width: 1535px) 100vw, 1px"
              className="hidden object-cover object-center sm:block 2xl:hidden"
              aria-hidden
            />
            <Image
              src="/assets/event_banner_desktop.PNG"
              alt=""
              fill
              priority
              sizes="(max-width: 1535px) 1px, 100vw"
              className="hidden object-cover object-[center_35%] 2xl:block"
              aria-hidden
            />
            {/* light readability wash — banners already carry left/bottom darkness */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,12,14,0.55)_0%,rgba(8,12,14,0.18)_42%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,12,14,0.22)_0%,transparent_50%)]" />

            {/* top: brand — offers/store stay desktop-only so mobile hero stays clean */}
            <div className="relative z-10 flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-7">
              <SessionsBrand />
              <div className="hidden w-full flex-col gap-2 sm:flex sm:w-auto sm:max-w-none sm:items-end sm:gap-2.5">
                <span className="inline-flex max-w-full items-center self-end rounded-full bg-[#FFF201] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] text-[#1c1c1c]">
                  Free Ofside PRO Worth ₹399/yr
                </span>
                <div className="flex w-auto items-stretch gap-2">
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-none items-center gap-2.5 rounded-xl border border-white/25 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:bg-[#FFF201]"
                    aria-label="Get Ofside on Google Play"
                  >
                    <Image
                      src="/assets/playstore.webp"
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-md"
                    />
                    <span className="text-left leading-none">
                      <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-[#666]">
                        Get it on
                      </span>
                      <span className="mt-1 block text-[13px] font-bold text-[#1c1c1c]">Google Play</span>
                    </span>
                  </a>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-none items-center gap-2.5 rounded-xl border border-white/25 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:bg-[#FFF201]"
                    aria-label="Download Ofside on the App Store"
                  >
                    <Image
                      src="/assets/appstore.webp"
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-md"
                    />
                    <span className="text-left leading-none">
                      <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-[#666]">
                        Download on
                      </span>
                      <span className="mt-1 block text-[13px] font-bold text-[#1c1c1c]">App Store</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* spacer so bottom content sits low */}
            <div className="relative z-10 flex-1" />

            {/* bottom content */}
            <div className="relative z-10 flex flex-col gap-2 p-3 pt-0 sm:gap-6 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:p-9">
              <div className="min-w-0 max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFF201] sm:text-[11px]">
                  {EVENT.edition}
                </p>
                <h1 className="mt-1 text-[1.45rem] font-bold leading-[1.12] tracking-tight text-white sm:mt-2 sm:text-[2.75rem] sm:leading-[1.08] lg:text-[3.15rem]">
                  Badminton doubles
                  <span className="block text-white/80">community games</span>
                </h1>

                <p className="mt-2 text-[12px] font-medium leading-snug text-white/80 sm:mt-4 sm:text-[14px] sm:leading-relaxed sm:text-white/75">
                  <span className="block sm:inline">{EVENT.date} · {EVENT.timeWindow}</span>
                  <span className="mt-0.5 block text-white/65 sm:mt-0 sm:inline sm:text-white/75">
                    <span className="mx-1.5 hidden text-white/30 sm:inline">·</span>
                    {EVENT.venueName}
                  </span>
                </p>
              </div>

              {/* desktop price + CTA */}
              <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-3">
                <div className="text-right text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">Per player</p>
                  <p className="mt-0.5 text-4xl font-bold leading-none tracking-tight">
                    ₹{EVENT.displayPriceInr}
                  </p>
                </div>
                {soldOut ? (
                  <span className="rounded-xl bg-white/15 px-6 py-3 text-sm font-bold text-white/70">
                    Sold out
                  </span>
                ) : (
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFF201] px-7 py-3.5 text-sm font-bold text-[#1c1c1c] transition hover:brightness-95"
                  >
                    Register Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-only: PRO + app stores sit under the hero (not on top of it) */}
        <div className="mt-3 flex flex-col gap-2.5 sm:hidden">
          <p className="rounded-xl bg-[#FFF201] px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.06em] text-[#1c1c1c]">
            Free Ofside PRO Worth ₹399/yr
          </p>
          <div className="flex gap-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-3 py-2.5"
              aria-label="Get Ofside on Google Play"
            >
              <Image
                src="/assets/playstore.webp"
                alt=""
                width={22}
                height={22}
                className="h-5 w-5 rounded-md"
              />
              <span className="text-[12px] font-bold text-[#1c1c1c]">Google Play</span>
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-3 py-2.5"
              aria-label="Download Ofside on the App Store"
            >
              <Image
                src="/assets/appstore.webp"
                alt=""
                width={22}
                height={22}
                className="h-5 w-5 rounded-md"
              />
              <span className="text-[12px] font-bold text-[#1c1c1c]">App Store</span>
            </a>
          </div>
        </div>

        {/* ===================== TWO-COLUMN BODY ===================== */}
        <div className="mt-6 grid gap-6 sm:mt-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_520px] xl:gap-10">
          {/* -------- LEFT: About + Things to know -------- */}
          <div className="min-w-0 space-y-8 sm:space-y-10">
            {/* About */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">About</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#4d4d4d]">
                <p>{EVENT.shortDescription}</p>
                <p>
                  Bring a partner to {EVENT.venueName} for at least{" "}
                  <span className="font-semibold text-[#1c1c1c]">2 doubles games</span>, plus
                  photos, giveaways, and{" "}
                  <span className="font-semibold text-[#1c1c1c]">FREE Ofside PRO</span>{" "}
                  (worth ₹399/year). Limited to {EVENT.maxRegistrations} doubles (
                  {EVENT.maxPlayers} players).
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#888]">
                  Highlights
                </h3>
                <ul className="mt-3 space-y-3 sm:space-y-4">
                  {EVENT.highlights.map((h) => (
                    <li key={h.title}>
                      <p className="text-[14px] font-semibold text-[#1c1c1c] sm:text-[15px]">{h.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#666] sm:text-[14px]">{h.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Things to know */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">Things to know</h2>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
                {thingsToKnow.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-[#ebebeb] bg-white px-2.5 py-2.5 sm:px-3.5 sm:py-3"
                  >
                    <div className="flex items-start gap-2 sm:items-center sm:gap-2.5">
                      <span className="mt-0.5 shrink-0 text-[#888] sm:mt-0 [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5">
                        <ThingIcon name={t.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] leading-tight text-[#888] sm:text-[13px]">{t.label}</p>
                        <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[#1c1c1c] sm:text-[14px] sm:font-medium">
                          {t.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">
                  Schedule &amp; timeline
                </h2>
                <p className="text-sm text-[#888]">
                  {EVENT.date} · {EVENT.timeWindow}
                </p>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white">
                <div className="border-b border-[#e8e8e8] bg-[#fafafa] px-4 py-2.5 text-[13px] text-[#666] sm:px-5">
                  {EVENT.reportingNote}
                </div>
                <ul>
                  {EVENT.schedule.map((step, i) => {
                    const isChallenge = step.label.startsWith("Community Challenge");
                    return (
                      <li
                        key={`${step.time}-${step.label}`}
                        className={`grid grid-cols-[4.75rem_1fr] items-baseline gap-3 px-4 py-3 sm:grid-cols-[5.5rem_1fr] sm:gap-5 sm:px-5 ${
                          i > 0 ? "border-t border-[#f0f0f0]" : ""
                        } ${isChallenge ? "bg-[#FFFBEA]" : ""}`}
                      >
                        <p className="text-[13px] font-bold tabular-nums text-[#1c1c1c] sm:text-sm">
                          {step.time}
                        </p>
                        <div className="min-w-0">
                          {isChallenge ? (
                            <p className="text-[14px] font-semibold leading-snug text-[#1c1c1c]">
                              <span className="mr-2 inline-block rounded bg-[#FFF201] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1c1c1c]">
                                Challenge
                              </span>
                              {step.label.replace(/^Community Challenge \d+\s*[–-]\s*/, "")}
                            </p>
                          ) : (
                            <p className="text-[14px] leading-snug text-[#4d4d4d]">{step.label}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">
                Frequently asked
              </h2>
              <div className="mt-4 divide-y divide-[#e8e8e8] border-y border-[#e8e8e8]">
                {EVENT.faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-[#1c1c1c]">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eee] text-base leading-none text-[#666] transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-[#666]">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Terms */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">
                Terms and Conditions
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#666]">
                By registering you agree to our{" "}
                <Link
                  href="/events/sessions/terms"
                  className="font-medium text-[#1c1c1c] underline underline-offset-2 hover:text-black"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/events/sessions/terms#refund"
                  className="font-medium text-[#1c1c1c] underline underline-offset-2 hover:text-black"
                >
                  Refund Policy
                </Link>
                . Entries are non-refundable except as stated in the policy.{" "}
                {EVENT.organiserNote}
              </p>
            </section>

            {/* Organized by */}
            <section className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#888]">
                Organized by
              </p>
              <div className="mt-3 flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF201] p-2">
                  <Image
                    src="/assets/ofside-logo.png"
                    alt="Ofside"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold leading-tight text-[#1c1c1c]">
                    Ofside{" "}
                    <span className="font-normal text-[#666]">
                      · India&apos;s ultimate sports ecosystem
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#999]">
                    Sports community
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* -------- RIGHT: Sticky registration form (desktop) -------- */}
          <aside className="hidden self-start lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
            <div className="space-y-3">
              <div className="rounded-xl border border-[#e8e8e8] bg-white px-3 py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[16px_1fr] items-start gap-x-2 text-[13px] font-semibold text-[#1c1c1c] hover:underline"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 text-[#888]">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="min-w-0 leading-snug">{EVENT.venueName}</span>
                </a>
                <p className="mt-1.5 grid grid-cols-[16px_1fr] items-start gap-x-2 text-[11px] text-[#888]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span className="min-w-0 leading-snug">
                    Report by 6:40 PM ·{" "}
                    <a href="#schedule" className="font-semibold text-[#1c1c1c] underline underline-offset-2">
                      Schedule
                    </a>
                  </span>
                </p>
              </div>

              <div id="register">
                <RegistrationForm soldOut={soldOut} />
              </div>

              {!soldOut ? (
                <p className="px-1 text-center text-xs text-[#888]">
                  {EVENT.maxRegistrations} doubles spots · female doubles get 10% off
                </p>
              ) : null}
            </div>
          </aside>
        </div>

        {/* ===================== REGISTRATION (mobile) ===================== */}
        <section className="mt-8 border-t border-[#e8e8e8] pt-6 lg:hidden">
          <div id="register-mobile" className="scroll-mt-3">
            <h2 className="text-center text-xl font-bold tracking-tight text-[#1c1c1c] sm:text-2xl">
              {soldOut ? "This session is full" : "Book your spot"}
            </h2>
            <p className="mx-auto mt-1.5 max-w-md px-1 text-center text-[14px] text-[#666] sm:text-[15px]">
              {soldOut
                ? "All doubles spots are taken. Follow Ofside for the next session."
                : "One checkout = you + your partner. Email OTP to verify, then pay."}
            </p>
            <div className="mx-auto mt-4 max-w-xl">
              <RegistrationForm soldOut={soldOut} />
            </div>
          </div>
        </section>
      </div>

      {/* ===================== MOBILE STICKY CTA ===================== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e8e8] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-[#1c1c1c]">₹{EVENT.displayPriceInr}</span>
              <span className="pb-0.5 text-xs text-[#888]">onwards</span>
            </div>
            <p className="text-[11px] text-[#888]">Doubles · ₹{formatInr(baseTotal)}</p>
          </div>
          {soldOut ? (
            <span className="rounded-xl bg-[#f0f0f0] px-6 py-3 text-sm font-bold text-[#888]">
              Sold out
            </span>
          ) : (
            <a
              href="#register-mobile"
              className="rounded-xl bg-[#FFF201] px-6 py-3 text-sm font-bold text-[#1c1c1c]"
            >
              Book Tickets
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
