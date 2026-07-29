import React from 'react';
import { motion } from 'framer-motion';
import { useGetSettings } from '@workspace/api-client-react';
import { PixelNestLogo } from '@/components/ui/PixelNestLogo';

export function Hero() {
  const { data: settings } = useGetSettings();
  
  const title = settings?.heroTitle || 'Creative Digital Designer & Web Developer';
  const subtitle = settings?.heroSubtitle || 'I create modern websites, branding, graphic design, and digital experiences that help businesses grow.';

  // Highlight the word "Designer" if it appears
  const highlightWord = (text: string) => {
    const parts = text.split(/(Designer)/i);
    return parts.map((part, i) => 
      part.toLowerCase() === 'designer' 
        ? <span key={i} className="text-stroke">{part}</span>
        : part
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noise bg-grid-white pt-20">
      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none" />
      
      {/* Glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full border border-border bg-card/30 backdrop-blur-sm text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Based in Albania
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground tracking-tighter leading-[1.1] max-w-4xl"
        >
          {highlightWord(title)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#portfolio"
            className="px-8 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(119,51,208,0.3)] hover:shadow-[0_0_30px_rgba(119,51,208,0.5)] w-full sm:w-auto"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-transparent border border-border text-foreground font-medium rounded hover:border-foreground transition-all w-full sm:w-auto"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute hidden lg:flex items-center gap-3 bottom-24 right-10 p-4 bg-card/40 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl"
        >
          <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center bg-primary/10 overflow-hidden">
            <PixelNestLogo size="sm" showText={false} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Available for work</p>
            <p className="text-xs text-muted-foreground">Accepting new projects</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
