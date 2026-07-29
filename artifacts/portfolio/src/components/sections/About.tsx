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
    <section id="about" className="py-32 bg-background relative border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px 150px 0px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Precision in every <span className="text-primary italic">pixel.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {aboutText}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-widest text-foreground">Our Expertise</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px 150px 0px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px 150px 0px" }}
                transition={{ duration: 0.4, delay: 0.05 * (index % 5) }}
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
