'use client';

import React from 'react';

interface CandorLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function CandorLogo({ className = '', iconOnly = false }: CandorLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Hexagonal Aperture Logo Shutter */}
      <svg
        className="w-7 h-7 text-[#10b981] flex-shrink-0"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render 6 symmetric blades rotated around the center (50, 50) */}
        {/* Gaps are created by stroke separation matching the container background */}
        <g 
          fill="currentColor" 
          stroke="var(--background)" 
          strokeWidth="2.5"
          className="transition-colors duration-300"
        >
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(0 50 50)" />
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(60 50 50)" />
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(120 50 50)" />
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(180 50 50)" />
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(240 50 50)" />
          <polygon points="50,10 84.64,30 65,45 42,35" transform="rotate(300 50 50)" />
        </g>
      </svg>
      
      {!iconOnly && (
        <span className="font-display font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-lg lowercase mt-0.5">
          candor
        </span>
      )}
    </div>
  );
}
