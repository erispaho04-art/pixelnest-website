import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';
import { useGetSettings } from '@workspace/api-client-react';

export function Contact() {
  const { data: settings } = useGetSettings();

  const phone = settings?.phone || "+355 69 581 6927";
  const email = settings?.email || "contact@example.com";
  const instagram = settings?.instagram || "https://www.instagram.com/pixelnest.al?igsh=MWVuNnZ2OTc0cm9tdA%3D%3D&utm_source=qr";
  const whatsapp = settings?.whatsapp || "https://wa.me/355695816927";

  return (
    <section id="contact" className="py-32 bg-card relative border-t border-border/30">
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 150px 0px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Let's create something <span className="text-primary italic">together.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ready to elevate your brand? Reach out for a consultation, project inquiry, or just to say hello.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 150px 0px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-6"
          >
            {whatsapp && (
              <a 
                href={whatsapp}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white rounded-lg font-medium transition-all"
              >
                <SiWhatsapp className="w-5 h-5" />
                WhatsApp
              </a>
            )}

            {phone && (
              <a 
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground rounded-lg font-medium transition-all"
              >
                <Phone className="w-5 h-5" />
                {phone}
              </a>
            )}

            {instagram && (
              <a 
                href={instagram}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-pink-500 border border-pink-500/30 hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-lg font-medium transition-all group"
              >
                <SiInstagram className="w-5 h-5" />
                Instagram
              </a>
            )}

            
            {email && (
              <a 
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-blue-400/10 text-blue-400 border border-blue-400/30 hover:bg-blue-400 hover:text-white rounded-lg font-medium transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Me
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
