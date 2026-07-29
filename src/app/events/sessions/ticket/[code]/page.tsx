import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongo";
import EventRegistration from "@/models/EventRegistration";
import { EVENT, formatInr } from "@/lib/eventConfig";
import { ticketAbsoluteUrl, ticketQrImageUrl } from "@/lib/ticket";

type Props = { params: Promise<{ code: string }> };

type TicketDoc = {
  ticketCode?: string | null;
  leadName?: string;
  partnerName?: string;
  amountInr?: number;
  checkedInAt?: Date | string | null;
};

async function loadTicket(code: string): Promise<TicketDoc | null> {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(normalized)) return null;
  if (!process.env.MONGODB_URI) return null;
  try {
    await connectToDB();
    const doc = (await EventRegistration.findOne({
      ticketCode: normalized,
      paymentStatus: "paid",
      eventSlug: EVENT.slug,
    }).lean()) as TicketDoc | null;
    return doc;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Ticket ${code.toUpperCase()} · ${EVENT.seriesName}`,
    robots: { index: false, follow: false },
  };
}

export default async function SessionTicketPage({ params }: Props) {
  const { code } = await params;
  const doc = await loadTicket(code);
  if (!doc) notFound();

  const ticketCode = String(doc.ticketCode);
  const ticketUrl = ticketAbsoluteUrl(ticketCode);
  const qrSrc = ticketQrImageUrl(ticketUrl, 240);
  const mapsUrl =
    EVENT.mapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 text-[#1c1c1c] sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">
          {EVENT.seriesName} · Entry ticket
        </p>

        <div className="mt-4 overflow-hidden rounded-3xl border border-[#d7ebe7] bg-white shadow-[0_20px_50px_-28px_rgba(15,118,110,0.35)]">
          <div className="bg-[#0f766e] px-5 py-4 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {EVENT.edition}
            </p>
            <h1 className="mt-1 text-lg font-bold leading-snug">Badminton doubles</h1>
            <p className="mt-2 text-[13px] text-white/80">
              {EVENT.date} · {EVENT.timeWindow}
            </p>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">Player 1</p>
                <p className="mt-0.5 font-semibold">{doc.leadName}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">Player 2</p>
                <p className="mt-0.5 font-semibold">{doc.partnerName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">Venue</p>
                <p className="mt-0.5 font-medium leading-snug">{EVENT.venueName}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">Paid</p>
                <p className="mt-0.5 font-semibold">₹{formatInr(Number(doc.amountInr))}</p>
              </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#888]">Status</p>
                  <p className={`mt-0.5 font-semibold ${doc.checkedInAt ? "text-emerald-700" : "text-[#0f766e]"}`}>
                    {doc.checkedInAt ? "Checked in" : "Confirmed"}
                  </p>
                </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[#b6ddd7] bg-[#f3fbf9] px-4 py-5 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f8f88]">
                Verification code
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-[0.2em] text-[#0f766e]">
                {ticketCode}
              </p>
              <div className="mx-auto mt-4 inline-flex rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#e0efec]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc} alt={`QR for ticket ${ticketCode}`} width={180} height={180} className="h-[180px] w-[180px]" />
              </div>
              <p className="mx-auto mt-3 max-w-[16rem] text-[12px] leading-snug text-[#666]">
                Show this QR or code at check-in. Staff will scan or enter the code to verify entry.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl border border-[#b6ddd7] py-2.5 text-center text-[13px] font-semibold text-[#0f766e]"
              >
                Venue map
              </a>
              <Link
                href="/events/ofside-open-2"
                className="flex-1 rounded-xl bg-[#0f766e] py-2.5 text-center text-[13px] font-semibold text-white"
              >
                Event page
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#999]">
          Keep this page saved or screenshot it before you arrive.
        </p>
      </div>
    </main>
  );
}
