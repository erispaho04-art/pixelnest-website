import React from 'react';
import { motion } from 'framer-motion';
import { useGetProjects } from '@workspace/api-client-react';

export function FeaturedProjects() {
  const { data: projects = [], isLoading } = useGetProjects();

  // Show the first 2 projects as featured case studies
  const featured = projects.slice(0, 2);

  // Hide section entirely if loading or no projects
  if (isLoading || featured.length === 0) return null;

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Featured Case Studies</h2>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>

        <div className="flex flex-col gap-32">
          {featured.map((project, idx) => {
            const align = idx % 2 === 0 ? 'left' : 'right';
            return (
              <div key={project.id} className={`flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>

                <motion.div
                  initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px 150px 0px" }}
                  transition={{ duration: 0.7 }}
                  className="w-full lg:w-3/5"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl group bg-card">
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}
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
                  {project.description && (
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      {project.description}
                    </p>
                  )}

                  <a href="#portfolio" className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group">
                    View Full Portfolio
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
