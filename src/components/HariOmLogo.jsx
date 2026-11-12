import React from 'react';

/**
 * Official Hari Om Chaats & Snacks Logo Component
 * 
 * Global Branding Standard:
 * - Uses the exact original transparent PNG
 * - Applies a consistent, subtle contour drop-shadow for superior visibility
 * - High contrast against both light (white, cream) and dark backgrounds
 * - Preserves original colors, proportions, transparency, and artwork
 * - Sharp and responsive across all device sizes
 * - No background boxes, borders, or glow artifacts
 */
export const HariOmLogo = ({
  className = '',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant = 'default', // 'default' | 'light' | 'strong' | 'dark' | 'receipt' | 'raw'
  shadow = true,
  alt = 'Hari Om Chaats & Snacks',
  style = {},
  ...props
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

  // Calibrated drop-shadow filters tailored per background context
  const shadowFilterMap = {
    default: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.22)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))',
    light: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.22)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))',
    strong: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.32)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.18))',
    dark: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.75)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.50))',
    receipt: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.30))',
    raw: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.22)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))',
  };

  const shadowClassMap = {
    default: 'hariom-logo-shadow',
    light: 'hariom-logo-shadow',
    strong: 'hariom-logo-shadow-strong',
    dark: 'hariom-logo-shadow-dark',
    receipt: 'hariom-logo-shadow-receipt',
    raw: 'hariom-logo-shadow',
  };

  const heightClass = sizeMap[size] || sizeMap.md;
  const shadowClass = shadow ? (shadowClassMap[variant] || 'hariom-logo-shadow') : '';
  const filterStyle = shadow ? (shadowFilterMap[variant] || shadowFilterMap.default) : 'none';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${heightClass} w-auto object-contain transition-transform select-none ${shadowClass} ${className}`}
      style={{
        filter: filterStyle,
        ...style,
      }}
      loading="eager"
      {...props}
    />
  );
};

export default HariOmLogo;
