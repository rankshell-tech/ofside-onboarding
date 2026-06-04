import React from "react";

const SectionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section data-reveal="feature-card" className="mb-6 p-5 bg-white rounded-xl shadow border border-gray-100">{children}</section>
);

const TermsPage = () => (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
        <section data-reveal="feature-card" className="mb-8 p-6 bg-white rounded-xl shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Ofside Terms and Conditions of Use</h1>
        </section>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">I. ACCEPTANCE OF TERMS</h2>
            <p className="mb-2">
                <strong>Binding Agreement.</strong> These Terms of Use, Privacy Policy, and Subscription Cancellation &amp; Refund Policy (collectively, &quot;Policies&quot;) constitute a binding agreement between you and Ofside (Rankshell marketing solutions) (&quot;Ofside&quot;, &quot;we&quot;, &quot;us&quot;).
            </p>
            <p className="mb-2">
                <strong>Eligibility.</strong> You must be at least 18 years old and capable of entering into binding contracts. Use of the Services on behalf of an entity requires authority to bind that entity.
            </p>
            <p>
                <strong>Amendments.</strong> We may modify these Terms at any time by posting updated Terms on the Platform. Continued use after changes indicates acceptance. We recommend reviewing regularly.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">II. DEFINITIONS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>User:</strong> An individual or entity accessing or using the Platform.</li>
                <li><strong>Platform:</strong> The Ofside website, mobile applications, and related services for match creation, live scoring, stats, leaderboards, and community features.</li>
                <li><strong>Free Plan:</strong> Core app features available without a paid Subscription.</li>
                <li><strong>Pro Plan / Subscription:</strong> A recurring paid plan (e.g., Ofside Pro monthly or yearly) that unlocks premium in-app features for the subscription period.</li>
                <li><strong>Subscription Fee:</strong> The amount charged for a Subscription, as shown in the app at checkout (including any introductory or promotional pricing).</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">III. ACCOUNT REGISTRATION & SECURITY</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Account Creation.</strong> To use the app, you must register an account with accurate and complete information. You may link third-party accounts (e.g., Google, Facebook).</li>
                <li><strong>Credentials.</strong> You are responsible for maintaining your password privacy. Notify us immediately of unauthorized access.</li>
                <li><strong>Termination.</strong> We may suspend or terminate accounts for breach of these Terms or for illegal or harmful activities.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">IV. APP SUBSCRIPTIONS & PAYMENTS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Paid offering.</strong> Ofside&apos;s only paid offering on the Platform is the <strong>app Subscription</strong> (Ofside Pro). We do not sell venue bookings or other paid services through this Platform.</li>
                <li><strong>Plans.</strong> Subscription plans, prices, billing period, and included features are displayed in the app before purchase and may change from time to time.</li>
                <li><strong>Payment processors.</strong> On Android, Subscriptions are billed through Razorpay. On iOS, Subscriptions are billed through Apple&apos;s App Store. You agree to the applicable store or processor terms.</li>
                <li><strong>Auto-renewal.</strong> Unless cancelled before the renewal date, Subscriptions renew automatically for the same billing period at the then-current price (or promotional renewal price, if applicable).</li>
                <li><strong>Activation.</strong> Pro features activate after successful payment verification. Restore purchases (where supported) links an existing store subscription to your Ofside account.</li>
                <li><strong>Taxes.</strong> Applicable taxes may be added as required by law.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">V. SUBSCRIPTION CANCELLATION & REFUNDS</h2>
            <p className="text-gray-700">
                Cancellation, refunds, and billing disputes for Subscriptions are governed by our{" "}
                <a href="/refund" className="text-blue-600 underline">Subscription Cancellation &amp; Refund Policy</a>.
                iOS users must manage or cancel App Store subscriptions in Apple ID settings; Android users may cancel through the app or Razorpay as described in that policy.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VI. USER CONDUCT</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Compliance.</strong> You must follow applicable laws, community guidelines, and safety best practices when using the Services.</li>
                <li><strong>Prohibited Activities.</strong> Illegal, defamatory, harassing, or disruptive behavior; spamming; unauthorized data scraping; hacking; infringement of third-party rights; sharing account or Subscription access in violation of these Terms.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VII. INTELLECTUAL PROPERTY</h2>
            <p>
                All content, trademarks, logos, and software on the Platform are owned or licensed by Ofside. Unauthorized use is prohibited.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VIII. DISCLAIMERS & LIMITATION OF LIABILITY</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>As Is Basis.</strong> Services provided without warranties. To the maximum extent permitted by law, Ofside disclaims all warranties.</li>
                <li><strong>Liability Cap.</strong> Ofside&apos;s maximum liability for any claim arising from your use of the Services is limited to the greater of (a) Subscription Fees you paid to Ofside for the Services giving rise to the claim in the twelve months before the claim, or (b) ₹1,000.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">IX. INDEMNIFICATION</h2>
            <p>
                You agree to indemnify and hold Ofside, its officers, directors, and employees harmless from claims arising from your breach of these Terms or your use of the Services.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">X. PRIVACY</h2>
            <p>
                Our Privacy Policy, available here: <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>, explains how we collect, use, and share your information.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XI. DISPUTE RESOLUTION</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Governing Law.</strong> These Terms are governed by the laws of India.</li>
                <li><strong>Arbitration.</strong> Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996, in Delhi, India.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XII. MISCELLANEOUS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Assignment.</strong> Ofside may assign rights or delegate obligations under these Terms. Users may not assign without Ofside&apos;s consent.</li>
                <li><strong>Severability.</strong> If any provision is held invalid, the remainder will remain in effect.</li>
                <li><strong>Entire Agreement.</strong> These Terms and incorporated Policies constitute the entire agreement between you and Ofside regarding the Services.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XIII. CONTACT US</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p>
                    For questions or support, contact us at:<br />
                    <strong>User queries:</strong>{" "}
                    <a href="mailto:play@ofside.in" className="text-blue-600 underline">play@ofside.in</a>
                    <br />
                    <strong>Partnerships:</strong>{" "}
                    <a href="mailto:admin@ofside.in" className="text-blue-600 underline">admin@ofside.in</a>
                    <br />
                    <strong>Address:</strong> Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030
                </p>
            </div>
        </SectionBox>

        <section data-reveal="feature-card" className="mt-8 p-4 bg-green-50 rounded-xl shadow text-center">
            <p className="text-lg font-medium text-green-700">Thank you for choosing Ofside. Play safe, play fair!</p>
        </section>
    </main>
);

export default TermsPage;
