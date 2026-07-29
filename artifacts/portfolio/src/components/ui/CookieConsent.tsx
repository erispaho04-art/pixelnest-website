import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'pixelnest_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return;
    // Small delay so it doesn't fight with the loading screen
    const t = setTimeout(() => setVisible(true), 3200);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-2xl"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="bg-card border border-border rounded-lg shadow-2xl shadow-black/50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />

            <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
              We use cookies to improve your experience and analyze site traffic.
              Read our{' '}
              <a href="/cookie-policy" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                Cookie Policy
              </a>{' '}
              for more information.
            </p>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={reject}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded hover:border-foreground hover:text-foreground transition-colors"
              >
                Reject
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={reject}
                aria-label="Close"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
