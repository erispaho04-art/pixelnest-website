import React from 'react';
import { useGetProjects } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ProjectDetail({ params }: { params?: { id?: string } }) {
  const id = parseInt(params?.id ?? '0', 10);
  const [, setLocation] = useLocation();
  const { data: projects = [], isLoading } = useGetProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Project not found.</p>
        <Link href="/#portfolio">
          <span className="text-primary hover:underline cursor-pointer">← Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  const currentIdx = projects.findIndex(p => p.id === id);
  const prevProject = currentIdx > 0 ? projects[currentIdx - 1] : null;
  const nextProject = currentIdx < projects.length - 1 ? projects[currentIdx + 1] : null;

  const gallery: string[] = (project.gallery ?? []) as string[];
  const technologies: string[] = (project.technologies ?? []) as string[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden pt-20">
        {project.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-6 pb-16 pt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Link href="/#portfolio">
              <span className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm mb-6 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
              </span>
            </Link>
            <span className="text-primary font-medium text-sm uppercase tracking-widest block mb-3">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight max-w-3xl">
              {project.title}
            </h1>
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <Globe className="w-4 h-4" />
                Visit Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {project.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </motion.div>
            )}

            {project.challenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">The Challenge</h2>
                <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
              </motion.div>
            )}

            {project.solution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Our Solution</h2>
                <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
              </motion.div>
            )}

            {project.results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Results</h2>
                <p className="text-muted-foreground leading-relaxed">{project.results}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border/50 rounded-xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Category</span>
                  <p className="text-foreground font-medium mt-0.5">{project.category}</p>
                </div>
                {technologies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Technologies</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {technologies.map(tech => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.websiteUrl && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Website</span>
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-0.5 flex items-center gap-1 w-fit"
                    >
                      Visit Live Site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-foreground mb-6">Gallery</h2>
            <div className="columns-1 md:columns-2 gap-4">
              {gallery.map((url, i) => (
                <div key={i} className="break-inside-avoid mb-4 rounded-xl overflow-hidden group">
                  <img
                    src={url}
                    alt={`${project.title} gallery ${i + 1}`}
                    className="w-full h-auto transition-transform duration-600 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Prev / Next */}
      {(prevProject || nextProject) && (
        <section className="border-t border-border/40 py-12">
          <div className="container mx-auto px-6 max-w-4xl flex items-center justify-between gap-6">
            {prevProject ? (
              <Link href={`/projects/${prevProject.id}`}>
                <span className="group flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Previous</div>
                    <div className="font-medium">{prevProject.title}</div>
                  </div>
                </span>
              </Link>
            ) : <div />}

            {nextProject ? (
              <Link href={`/projects/${nextProject.id}`}>
                <span className="group flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Next</div>
                    <div className="font-medium">{nextProject.title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : <div />}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
