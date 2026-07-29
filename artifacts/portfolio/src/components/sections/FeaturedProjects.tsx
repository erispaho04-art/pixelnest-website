import React from 'react';
import { motion } from 'framer-motion';

import scCover from '@assets/84_1784221289001.jpg';
import nkCover from '@assets/NIKO_1_1784221527951.jpg';

const FEATURED = [
  {
    title: "Smart Capital Real Estate",
    category: "Branding / Social Media",
    desc: "Full brand identity and social media campaign for a premium Albanian real estate agency in Vlorë. Elevated typography and surgical grid systems convey trust and luxury.",
    image: scCover,
    align: "left"
  },
  {
    title: "Niko's Grill",
    category: "Branding / Menu Design",
    desc: "Complete brand identity for a premium grill restaurant in Berat. Combining traditional warmth with modern precision across logos, menus, and packaging.",
    image: nkCover,
    align: "right"
  }
];

export function FeaturedProjects() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Featured Case Studies</h2>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>

        <div className="flex flex-col gap-32">
          {FEATURED.map((project, idx) => (
            <div key={idx} className={`flex flex-col ${project.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
              
              <motion.div 
                initial={{ opacity: 0, x: project.align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px 150px 0px" }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-3/5"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px 150px 0px" }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="w-full lg:w-2/5 flex flex-col justify-center"
              >
                <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
                  {project.category}
                </span>
                <h3 className="text-4xl font-serif font-bold text-foreground mb-6">
                  {project.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {project.desc}
                </p>
                
                <a href="#portfolio" className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group">
                  View Full Case Study
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
