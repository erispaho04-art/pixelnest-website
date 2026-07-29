import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbox } from '@/components/ui/Lightbox';
import { useGetProjects } from '@workspace/api-client-react';

const CATEGORIES = ["All", "Branding", "Social Media", "Business Cards", "Menu Design", "Print Design", "Marketing"];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; images: string[]; index: number }>({
    isOpen: false,
    images: [],
    index: 0
  });

  const { data: projects = [], isLoading } = useGetProjects();

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // We map all project images as a gallery
  const allImages = projects.map(p => p.imageUrl);

  const openLightbox = (imageUrl: string) => {
    const index = allImages.findIndex(img => img === imageUrl);
    setLightboxData({ isOpen: true, images: allImages, index: index >= 0 ? index : 0 });
  };

  return (
    <section id="portfolio" className="py-32 bg-background border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Selected Works</h2>
            <p className="text-muted-foreground max-w-lg">A showcase of premium branding and design projects executed for real clients.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-card rounded-lg animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-card"
                  onClick={() => openLightbox(project.imageUrl)}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <Lightbox
        isOpen={lightboxData.isOpen}
        images={lightboxData.images}
        initialIndex={lightboxData.index}
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
      />
    </section>
  );
}
