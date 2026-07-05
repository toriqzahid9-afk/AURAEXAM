import React from 'react';

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
}

export default function AppLogo({ className = "h-10 w-10", iconClassName }: AppLogoProps) {
  // Balanced size to perfectly center and scale the toga cap icon
  const finalIconClassName = iconClassName || "h-[65%] w-[65%]";
  
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 overflow-hidden select-none pointer-events-none ${className}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className={`${finalIconClassName}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tassel on the left side (layered behind the mortarboard) */}
        <path 
          d="M 50,30 L 22,39 L 22,54" 
          stroke="#ffffff" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        <path 
          d="M 22,54 C 19.5,55 18,57.5 18,60 C 18,62.5 20,64.5 22.5,64.5 C 25,64.5 27,62.5 27,60 C 27,57.5 25.5,55 23,54 Z" 
          fill="#ffffff" 
        />
        
        {/* Cap Dome / Neck band base under the diamond plate */}
        <path 
          d="M 30,47 C 30,62 37,69 50,69 C 63,69 70,62 70,47 L 64,47 C 64,57 58,62 50,62 C 42,62 36,57 36,47 Z" 
          fill="#ffffff" 
        />
        
        {/* Main Diamond Mortarboard Top Plate */}
        <path 
          d="M 14,38 L 50,20 L 86,38 L 50,56 Z" 
          fill="#ffffff" 
        />
      </svg>
    </div>
  );
}
