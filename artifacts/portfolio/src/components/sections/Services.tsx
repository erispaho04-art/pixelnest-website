import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, PenTool, Fingerprint, Share2, QrCode, BookOpen, Wrench } from 'lucide-react';

const SERVICES = [
  { icon: PenTool,      title: "Graphic Design",                    desc: "Striking visuals that communicate your message with clarity and impact." },
  { icon: Fingerprint,  title: "Logo & Brand Identity",             desc: "Memorable marks and cohesive visual systems built to last." },
  { icon: Share2,       title: "Social Media Design",               desc: "Engaging content and templates that drive growth across every platform." },
  { icon: QrCode,       title: "QR Code Design",                    desc: "Custom-designed, scannable assets for print and digital touchpoints." },
  { icon: BookOpen,     title: "Digital Menus for Restaurants & Bars", desc: "Premium menus — print-ready or interactive — tailored to your brand." },
  { icon: Monitor,      title: "Website Design & Development",      desc: "Modern, fast, and fully responsive websites built to convert." },
  { icon: Wrench,       title: "Website Maintenance & Support",     desc: "Ongoing care to keep your site secure, updated, and performing perfectly." },
];

export function Services() {
  return (
    <section id="services" className="py-32 bg-card relative">
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Premium Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive design solutions crafted with meticulous attention to detail.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 150px 0px" }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="group relative p-8 bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <service.icon className="w-10 h-10 text-primary mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              
              <h3 className="text-xl font-bold text-foreground mb-3 relative z-10 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground relative z-10">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
