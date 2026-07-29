import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: July 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Who We Are</h2>
            <p>Pixel Nest is a creative digital studio based in Albania. Our website is <strong className="text-foreground">pixelnest.al</strong>. You can contact us at the email or phone number listed on our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information when you visit our website or contact us:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Contact information you voluntarily provide (name, email, phone number, message).</li>
              <li>Technical data such as IP address, browser type, pages visited, and time spent on the site (via analytics cookies, if accepted).</li>
              <li>Cookie preference stored locally in your browser.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use the information collected to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Respond to your inquiries and project requests.</li>
              <li>Improve and maintain our website.</li>
              <li>Analyze how visitors use our website (only if analytics cookies are accepted).</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Cookies</h2>
            <p>Our website uses cookies to improve your experience. You can manage your cookie preferences using the banner displayed on your first visit. For more details, please read our <a href="/cookie-policy" className="text-primary underline">Cookie Policy</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
            <p>We do not sell, trade, or transfer your personal information to third parties. We may share data only when required by law or to protect our legal rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
            <p>We retain personal data only for as long as necessary to fulfill the purposes described in this policy or as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise your rights, please contact us directly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of any significant changes by updating the date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us via the contact details provided on our website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
