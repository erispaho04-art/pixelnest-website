import React from 'react';
import { motion } from 'framer-motion';
import { useGetSettings } from '@workspace/api-client-react';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const { data: settings } = useGetSettings();

  const title =
    settings?.heroTitle || 'Creative Digital Agency';
  const subtitle =
    settings?.heroSubtitle ||
    'We create modern websites, branding, graphic design, and digital experiences that help businesses grow.';

  const highlightWord = (text: string) => {
    const parts = text.split(/(Designer|Agency|Digital|Creative)/i);
    return parts.map((part, i) =>
      ['designer', 'agency', 'digital', 'creative'].includes(part.toLowerCase()) ? (
        <span key={i} className="text-stroke">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-noise bg-grid-white pt-20"
      id="home"
    >
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/65 to-background pointer-events-none" />

      {/* Left ambient glow */}
      <div className="absolute top-1/3 -left-24 w-[560px] h-[560px] bg-primary/7 rounded-full blur-[180px] pointer-events-none" />
      {/* Right ambient glow */}
      <div className="absolute top-1/2 -right-24 w-[420px] h-[420px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
      {/* Centre bloom */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.2 }}
          className="mb-8"
        >
          <span className="px-4 py-1.5 rounded-full border border-border bg-card/30 backdrop-blur-sm text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Based in Albania · Serving Worldwide
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground tracking-tighter leading-[1.04] max-w-4xl"
        >
          {highlightWord(title)}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl"
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#portfolio"
            className="px-9 py-4 bg-primary text-primary-foreground font-medium rounded text-center hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_24px_rgba(119,51,208,0.34)] hover:shadow-[0_0_38px_rgba(119,51,208,0.58)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-9 py-4 bg-transparent border border-border text-foreground font-medium rounded text-center hover:border-foreground hover:scale-105 transition-all"
          >
            Contact Us
          </a>
        </motion.div>

        {/* Divider + mini stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.0 }}
          className="mt-20 flex flex-col items-center gap-8"
        >
          {/* Decorative rule */}
          <div className="flex items-center gap-5">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.22em]">
              Trusted Results
            </span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-12 md:gap-20">
            {[
              { value: '50+', label: 'Projects' },
              { value: '20+', label: 'Clients' },
              { value: '100%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
