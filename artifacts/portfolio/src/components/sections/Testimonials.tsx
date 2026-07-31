import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "A.K.",
    company: "Real Estate Agency",
    quote: "Working with Pixel Nest elevated our agency's presence entirely. The branding was precise, luxurious, and perfectly captured the essence of high-end real estate.",
    rating: 5
  },
  {
    name: "N.P.",
    company: "Restaurant & Grill",
    quote: "From the logo to the menus and packaging, everything was delivered with incredible attention to detail. Our customers constantly compliment the new look.",
    rating: 5
  },
  {
    name: "E.D.",
    company: "Tech Solutions",
    quote: "Fast, professional, and wildly creative. The website redesign doubled our conversion rate in the first month. Highly recommended for any serious business.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Client Feedback</h2>
          <p className="text-muted-foreground">What businesses say about the work.</p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6 justify-center">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 150px 0px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="w-full md:w-1/3 bg-card border border-border/50 rounded-xl p-8 shadow-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-foreground/90 italic mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              
              <div>
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
