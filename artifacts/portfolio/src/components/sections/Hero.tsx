import React from 'react';
import { motion } from 'framer-motion';
import { useGetSettings } from '@workspace/api-client-react';
import { MacBook3D } from '@/components/ui/MacBook3D';

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
      className="relative min-h-screen flex items-center overflow-hidden bg-noise bg-grid-white pt-20"
      id="home"
    >
      {/* Cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background pointer-events-none" />

      {/* Left glow */}
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6 min-h-[80vh]">

          {/* ── Text column ── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.2 }}
              className="mb-6"
            >
              <span className="px-4 py-1.5 rounded-full border border-border bg-card/30 backdrop-blur-sm text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Based in Albania · Serving Worldwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.4, ease: 'easeOut' }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground tracking-tighter leading-[1.1]"
            >
              {highlightWord(title)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
              className="mt-6 text-lg text-muted-foreground font-light leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
              className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full sm:w-auto"
            >
              <a
                href="#portfolio"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded text-center hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_22px_rgba(119,51,208,0.32)] hover:shadow-[0_0_34px_rgba(119,51,208,0.55)]"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border text-foreground font-medium rounded text-center hover:border-foreground hover:scale-105 transition-all"
              >
                Contact Us
              </a>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.0 }}
              className="mt-12 flex items-center gap-8 lg:gap-10"
            >
              {[
                { value: '50+', label: 'Projects' },
                { value: '20+', label: 'Clients' },
                { value: '100%', label: 'Satisfaction' },
              ].map(stat => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── MacBook column ── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 2.6, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center w-full"
          >
            <MacBook3D />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
