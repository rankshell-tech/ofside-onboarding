import React from "react";

const SectionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section className="mb-6 p-5 bg-white rounded-xl shadow border border-gray-100">{children}</section>
);

const TermsPage = () => (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
        <section className="mb-8 p-6 bg-white rounded-xl shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Ofside Terms and Conditions of Use</h1>
        </section>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">I. ACCEPTANCE OF TERMS</h2>
            <p className="mb-2">
                <strong>Binding Agreement.</strong> These Terms of Use, Privacy Policy, Cancellation Policy, and Rescheduling Policy (collectively, &quot;Policies&quot;) constitute a binding agreement between you and Ofside Technologies Private Limited (&quot;Ofside&quot;, &quot;we&quot;, &quot;us&quot;).
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
                <li><strong>Venue Partner:</strong> A proprietor or manager listing sports venues on the Platform.</li>
                <li><strong>Booking:</strong> Reservation of one or more Slots at a Venue via the Platform.</li>
                <li><strong>Slot:</strong> A specific date and time interval at a Venue.</li>
                <li><strong>Booking Fee:</strong> Total amount payable for a Booking, inclusive of venue charges and Ofside commission.</li>
                <li><strong>Handling Fee:</strong> Non-refundable fee charged by Ofside on cancellations and refunds.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">III. ACCOUNT REGISTRATION & SECURITY</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Account Creation.</strong> To book venues, you must register an account, providing accurate and complete information. You may link third-party accounts (e.g., Google, Facebook).</li>
                <li><strong>Credentials.</strong> You are responsible for maintaining your password privacy. Notify us immediately of unauthorized access.</li>
                <li><strong>Termination.</strong> We may suspend or terminate accounts for breach of these Terms or for illegal or harmful activities.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">IV. BOOKING PROCESS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Search & Selection.</strong> Users may search, filter, and sort Venues by sport, location, price, ratings, and availability.</li>
                <li><strong>Booking Request.</strong> Upon selecting a Slot, enter required details (name, contact, team size, special requests).</li>
                <li><strong>Payment.</strong> Full or partial payment options as offered. Ofside collects payments via secure gateways.</li>
                <li><strong>Booking Confirmation.</strong> A unique Booking ID is generated. Confirmation sent via in-app notification, email, and WhatsApp with details: Booking ID, Venue, Date, Time, Payment status.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">V. PAYMENT TERMS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Methods.</strong> Accepted methods include credit/debit cards, UPI, net banking, and supported wallets.</li>
                <li><strong>Commission & Fees.</strong> Ofside charges a 10% commission. A 3% handling fee applies to refunds.</li>
                <li><strong>Taxes.</strong> Applicable taxes are added at checkout and borne by the User.</li>
                <li><strong>Split Payments.</strong> Refunds and rescheduling are calculated on the total slot price, not merely the amount paid.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VI. CANCELLATION POLICY</h2>
            <p>
                Our Cancellation Policy is incorporated by reference and available here: <a href="/cancellation-policy" className="text-blue-600 underline">Cancellation Policy</a>.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VII. RESCHEDULING POLICY</h2>
            <p>
                Our Rescheduling Policy is incorporated by reference and available here: <a href="/rescheduling-policy" className="text-blue-600 underline">Rescheduling Policy</a>.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">VIII. USER CONDUCT</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Compliance.</strong> You must follow Venue Partner rules, safety guidelines, and all applicable laws.</li>
                <li><strong>Prohibited Activities.</strong> Illegal, defamatory, harassing, or disruptive behavior; spamming; unauthorized data scraping; hacking; infringement of third-party rights.</li>
                <li><strong>No-Shows.</strong> Late cancellations and no-shows may incur fees or affect future booking privileges.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">IX. VENUE PARTNER OBLIGATIONS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Accuracy.</strong> Maintain up-to-date venue details, pricing, and slot availability.</li>
                <li><strong>Confirmation.</strong> Promptly confirm or reject Bookings. Update Ofside of any changes.</li>
                <li><strong>Venue Condition.</strong> Ensure safe, playable conditions. Offer rescheduling if unplayable due to weather or calamity.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">X. INTELLECTUAL PROPERTY</h2>
            <p>
                All content, trademarks, logos, and software on the Platform are owned or licensed by Ofside. Unauthorized use is prohibited.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XI. DISCLAIMERS & LIMITATION OF LIABILITY</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>As Is Basis.</strong> Services provided without warranties. To the maximum extent permitted by law, Ofside disclaims all warranties.</li>
                <li><strong>Liability Cap.</strong> Ofside’s maximum liability for any claim is limited to the Booking Fee paid for the disputed Booking.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XII. INDEMNIFICATION</h2>
            <p>
                You agree to indemnify and hold Ofside, its officers, directors, and employees harmless from claims arising from your breach of these Terms or your use of the Services.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XIII. PRIVACY</h2>
            <p>
                Our Privacy Policy, available here: <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>, explains how we collect, use, and share your information.
            </p>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XIV. DISPUTE RESOLUTION</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Governing Law.</strong> These Terms are governed by the laws of India.</li>
                <li><strong>Arbitration.</strong> Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996, in Delhi, India.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XV. MISCELLANEOUS</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Assignment.</strong> Ofside may assign rights or delegate obligations under these Terms. Users may not assign without Ofside’s consent.</li>
                <li><strong>Severability.</strong> If any provision is held invalid, the remainder will remain in effect.</li>
                <li><strong>Entire Agreement.</strong> These Terms and incorporated Policies constitute the entire agreement between you and Ofside regarding the Services.</li>
            </ul>
        </SectionBox>

        <SectionBox>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">XVI. CONTACT US</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p>
                    For questions or support, contact us at:<br />
                    <strong>Email:</strong> <a href="mailto:Partnercare@ofside.in" className="text-blue-600 underline">Partnercare@ofside.in</a><br />
                    <strong>Phone:</strong> +91-9811785330<br />
                    <strong>Address:</strong> Metro 55, Lane 2, Westend Marg, Saidulajab, Saiyad Ul Ajaib Extension, Saket, New Delhi, Delhi 110030
                </p>
            </div>
        </SectionBox>

        <section className="mt-8 p-4 bg-green-50 rounded-xl shadow text-center">
            <p className="text-lg font-medium text-green-700">Thank you for choosing Ofside. Play safe, play fair!</p>
        </section>
    </main>
);

export default TermsPage;
