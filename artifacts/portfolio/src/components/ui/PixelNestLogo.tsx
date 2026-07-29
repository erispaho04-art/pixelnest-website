import React from 'react';

interface PixelNestLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  // showText kept for API compatibility but logo image already contains the text
  showText?: boolean;
}

export function PixelNestLogo({ size = 'md', className = '' }: PixelNestLogoProps) {
  const heights = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <img
      src="/logo.png"
      alt="Pixel Nest"
      className={`${heights[size]} w-auto object-contain [mix-blend-mode:screen] ${className}`}
      draggable={false}
    />
  );
}
