import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '@/context/CursorContext';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);
  const { cursorType, setCursorType } = useCursor();

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-cursor], button, a[href]');
      if (!el) {
        setCursorType('default');
      } else if (el.getAttribute('data-cursor') === 'card') {
        setCursorType('card');
      } else if (el.tagName === 'BUTTON') {
        setCursorType('button');
      } else {
        setCursorType('link');
      }
    };

    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mouseleave', hide);
    window.addEventListener('mouseenter', show);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseleave', hide);
      window.removeEventListener('mouseenter', show);
    };
  }, [isVisible, setCursorType]);

  const isButton = cursorType === 'button';
  const isCard = cursorType === 'card';
  const ringSize = isCard ? 72 : isButton ? 44 : 26;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        animate={{
          x: pos.x - ringSize / 2,
          y: pos.y - ringSize / 2,
          opacity: isVisible ? 1 : 0,
          width: ringSize,
          height: ringSize,
        }}
        transition={{
          x: { type: 'spring', damping: 28, stiffness: 350, mass: 0.6 },
          y: { type: 'spring', damping: 28, stiffness: 350, mass: 0.6 },
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          opacity: { duration: 0.2 },
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center"
        style={{
          border: isCard ? 'none' : `1.5px solid ${isButton ? 'rgba(139,92,246,0.9)' : 'rgba(139,92,246,0.45)'}`,
          backgroundColor: isCard ? 'rgba(139,92,246,0.88)' : 'transparent',
        }}
      >
        {isCard && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-[10px] font-bold uppercase tracking-widest select-none"
          >
            View
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          opacity: isVisible && !isCard ? 1 : 0,
          scale: isButton ? 1.6 : 1,
        }}
        transition={{
          x: { type: 'spring', damping: 40, stiffness: 600, mass: 0.2 },
          y: { type: 'spring', damping: 40, stiffness: 600, mass: 0.2 },
          scale: { duration: 0.12 },
          opacity: { duration: 0.12 },
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999]"
      />
    </>
  );
}
