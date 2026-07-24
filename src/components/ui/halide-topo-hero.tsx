import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Sparkles, Utensils, Moon, ArrowRight, ArrowLeft } from 'lucide-react';

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn('flex flex-col items-center gap-4 p-4 rounded-lg bg-stone-900 text-white')}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-stone-700 rounded" onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button className="px-3 py-1 bg-stone-700 rounded" onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};

export interface HalideLandingProps {
  language: 'ar' | 'en';
  onEnterDashboard: () => void;
  isRamadanMode?: boolean;
  onToggleRamadanMode?: () => void;
}

export const HalideLanding: React.FC<HalideLandingProps> = ({
  language,
  onEnterDashboard,
  isRamadanMode,
  onToggleRamadanMode,
}) => {
  const isArabic = language === 'ar';
  const canvasRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse & Touch Parallax Logic
    const handleMove = (pageX: number, pageY: number) => {
      const x = (window.innerWidth / 2 - pageX) / 25;
      const y = (window.innerHeight / 2 - pageY) / 25;

      // Rotate the 3D Canvas smoothly
      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

      // Apply depth shift to layers
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = (index + 1) * 20;
        const moveX = x * (index + 1) * 0.25;
        const moveY = y * (index + 1) * 0.25;
        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.pageX, e.pageY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].pageX, e.touches[0].pageY);
      }
    };

    // Entrance Animation
    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.2s cubic-bezier(0.16, 1, 0.3, 1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
    }, 200);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[85vh] lg:min-h-[90vh] bg-[#0a0a0c] text-[#e0e0e0] font-mono overflow-hidden rounded-3xl border border-stone-800 shadow-2xl my-4 flex items-center justify-center">
      <style>{`
        .halide-grain {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 20;
          opacity: 0.12;
        }

        .viewport-container {
          perspective: 1800px;
          width: 100%;
          height: 100%;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .canvas-3d {
          position: relative;
          width: clamp(280px, 70vw, 750px);
          height: clamp(240px, 45vh, 460px);
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .topo-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(224, 224, 224, 0.15);
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;
          border-radius: 16px;
        }

        .layer-1 {
          background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(0.8) contrast(1.2) brightness(0.6);
        }

        .layer-2 {
          background-image: url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(0.6) contrast(1.1) brightness(0.7);
          opacity: 0.65;
          mix-blend-mode: screen;
        }

        .layer-3 {
          background-image: url('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200');
          filter: grayscale(0.5) contrast(1.3) brightness(0.8);
          opacity: 0.45;
          mix-blend-mode: overlay;
        }

        .contours-3d {
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background-image: repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 35px, rgba(255, 119, 89, 0.12) 36px, transparent 38px);
          transform: translateZ(110px);
          pointer-events: none;
        }

        .scroll-hint-line {
          position: absolute;
          bottom: 1.5rem; left: 50%;
          transform: translateX(-50%);
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, #ff7759, transparent);
          animation: flowLine 2s infinite ease-in-out;
          z-index: 30;
        }

        @keyframes flowLine {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      {/* SVG Filter for Film Grain */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="halide-grain" style={{ filter: 'url(#grain-filter)' }} />

      {/* Topographic Interface Grid Overlay */}
      <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-between z-30 pointer-events-none">
        {/* Top Data Bar */}
        <div className="flex items-start justify-between text-[11px] tracking-wider text-[#93939f]">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#ff7759] animate-ping" />
            <span className="font-bold text-white tracking-widest uppercase">WAJBA_TOPO_SYSTEM_2026</span>
          </div>

          <div className="text-right font-mono text-[10px] text-[#ff7759] space-y-0.5">
            <div>LATITUDE: 30.0444° N [CAIRO]</div>
            <div>CULINARY DEPTH: 100% HERITAGE</div>
          </div>
        </div>

        {/* Center Monumental Headline */}
        <div className="my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ff7759] text-[11px] font-mono tracking-widest uppercase mb-4 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>{isArabic ? 'هندسة الموائد العربية' : 'ARAB CULINARY ARCHITECTURE'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-white mix-blend-difference">
            {isArabic ? (
              <>
                خارطة الموائد <br />
                <span className="text-[#ff7759]">العربية التراثية</span>
              </>
            ) : (
              <>
                CULINARY <br />
                <span className="text-[#ff7759]">TOPOGRAPHY</span>
              </>
            )}
          </h1>
        </div>

        {/* Bottom Actions & Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-[11px] text-[#93939f] font-mono space-y-1">
            <p>[ WAJBA ENTERPRISE 2026 ]</p>
            <p className="text-stone-300">
              {isArabic
                ? 'جدولة أسبوعية، قائمة تسوق ذكية، وحاسبة صيام رمضان'
                : 'SURFACE TENSION & ARABIC MEAL PLANNING ARCHITECTURE'}
            </p>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto flex-wrap">
            {onToggleRamadanMode && (
              <button
                onClick={onToggleRamadanMode}
                className={`px-4 py-2 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                  isRamadanMode
                    ? 'bg-[#ff7759] text-white border-[#ff7759]'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                <Moon className="w-3.5 h-3.5 inline me-1 text-[#ff7759]" />
                <span>{isRamadanMode ? (isArabic ? 'رمضان مفرّد' : 'Ramadan Active') : (isArabic ? 'وضع رمضان' : 'Ramadan Mode')}</span>
              </button>
            )}

            <button
              onClick={onEnterDashboard}
              className="px-6 py-2.5 rounded-full bg-[#ff7759] hover:bg-[#ff552e] text-white text-xs font-mono font-bold tracking-wider transition-all shadow-lg hover:translate-y-[-2px] cursor-pointer flex items-center gap-2"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)' }}
            >
              <span>{isArabic ? 'استكشف الجدول ➔' : 'EXPLORE PLANNER ➔'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Topographic Layer Canvas Viewport */}
      <div className="viewport-container z-10">
        <div className="canvas-3d" ref={canvasRef}>
          <div className="topo-layer layer-1" ref={(el) => (layersRef.current[0] = el)} />
          <div className="topo-layer layer-2" ref={(el) => (layersRef.current[1] = el)} />
          <div className="topo-layer layer-3" ref={(el) => (layersRef.current[2] = el)} />
          <div className="contours-3d" />
        </div>
      </div>

      {/* Vertical Animated Scroll Hint */}
      <div className="scroll-hint-line" />
    </div>
  );
};

export default HalideLanding;
