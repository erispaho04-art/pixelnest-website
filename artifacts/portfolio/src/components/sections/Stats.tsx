import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const stepTime = Math.abs(Math.floor((duration * 1000) / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="font-serif font-bold text-5xl md:text-6xl text-foreground">
      {count}{suffix}
    </span>
  );
}

const STATS = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

export function Stats() {
  return (
    <section className="py-24 bg-primary relative">
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6 text-center">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 150px 0px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex flex-col items-center"
            >
              <div className="text-primary-foreground drop-shadow-md mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-primary-foreground/80 font-medium uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
