import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Palette, TrendingUp, Smartphone, Bot, Wrench } from 'lucide-react';
import { useTilt } from '@/hooks/useTilt';
import type { LucideIcon } from 'lucide-react';

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description:
      'We respect your time. Projects are delivered on schedule without compromising on quality.',
  },
  {
    icon: Palette,
    title: 'Premium Design',
    description:
      'Every pixel is crafted with purpose. We create visuals that leave a lasting impression.',
  },
  {
    icon: TrendingUp,
    title: 'SEO Optimized',
    description:
      'Your brand looks amazing and gets found. All work is optimized for search engines from day one.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description:
      'Designed for the screen in every pocket. Flawless experience across all devices and resolutions.',
  },
  {
    icon: Bot,
    title: 'AI Powered Workflow',
    description:
      'We leverage the latest AI tools to accelerate production while maintaining human creative direction.',
  },
  {
    icon: Wrench,
    title: 'Long-Term Support',
    description:
      "Our relationship doesn't end at delivery. We're here for updates, changes, and growth.",
  },
];

function FeatureCard({
  feature,
  idx,
}: {
  feature: (typeof FEATURES)[0];
  idx: number;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(5);
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px 80px 0px' }}
      transition={{ duration: 0.5, delay: idx * 0.07 }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-7 rounded-2xl cursor-default"
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        willChange: 'transform',
      }}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-350"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(168,85,247,0.06) 100%)',
          boxShadow:
            '0 0 0 1px rgba(139,92,246,0.22), 0 16px 40px rgba(139,92,246,0.08)',
        }}
      />

      {/* Icon glow blob */}
      <div
        className="absolute top-5 left-5 w-10 h-10 rounded-full blur-2xl opacity-0 group-hover:opacity-80 pointer-events-none transition-opacity duration-350"
        style={{ background: 'rgba(139,92,246,0.3)' }}
      />

      <div className="relative z-10">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'rgba(139,92,246,0.13)',
            boxShadow: '0 0 0 1px rgba(139,92,246,0.18)',
          }}
        >
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-32 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary font-medium tracking-widest uppercase text-sm mb-3"
          >
            Our Advantage
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-bold"
          >
            Why Businesses Choose PixelNest
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
