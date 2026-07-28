import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SESSIONS Terms & Conditions | Ofside",
  description:
    "Terms & Conditions and Refund & Cancellation Policy for SESSIONS by Ofside community events.",
  robots: { index: false, follow: false },
};

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-[#e8e8e8] py-8 last:border-b-0">
      <h2 className="text-lg font-bold tracking-tight text-[#1c1c1c]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4d4d4d]">{children}</div>
    </section>
  );
}

export default function SessionsTermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1c1c1c]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/events/ofside-open-2"
          className="text-sm font-medium text-[#666] underline-offset-2 hover:text-[#1c1c1c] hover:underline"
        >
          ← Back to event
        </Link>

        <header className="mt-6 rounded-2xl border border-[#e8e8e8] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#888]">
            SESSIONS by Ofside
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1c1c1c] sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-sm text-[#888]">Last Updated: 28-07-2026</p>
          <p className="mt-5 text-[15px] leading-relaxed text-[#4d4d4d]">
            Welcome to SESSIONS by Ofside. By registering for this event, you agree to the
            following Terms &amp; Conditions.
          </p>
        </header>

        <div className="mt-4 rounded-2xl border border-[#e8e8e8] bg-white px-5 sm:px-8">
          <Section title="1. Registration">
            <ul className="list-disc space-y-2 pl-5">
              <li>Registration is confirmed only upon successful payment.</li>
              <li>
                Event registrations are personal and cannot be transferred without prior
                approval from Ofside.
              </li>
              <li>
                Please carry a valid Government-issued Photo ID for verification at the
                venue.
              </li>
              <li>
                Participants must report to the venue at least 20 minutes before the
                scheduled start time.
              </li>
            </ul>
          </Section>

          <Section title="2. Special Offers">
            <p>
              <strong className="text-[#1c1c1c]">Female Doubles Offer:</strong> Teams
              consisting of two female participants are eligible for a 10% discount on
              registration.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Eligibility will be verified at the venue using a valid Government-issued
                Photo ID.
              </li>
              <li>
                Promotional offers cannot be combined with any other discounts unless
                explicitly stated.
              </li>
              <li>
                Ofside reserves the right to withdraw promotional benefits in case of
                incorrect or misleading information.
              </li>
            </ul>
          </Section>

          <Section title="3. Venue Rules">
            <ul className="list-disc space-y-2 pl-5">
              <li>Venue rules and regulations must be followed at all times.</li>
              <li>
                Security procedures, including frisking, remain the right of the venue
                management.
              </li>
            </ul>
            <p className="font-semibold text-[#1c1c1c]">
              The following items are strictly prohibited inside the venue:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Weapons</li>
              <li>Knives</li>
              <li>Firearms</li>
              <li>Fireworks</li>
              <li>Glass bottles</li>
              <li>Laser devices</li>
              <li>Helmets</li>
              <li>Musical instruments</li>
              <li>Any hazardous or prohibited object</li>
            </ul>
            <p>
              Management reserves the right to refuse entry or remove any participant
              violating venue policies.
            </p>
          </Section>

          <Section title="4. Participant Conduct">
            <p className="font-semibold text-[#1c1c1c]">Participants are expected to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Maintain respectful behaviour towards fellow participants, officials and
                venue staff.
              </li>
              <li>Follow all instructions issued by the event organizers.</li>
              <li>Display fair play and good sportsmanship throughout the event.</li>
            </ul>
            <p>
              Ofside reserves the right to remove any participant involved in misconduct,
              abusive behaviour, harassment, violence, damage to venue property or any
              activity that disrupts the event. Such removal may take place without any
              refund.
            </p>
          </Section>

          <Section title="5. Health &amp; Liability">
            <p className="font-semibold text-[#1c1c1c]">
              By participating, you acknowledge and agree that:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>You are medically fit to participate in recreational sports activities.</li>
              <li>Participation is voluntary and entirely at your own risk.</li>
              <li>
                Ofside, REPPP, sponsors, partners and organizers shall not be liable for
                any injury, illness, accident, theft, loss or damage to personal belongings
                arising before, during or after the event.
              </li>
            </ul>
          </Section>

          <Section title="6. Photography &amp; Media">
            <ul className="list-disc space-y-2 pl-5">
              <li>Photography and videography may take place during the event.</li>
              <li>
                By participating, you grant Ofside the right to use photographs, videos and
                recordings for marketing, social media, website content and future
                promotional campaigns without any additional permission or compensation.
              </li>
            </ul>
          </Section>

          <Section title="7. Alcohol &amp; Intoxication">
            <p>
              Participants found to be intoxicated or under the influence of alcohol or
              prohibited substances may be denied entry or removed from the event without
              any refund.
            </p>
          </Section>

          <Section id="refund" title="Refund &amp; Cancellation Policy">
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-[#1c1c1c]">Registration</h3>
                <p className="mt-1.5">
                  All registrations and ticket purchases are final and non-refundable.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1c1c]">Event Cancellation</h3>
                <p className="mt-1.5">If the event is cancelled by Ofside:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>Participants will receive a 100% refund, or</li>
                  <li>
                    May choose to transfer their registration to the next available
                    SESSIONS event.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1c1c]">Event Rescheduling</h3>
                <p className="mt-1.5">
                  If the event is rescheduled by Ofside, participants may either:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>Retain their registration for the revised date, or</li>
                  <li>Request a full refund.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1c1c]">No-Shows</h3>
                <p className="mt-1.5">
                  Participants who fail to attend the event without prior notice will not
                  be eligible for any refund, transfer or credit.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms &amp; Conditions shall be governed by the laws of India. Any
              dispute arising from the event shall be subject to the exclusive jurisdiction
              of the Courts of Delhi, India.
            </p>
          </Section>

          <Section title="Contact">
            <p className="font-semibold text-[#1c1c1c]">Ofside</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                Website:{" "}
                <a
                  href="https://ofside.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1c1c1c] underline underline-offset-2"
                >
                  ofside.in
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:play@ofside.in"
                  className="font-medium text-[#1c1c1c] underline underline-offset-2"
                >
                  play@ofside.in
                </a>
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </main>
  );
}
