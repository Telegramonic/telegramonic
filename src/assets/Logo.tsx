import React, { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 120, 
  className = '', 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 85 85"
      className={`telegramonic-icon ${className}`}
      {...props}
    >
      <defs>
        {/* Official Messenger Blue Gradient */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0088cc" />
          <stop offset="100%" stopColor="#007bb9" />
        </linearGradient>
        
        {/* Darker Blue for the 3D Edge of the Hard Drives */}
        <linearGradient id="blueGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#007bb9" />
          <stop offset="100%" stopColor="#006193" />
        </linearGradient>
      </defs>

      {/* 1. Hard Drive Stack (Kept 3D) */}
      <g transform="translate(-1, -9) scale(1.2)">
        <rect x="7" y="60" width="56" height="18" rx="4" fill="rgba(0,0,0,0.15)" />
        <rect x="7" y="38" width="56" height="18" rx="4" fill="rgba(0,0,0,0.15)" />
        <rect x="7" y="16" width="56" height="18" rx="4" fill="rgba(0,0,0,0.15)" />
  
        {/* Bottom Hard Drive */}
        <rect x="5" y="56" width="56" height="18" rx="4" fill="url(#blueGrad)" />
        <rect x="5" y="66" width="56" height="8" rx="4" fill="url(#blueGradDark)" />
        <circle cx="52" cy="65" r="2" fill="#00ffcc" /> {/* Status Light */}
        <rect x="12" y="64" width="30" height="2" rx="1" fill="#006193" /> {/* Drive Slot */}
  
        {/* Middle Hard Drive */}
        <rect x="5" y="34" width="56" height="18" rx="4" fill="url(#blueGrad)" />
        <rect x="5" y="44" width="56" height="8" rx="4" fill="url(#blueGradDark)" />
        <circle cx="52" cy="43" r="2" fill="#00ffcc" />
        <rect x="12" y="42" width="30" height="2" rx="1" fill="#006193" />
  
        {/* Top Hard Drive */}
        <rect x="5" y="12" width="56" height="18" rx="4" fill="url(#blueGrad)" />
        <rect x="5" y="22" width="56" height="8" rx="4" fill="url(#blueGradDark)" />
        <circle cx="52" cy="21" r="2" fill="#00ffcc" />
        <rect x="12" y="20" width="30" height="2" rx="1" fill="#006193" />
      </g>
 
      {/* 2. New Paper Plane SVG path */}
      <g transform="translate(29.1, 16.5) scale(1.68)">
        {/* Inner shadow/fold filled with theme primary color */}
        <path
          d="M27.338,3.713l-5.316,22.166l-8.651-5.492l9.699-11.854L9.456,17.781l-4.45-2.882 L27.338,3.713 Z"
          fill="#0088cc"
        />
        <path
          d="M27.338,3.713l-5.316,22.166l-8.651-5.492l9.699-11.854L9.456,17.781l-4.45-2.882L27.338,3.713 M30.285,0L0.984,14.678 l8.174,5.128l3.749,11.464l4.789-5.779l5.616,3.586L30.285,0L30.285,0z"
          fill="#ffffff"
        />
      </g>
    </svg>
  );
};

export default Logo;