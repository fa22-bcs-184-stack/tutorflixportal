'use client';

import React from 'react';

interface ThemeLogoProps {
  alt?: string;
  className?: string;
}

export function ThemeLogo({ alt = 'Tutorflix', className = '' }: ThemeLogoProps) {
  return (
    <img src="/logo-light.png" alt={alt} className={className} />
  );
}
