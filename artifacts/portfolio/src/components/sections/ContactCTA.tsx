import React from 'react';
import { motion } from 'framer-motion';

export function ContactCTA() {
  return (
    <section className="relative py-36 overflow-hidden bg-background">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-primary font-medium tracking-widest uppercase text-sm mb-6"
        >
          Ready to Start?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight"
        >
          Let's Build Something
          <br />
          <span
            className="text-primary"
            style={{ textShadow: '0 0 50px rgba(139,92,246,0.45)' }}
          >
            Extraordinary
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto"
        >
          Ready to elevate your brand? Let's turn your vision into a stunning digital experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
            style={{ boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}
          >
            Start Your Project
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-9 py-4 bg-transparent border border-border text-foreground font-semibold rounded-lg hover:border-primary/50 hover:text-primary transition-all duration-300 hover:scale-105"
          >
            Book a Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
