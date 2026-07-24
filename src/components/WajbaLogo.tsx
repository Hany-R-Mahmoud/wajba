import React from 'react';

interface WajbaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showSubtitle?: boolean;
  isArabic?: boolean;
}

export const WajbaLogo: React.FC<WajbaLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  isArabic = false,
}) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-16 sm:h-20',
    lg: 'h-24 sm:h-32',
    full: 'w-full max-w-md h-auto',
  }[size];

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Brand Vector Image */}
      <img
        src="/logo.svg"
        alt="WAJBA • وجبة Logo"
        className={`object-contain transition-transform hover:scale-105 duration-300 ${sizeClasses}`}
        onError={(e) => {
          // Fallback if public asset is requested before vite build
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};

export default WajbaLogo;
