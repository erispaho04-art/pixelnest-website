import React from 'react';
import { motion } from 'framer-motion';
import { useGetSettings } from '@workspace/api-client-react';

const SKILLS = [
  "Graphic Design", "Logo & Brand Identity", "Social Media Design",
  "QR Code Design", "Digital Menus", "Website Design & Development",
  "Website Maintenance", "Business Cards", "Posters & Flyers", "Print Design"
];

export function About() {
  const { data: settings } = useGetSettings();

  const aboutText = settings?.aboutText || 'I turn ideas into compelling visual identities. Based in Albania, I specialize in crafting premium digital experiences that blur the line between utility and art. From high-end real estate campaigns to bespoke restaurant branding, I deliver work that commands attention and drives results.';

  return (
    <section id="about" className="relative py-36 bg-background overflow-hidden">

      {/* Smooth gradient bridge from Stats purple above */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section label — scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px w-10 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            About Us
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — headline + body */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-[1.1]">
              Precision in every{' '}
              <span className="text-primary italic">pixel.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 whitespace-pre-line">
              {aboutText}
            </p>

            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-widest text-foreground">
                Our Expertise
              </span>
            </div>
          </motion.div>

          {/* Right — skill tags */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' }}
            className="flex flex-wrap gap-3"
          >
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.35, delay: 0.04 * (index % 6) }}
                className="px-5 py-2.5 bg-card border border-border rounded text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors cursor-default shadow-sm"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
