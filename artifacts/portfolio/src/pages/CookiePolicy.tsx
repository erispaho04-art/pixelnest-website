import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CookiePolicy() {
  const resetConsent = () => {
    localStorage.removeItem('pixelnest_cookie_consent');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl font-serif font-bold mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: July 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, making the experience faster and more useful.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Cookies</h2>
            <p>Pixel Nest uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong className="text-foreground">Essential cookies:</strong> Required for the website to function properly (e.g., remembering your cookie consent preference). These cannot be disabled.
              </li>
              <li>
                <strong className="text-foreground">Analytics cookies (optional):</strong> Help us understand how visitors interact with the website so we can improve it. These are only active if you accept cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Cookies We Use</h2>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="text-left p-3 text-foreground font-semibold">Cookie Name</th>
                    <th className="text-left p-3 text-foreground font-semibold">Type</th>
                    <th className="text-left p-3 text-foreground font-semibold">Purpose</th>
                    <th className="text-left p-3 text-foreground font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-3 font-mono text-xs">pixelnest_cookie_consent</td>
                    <td className="p-3">Essential</td>
                    <td className="p-3">Stores your cookie preference</td>
                    <td className="p-3">Persistent (localStorage)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Managing Your Preferences</h2>
            <p>You can manage or withdraw your cookie consent at any time by clicking the button below. This will reload the page and show the consent banner again.</p>
            <button
              onClick={resetConsent}
              className="mt-4 px-5 py-2.5 text-sm font-medium border border-border rounded hover:border-primary hover:text-primary transition-colors"
            >
              Reset Cookie Preferences
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Third-Party Cookies</h2>
            <p>We do not use third-party advertising or tracking cookies. External services linked from our site (e.g., Instagram, WhatsApp) may set their own cookies when you visit them — please refer to their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Changes to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Contact</h2>
            <p>If you have any questions about our use of cookies, please contact us via the details on our website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
