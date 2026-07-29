import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: July 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Pixel Nest website (<strong className="text-foreground">pixelnest.al</strong>), you accept and agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Services</h2>
            <p>Pixel Nest provides creative digital services including graphic design, logo &amp; brand identity, social media design, QR code design, digital menus, website design &amp; development, and website maintenance &amp; support. Specific terms for each project are agreed upon separately in a written agreement or proposal.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, images, and code — is the property of Pixel Nest and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without prior written permission.</p>
            <p className="mt-2">Upon full payment of agreed fees, clients receive the rights to the final deliverables as specified in the project agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Client Responsibilities</h2>
            <p>Clients are responsible for providing accurate information, timely feedback, and any necessary content or assets required for project completion. Delays caused by the client may result in adjusted delivery timelines.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Payment</h2>
            <p>Payment terms are specified in individual project proposals or agreements. Pixel Nest reserves the right to withhold delivery of final files until payment is received in full.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Limitation of Liability</h2>
            <p>Pixel Nest shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability in any matter related to our services is limited to the amount paid for the specific service in question.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Website Use</h2>
            <p>You agree not to misuse this website, attempt to gain unauthorized access, or use it for any unlawful purpose. We reserve the right to terminate access for any user who violates these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. External Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to Terms</h2>
            <p>Pixel Nest reserves the right to modify these Terms &amp; Conditions at any time. Changes will be effective immediately upon posting on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Governing Law</h2>
            <p>These Terms &amp; Conditions are governed by the laws of the Republic of Albania.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Contact</h2>
            <p>For questions about these Terms &amp; Conditions, please contact us via the details on our website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
