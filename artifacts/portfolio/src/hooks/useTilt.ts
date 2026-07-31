import { useRef, useCallback } from 'react';
import type React from 'react';

export function useTilt(maxTilt = 10) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;
      ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025,1.025,1.025)`;
      ref.current.style.transition = 'transform 0.1s ease';
    },
    [maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    ref.current.style.transition = 'transform 0.5s ease';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
