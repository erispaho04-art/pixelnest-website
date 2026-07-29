import React from 'react';
import { motion } from 'framer-motion';

const SKILL_GROUPS = [
  {
    title: "Design & Creative",
    skills: [
      { name: "Adobe Photoshop", percent: 95 },
      { name: "Adobe Illustrator", percent: 92 },
      { name: "Adobe Creative Cloud", percent: 93 },
      { name: "Artificial Intelligence (AI Tools)", percent: 90 },
    ]
  },
  {
    title: "Development & Web",
    skills: [
      { name: "HTML & CSS", percent: 90 },
      { name: "JavaScript / React", percent: 80 },
      { name: "Next.js", percent: 75 },
      { name: "WordPress", percent: 90 },
    ]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-32 bg-card relative overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Technical Arsenal</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">The tools I use to bring ideas to life.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {SKILL_GROUPS.map((group, groupIdx) => (
            <div key={group.title}>
              <h3 className="text-2xl font-bold text-foreground mb-8 pb-4 border-b border-border/50">
                {group.title}
              </h3>
              
              <div className="space-y-8">
                {group.skills.map((skill, idx) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm font-mono text-muted-foreground">{skill.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percent}%` }}
                        viewport={{ once: true, margin: "0px 0px 150px 0px" }}
                        transition={{ duration: 1.2, delay: idx * 0.08, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
