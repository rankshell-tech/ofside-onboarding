import React from "react";

const SectionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section className="mb-8 p-6 bg-white rounded-xl shadow">{children}</section>
);

const RefundPolicyPage = () => (
    <>
        <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
            <section className="mb-8 p-6 bg-white rounded-xl shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    Cancellation &amp; Refund Policy – Ofside Booking Platform
                </h1>
            </section>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    Refund Policy (Standard Conditions)
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                        ✅ <strong>100% refund</strong> if cancelled more than 24 hours before the booking start time.
                    </li>
                    <li>
                        ✅ <strong>50% refund</strong> if cancelled between 12 to 24 hours before the booking start time.
                    </li>
                    <li>
                        ❌ <strong>0% refund</strong> if cancelled less than 12 hours before the booking start time.
                    </li>
                </ul>
                <p className="mt-2 text-sm text-gray-500 italic">
                    Note: The time of cancellation is calculated from the start time of the first slot in your booking.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Handling Charges</h2>
                <p className="text-gray-700">
                    A <strong>3% handling fee</strong> will be deducted from the refund amount in all eligible cancellations.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    Split Payments (Advance or Group Bookings)
                </h2>
                <p className="text-gray-700">
                    In the case of partial or split payments, refund amounts will be calculated on the entire slot value, not the paid amount.<br />
                    <span className="italic text-sm text-gray-500">
                        E.g., If the full slot value is ₹2000 and ₹1000 was paid in advance, refund eligibility (if any) is determined on ₹2000.
                    </span>
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Amendment/Cancellation Limit</h2>
                <p className="text-gray-700">
                    Each booking can be amended or cancelled only once via the app.<br />
                    Further changes are not permitted after the first edit/cancellation is processed.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Time Restrictions on Cancellations</h2>
                <p className="text-gray-700">
                    No cancellations or changes are allowed after the start time of the first slot in your booking.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Weather &amp; Natural Calamities</h2>
                <p className="text-gray-700">
                    If the venue is unplayable due to weather (e.g., rain, flooding) or natural calamities, the booking will be rescheduled at the same venue and slot (based on availability).<br />
                    No monetary refund will be provided in this case unless venue refuses rescheduling.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Platform Rights</h2>
                <p className="text-gray-700">
                    Ofside reserves the right to modify the cancellation policy without prior notice.<br />
                    Changes will be updated on the platform and will apply to new bookings made after the update.
                </p>
            </SectionBox>

            <SectionBox>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">How to Cancel</h2>
                <p className="text-gray-700">
                    Visit <strong>My Bookings</strong> in the app → Select your booking → Tap on <strong>Cancel Booking</strong>.<br />
                    Your refund (if applicable) will be initiated within <strong>5-7 working days</strong> post cancellation.
                </p>
            </SectionBox>

            <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8 shadow">
                <strong className="block text-lg mb-2">📌 Important Note:</strong>
                <p className="text-gray-700">
                    Always read the specific cancellation policy for each venue before booking, as individual venues may have custom rules overriding the standard policy mentioned above.
                </p>
            </section>
        </main>
    </>
);

export default RefundPolicyPage;