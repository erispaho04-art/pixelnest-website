import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetProjects } from '@workspace/api-client-react';
import { useTilt } from '@/hooks/useTilt';
import { ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

const CATEGORIES = ['All', 'Branding', 'Social Media', 'Business Cards', 'Menu Design', 'Print Design', 'Marketing'];

function ProjectCard({ project, idx }: { project: any; idx: number }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(7);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      className="break-inside-avoid mb-5"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="card"
        className="group relative rounded-xl overflow-hidden bg-card border border-border/40 cursor-none"
        style={{ willChange: 'transform' }}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${idx % 3 === 0 ? 'aspect-[4/3]' : idx % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'}`}>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-card flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Content on hover */}
          <div className="absolute inset-0 p-5 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
              {project.category}
            </span>
            <h3 className="text-foreground font-bold text-lg leading-tight mb-3">
              {project.title}
            </h3>
            <Link href={`/projects/${project.id}`}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 transition-colors cursor-pointer w-fit">
                View Project <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Category badge (always visible) */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-background/60 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
              {project.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const { data: projects = [], isLoading } = useGetProjects();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-primary font-medium tracking-widest uppercase text-sm mb-3"
          >
            Portfolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-bold mb-4"
          >
            Selected Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Every project crafted with intention, precision, and creativity.
          </motion.p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-250 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-[0_0_14px_rgba(139,92,246,0.4)]'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-5 rounded-xl bg-card animate-pulse aspect-[4/3]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">No projects yet — check back soon.</p>
          </div>
        ) : (
          <AnimatePresence mode="sync">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
              {filtered.map((project, idx) => (
                <ProjectCard key={project.id} project={project} idx={idx} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
