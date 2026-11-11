import React from 'react';

/**
 * Official Hari Om Chaats & Snacks Logo Component
 * Pure transparent PNG that blends naturally into any website background
 * No artificial background box, no dark borders.
 */
export const HariOmLogo = ({
  className = '',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  alt = 'Hari Om Chaats & Snacks',
}) => {
  const logoSrc = '/hariom-logo-transparent.png';

  // Responsive, proportional height mapping
  const sizeMap = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const heightClass = sizeMap[size] || sizeMap.md;

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${heightClass} w-auto object-contain transition-transform select-none ${className}`}
      loading="eager"
    />
  );
};

export default HariOmLogo;
