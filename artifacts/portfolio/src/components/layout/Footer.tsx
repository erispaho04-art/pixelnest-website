import React from 'react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';
import { Mail } from 'lucide-react';
import { PixelNestLogo } from '@/components/ui/PixelNestLogo';
import { Link } from 'wouter';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <Link href="/" className="block mb-4">
              <PixelNestLogo size="md" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Creative Digital Studio — Albania.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/355695816927"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="p-2 text-muted-foreground hover:text-[#25D366] transition-colors"
            >
              <SiWhatsapp className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/pixelnest.al?igsh=MWVuNnZ2OTc0cm9tdA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 text-muted-foreground hover:text-pink-500 transition-colors"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
            <a
              href="mailto:info@pixelnest.al"
              aria-label="Email"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {year} Pixel Nest. All rights reserved.</p>

          <nav className="flex items-center gap-5" aria-label="Legal">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
