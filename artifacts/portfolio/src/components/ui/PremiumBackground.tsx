import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.4,
      opacity: Math.random() * 0.35 + 0.08,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      {/* Blob 1 – top left */}
      <motion.div
        animate={{ x: [0, 80, -20, 0], y: [0, -60, 40, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 68%)' }}
      />

      {/* Blob 2 – bottom right */}
      <motion.div
        animate={{ x: [0, -100, 30, 0], y: [0, 80, -40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 68%)' }}
      />

      {/* Blob 3 – center */}
      <motion.div
        animate={{ x: [0, 60, -30, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
        className="absolute top-[35%] left-[25%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)' }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}
