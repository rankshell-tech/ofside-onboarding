import React from "react";
import Link from "next/link";

/** Venue booking rescheduling is discontinued; subscriptions use /refund instead. */
export default function ReschedulingPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
            <section data-reveal="feature-card" className="mb-8 p-6 bg-white rounded-xl shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Rescheduling Policy</h1>
                <p className="text-gray-700 leading-7">
                    Ofside no longer offers <strong>venue booking</strong> on the Platform. Rescheduling of venue slots does not apply.
                </p>
                <p className="text-gray-700 leading-7 mt-4">
                    For <strong>Ofside Pro app subscriptions</strong> (billing, cancellation, refunds), see our{" "}
                    <Link href="/refund" className="text-blue-600 underline">Subscription Cancellation &amp; Refund Policy</Link>{" "}
                    and <Link href="/terms" className="text-blue-600 underline">Terms and Conditions</Link>.
                </p>
            </section>
        </main>
    );
}
