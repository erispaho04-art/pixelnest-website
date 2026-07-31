import React from 'react';
import { motion } from 'framer-motion';
import { useGetClients } from '@workspace/api-client-react';

export function ClientLogos() {
  const { data: clients = [], isLoading } = useGetClients();

  if (isLoading || clients.length === 0) return null;

  return (
    <section className="py-20 bg-background border-t border-border/30">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-muted-foreground text-xs uppercase tracking-widest font-medium mb-10"
        >
          Trusted by Businesses
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {clients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group relative"
            >
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform duration-300 group-hover:scale-110"
                >
                  <LogoItem client={client} />
                </a>
              ) : (
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <LogoItem client={client} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoItem({ client }: { client: { logoUrl: string; name: string } }) {
  return (
    <img
      src={client.logoUrl}
      alt={client.name}
      className="h-10 max-w-[140px] object-contain transition-all duration-400"
      style={{
        filter: 'grayscale(100%) brightness(0.6)',
        transition: 'filter 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.target as HTMLImageElement).style.filter = 'grayscale(0%) brightness(1)';
      }}
      onMouseLeave={e => {
        (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.6)';
      }}
    />
  );
}
