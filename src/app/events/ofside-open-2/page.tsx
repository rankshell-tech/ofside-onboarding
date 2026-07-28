import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT, formatInr, priceForCheckout } from "@/lib/eventConfig";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: `${EVENT.seriesName} — ${EVENT.name}`,
  description: `${EVENT.tagline} ${EVENT.shortDescription}`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${EVENT.seriesName} — ${EVENT.name}`,
    description: `${EVENT.tagline} ${EVENT.shortDescription}`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;
const baseTotal = priceForCheckout(false);

const thingsToKnow = [
  { icon: "clock", label: "Duration", value: "2 Hours" },
  { icon: "lang", label: "Languages", value: "Hindi, English" },
  { icon: "ticket", label: "Ticket needed", value: "For all participants" },
  { icon: "entry", label: "Entry allowed", value: "Ages 15 and above" },
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
          <div className="relative min-h-[430px] w-full sm:min-h-[470px] lg:min-h-[560px]">
            <Image
              src="/assets/pexels-aboodi-12630113.jpg"
              alt={EVENT.name}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-[center_62%]"
            />
            {/* readability gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,13,0.94)_0%,rgba(11,11,13,0.38)_46%,rgba(11,11,13,0.05)_78%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,11,13,0.55)_0%,transparent_55%)]" />

            {/* top badge */}
            <div className="absolute inset-x-4 top-4 flex justify-end sm:inset-x-6 sm:top-6">
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FFF201] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.06em] text-[#1c1c1c] shadow-lg shadow-black/25 sm:text-[11px]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                Free Ofside PRO
              </span>
            </div>

            {/* bottom content */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-9">
              <div className="min-w-0">
                <Image
                  src={EVENT.logoSrc}
                  alt={EVENT.seriesName}
                  width={200}
                  height={44}
                  className="h-7 w-auto object-contain drop-shadow sm:h-9"
                />
                <h1 className="mt-3 max-w-3xl text-[2rem] font-bold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-[3.25rem]">
                  {EVENT.name}
                </h1>
                <p className="mt-3.5 text-[14px] font-medium text-white/75 sm:text-[15px]">
                  {EVENT.date}
                  {EVENT.timeWindow ? `, ${EVENT.timeWindow}` : null}
                  {!EVENT.detailsFinal ? " · TBA" : null}
                  <span className="mx-2 text-white/30">·</span>
                  {EVENT.venueName}, {EVENT.city}
                </p>
              </div>

              {/* desktop price + CTA */}
              <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-3">
                <div className="text-right text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">From</p>
                  <p className="text-3xl font-bold leading-none">
                    ₹{EVENT.displayPriceInr}
                    <span className="ml-1 text-sm font-medium text-white/60">/ player</span>
                  </p>
                </div>
                {soldOut ? (
                  <span className="rounded-xl bg-white/15 px-6 py-3 text-sm font-bold text-white/70 ring-1 ring-inset ring-white/25">
                    Sold out
                  </span>
                ) : (
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFF201] px-6 py-3 text-sm font-bold text-[#1c1c1c] shadow-lg shadow-black/25 transition hover:brightness-95"
                  >
                    Book tickets
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== TWO-COLUMN BODY ===================== */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_520px] xl:gap-10">
          {/* -------- LEFT: About + Things to know -------- */}
          <div className="min-w-0 space-y-10">
            {/* About */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">About</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#4d4d4d]">
                <p className="font-semibold text-[#1c1c1c]">{EVENT.tagline}</p>
                <p>{EVENT.shortDescription}</p>
                <p>
                  Grab a partner, pull up to {EVENT.venueName}, and get at least{" "}
                  <span className="font-semibold text-[#1c1c1c]">2 doubles games</span> —
                  nobody sits on the bench. Photos, giveaways &amp;{" "}
                  <span className="font-semibold text-[#1c1c1c]">FREE Ofside PRO</span> come
                  with every entry. Only {EVENT.maxRegistrations} pairs (
                  {EVENT.maxPlayers} players).
                </p>
                {!EVENT.detailsFinal ? (
                  <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 ring-1 ring-inset ring-amber-200/80">
                    Exact date &amp; pin still TBA — confirmed details go out on email.
                  </p>
                ) : null}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#888]">
                  What&apos;s included
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {EVENT.whatsIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-[#4d4d4d]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF201] text-[11px] font-bold text-[#1c1c1c]">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#888]">
                  Highlights
                </h3>
                <ul className="mt-3 space-y-4">
                  {EVENT.highlights.map((h) => (
                    <li key={h.title}>
                      <p className="font-semibold text-[#1c1c1c]">{h.title}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-[#666]">{h.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Things to know */}
            <section>
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">Things to know</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {thingsToKnow.map((t) => (
                  <div key={t.label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#888]">
                      <ThingIcon name={t.icon} />
                    </span>
                    <div>
                      <p className="text-[13px] text-[#888]">{t.label}</p>
                      <p className="text-[14px] font-medium text-[#1c1c1c]">{t.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-[#1c1c1c]">
                Schedule &amp; timeline
              </h2>
              <ol className="mt-5 space-y-0 border-l border-[#e5e5e5] pl-5">
                {EVENT.schedule.map((step) => (
                  <li key={step.label} className="relative pb-5 last:pb-0">
                    <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#1c1c1c] bg-white" />
                    <p className="text-sm font-semibold text-[#1c1c1c]">{step.time}</p>
                    <p className="text-[14px] text-[#666]">{step.label}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-[#888]">{EVENT.reportingNote}</p>
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
                <Link href="/terms-and-conditions" className="font-medium text-[#1c1c1c] underline underline-offset-2 hover:text-black">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/refund" className="font-medium text-[#1c1c1c] underline underline-offset-2 hover:text-black">
                  Refund Policy
                </Link>
                . Entries are transferable but non-refundable. {EVENT.organiserNote}
              </p>
            </section>

            {/* Organized by */}
            <section className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#888]">
                Organized by
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Image
                  src="/assets/ofside-logo.png"
                  alt="Ofside"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-contain ring-1 ring-[#eee]"
                />
                <div>
                  <p className="font-semibold text-[#1c1c1c]">Ofside</p>
                  <p className="text-sm text-[#888]">Sports community · Delhi NCR</p>
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
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#1c1c1c] hover:underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[#888]">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {EVENT.venueName}, {EVENT.city}
                </a>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#888]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Report 20 mins early ·{" "}
                  <a href="#schedule" className="font-semibold text-[#1c1c1c] underline underline-offset-2">
                    Schedule
                  </a>
                </p>
              </div>

              <div id="register">
                <RegistrationForm soldOut={soldOut} />
              </div>

              {!soldOut ? (
                <p className="px-1 text-center text-xs text-[#888]">
                  {EVENT.maxRegistrations} doubles spots · women&apos;s pairs get 10% off
                </p>
              ) : null}
            </div>
          </aside>
        </div>

        {/* ===================== REGISTRATION (mobile) ===================== */}
        <section id="register-mobile" className="mt-14 scroll-mt-24 border-t border-[#e8e8e8] pt-12 lg:hidden">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#1c1c1c]">
            {soldOut ? "This session is full" : "Book your spot"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-[15px] text-[#666]">
            {soldOut
              ? "All doubles spots are taken. Follow Ofside for the next session."
              : "One checkout = you + your partner. Email OTP to verify, then pay."}
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <RegistrationForm soldOut={soldOut} />
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
            <p className="text-[11px] text-[#888]">Pair · ₹{formatInr(baseTotal)} incl. tax</p>
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
