import React from 'react';

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
}

export default function AppLogo({ className = "h-10 w-10", iconClassName }: AppLogoProps) {
  // Balanced size to perfectly center and scale the 'A'
  const finalIconClassName = iconClassName || "text-2xl font-black text-white";
  
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-orange-500 overflow-hidden select-none pointer-events-none ${className}`}
    >
      <span className={finalIconClassName}>A</span>
    </div>
  );
}
