import React from "react";

const policySections = [
    {
        title: "Rescheduling Window",
        content: [
            "You can reschedule your booking up to 2 hours before the start time of the first booked slot.",
            "After that, rescheduling is not permitted.",
        ],
    },
    {
        title: "Rescheduling Limit",
        content: [
            "Each booking can only be rescheduled or cancelled once.",
            "Once rescheduled, that booking cannot be changed again.",
        ],
    },
    {
        title: "Rescheduling Charges & Price Differences",
        content: [
            "If the rescheduled slot is costlier, the price difference must be paid during the rescheduling.",
            "If the rescheduled slot is cheaper, the difference will not be refunded.",
            "Some venues may apply an additional rescheduling fee. This will be shown before confirming the change.",
        ],
    },
    {
        title: "Weather or Natural Causes",
        content: [
            "If the venue is unplayable due to rain or natural calamities, the booking will be rescheduled at the same venue, free of charge (subject to availability).",
            "No monetary refunds will be provided in such cases.",
        ],
    },
    {
        title: "How to Reschedule",
        content: [
            "Go to My Bookings → Select your booking → Tap Reschedule.",
            "Choose a new available date and time.",
            "Pay the price difference if required.",
            "A new confirmation message and updated booking ID will be shared via WhatsApp, email, and in-app notification.",
        ],
    },
    {
        title: "Important Notes",
        content: [
            "Rescheduling is subject to venue availability.",
            "Split payment bookings will also be recalculated on the total slot price, not just the paid amount.",
            "Rescheduled bookings are non-refundable and non-editable.",
        ],
    },
    {
        title: "Platform Rights",
        content: [
            "Ofside reserves the right to change the rescheduling policy without prior notice.",
            "Updated policies will apply to all bookings made after the changes go live.",
        ],
    },
];

export default function ReschedulingPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
            <section className="mb-8 p-6 bg-white rounded-xl shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Rescheduling Policy – Ofside Booking Platform
                </h1>
                <p>
                    This policy explains how you can reschedule your booking on Ofside, including limits, charges, and important notes. Please read carefully before making changes to your booking.
                </p>
            </section>
            {policySections.map((section) => (
                <section key={section.title} className="mb-8 p-6 bg-white rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">{section.title}</h2>
                    <ul className="list-disc pl-6 mb-3 space-y-1">
                        {section.content.map((point, idx) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </section>
            ))}
        </main>
    );
}