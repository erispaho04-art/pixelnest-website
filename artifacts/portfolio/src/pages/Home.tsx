import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
