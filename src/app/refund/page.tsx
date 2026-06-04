import React from "react";
import Link from "next/link";

const SectionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section data-reveal="feature-card" className="mb-8 p-6 bg-white rounded-xl shadow">{children}</section>
);

const RefundPolicyPage = () => (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
        <section data-reveal="feature-card" className="mb-8 p-6 bg-white rounded-xl shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Subscription Cancellation &amp; Refund Policy
            </h1>
            <p className="text-gray-600 text-center mt-2">
                Applies to <strong>Ofside Pro</strong> app subscriptions only. Ofside does not offer venue booking on the Platform.
            </p>
        </section>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">I. Scope</h2>
            <p className="text-gray-700 leading-7">
                This policy covers paid <strong>app Subscriptions</strong> (Ofside Pro). Free app features are not billed. Pricing, plan length, and renewal terms are shown in the app before you subscribe.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">II. Billing &amp; auto-renewal</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Android:</strong> Billed via Razorpay. Subscriptions renew automatically unless cancelled before the renewal date.</li>
                <li><strong>iOS:</strong> Billed via Apple App Store. Auto-renewal is managed by Apple under your Apple ID subscription settings.</li>
                <li>Introductory or promotional prices (if offered) apply only for the stated period; renewal is at the standard price shown at purchase or in the store.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">III. How to cancel</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>iOS:</strong> Settings → Apple ID → Subscriptions → Ofside → Cancel Subscription.</li>
                <li><strong>Android:</strong> Use in-app subscription management or contact <a href="mailto:play@ofside.in" className="text-blue-600 underline">play@ofside.in</a> for help cancelling your Razorpay subscription.</li>
            </ul>
            <p className="mt-3 text-gray-700">
                After cancellation, you keep Pro access until the end of the current paid period. Cancellation stops future charges; it does not delete your Ofside account.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">IV. Refunds</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>iOS:</strong> Refund requests are handled by Apple per App Store policy. Ofside cannot issue App Store refunds directly.</li>
                <li><strong>Android:</strong> Refunds for Razorpay charges are considered case-by-case where required by law or for clear billing errors. Contact <a href="mailto:play@ofside.in" className="text-blue-600 underline">play@ofside.in</a> with your account email and payment reference.</li>
                <li>We generally do not provide prorated refunds for unused time after a Subscription period has started, except where mandated by applicable consumer law.</li>
                <li>Duplicate charges or failed activation after successful payment should be reported within 14 days for investigation.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">V. Restore purchases (iOS)</h2>
            <p className="text-gray-700 leading-7">
                If you already subscribed with your Apple ID, use <strong>Restore Purchases</strong> in the app to link Pro to your Ofside account. You cannot purchase a second active subscription for the same Apple ID while one is active in the App Store.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VI. Policy changes</h2>
            <p className="text-gray-700 leading-7">
                We may update this policy on the Platform. Changes apply to new Subscriptions after posting. See also our{" "}
                <Link href="/terms" className="text-blue-600 underline">Terms and Conditions</Link>.
            </p>
        </SectionBox>
    </main>
);

export default RefundPolicyPage;
