import React from 'react';

interface WajbaLogoProps {
  className?: string;
  variant?: 'crest' | 'navbar' | 'card' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isArabic?: boolean;
  onClick?: () => void;
}

export const WajbaLogo: React.FC<WajbaLogoProps> = ({
  className = '',
  variant = 'crest',
  size = 'md',
  isArabic = false,
  onClick,
}) => {
  if (variant === 'symbol') {
    const symbolSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      full: 'w-full h-full',
    }[size];

    return (
      <div
        onClick={onClick}
        className={`relative rounded-xl bg-[#f8f6f0] border border-[#e2e0d8] dark:border-[#384966] p-1 flex items-center justify-center shadow-xs overflow-hidden ${symbolSizes} ${
          onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''
        } ${className}`}
      >
        <img src="/wajba-logo.png" alt="شعار وجبة Wajba" className="w-full h-full object-contain" />
      </div>
    );
  }

  if (variant === 'navbar') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 select-none ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f8f6f0] border border-[#e2e0d8] dark:border-[#384966] flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
          <img src="/wajba-logo.png" alt="شعار وجبة Wajba" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#162032] dark:text-white font-mono">
              WAJBA
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hidden sm:block">
            {isArabic ? 'هناكل ايه انهاردة' : 'What are we eating today?'}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        onClick={onClick}
        className={`p-4 sm:p-6 rounded-2xl bg-[#f8f6f0] dark:bg-[#162032] border border-[#e2e0d8] dark:border-[#2b3a54] shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center gap-3 ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <img
          src="/wajba-logo.png"
          alt="شعار وجبة Wajba"
          className="w-full max-w-xs h-auto object-contain mx-auto"
        />
      </div>
    );
  }

  // Default: Grand Crest (ideal for Hero sections, Welcome banners, Branding cards)
  const crestMaxSizes = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative group mx-auto w-full ${crestMaxSizes} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Outer ambient glow effect */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D86540]/20 via-[#E59A2A]/25 to-[#162032]/20 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />

      {/* Main Luxury Emblem Card */}
      <div className="relative rounded-3xl bg-[#F8F6F0] p-4 sm:p-6 md:p-8 border-2 border-[#D8C5A4] shadow-xl text-center overflow-hidden transition-all duration-300 group-hover:scale-[1.01]">
        {/* Subtle Arch Ornament Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#162032_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Scaled Full Logo SVG */}
        <img
          src="/wajba-logo.png"
          alt="شعار وجبة Wajba"
          className="w-full h-auto object-contain max-h-[320px] sm:max-h-[380px] md:max-h-[420px] mx-auto filter drop-shadow-sm"
        />
      </div>
    </div>
  );
};

export default WajbaLogo;
