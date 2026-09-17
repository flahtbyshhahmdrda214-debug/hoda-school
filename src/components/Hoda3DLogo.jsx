import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

export default function Hoda3DLogo({ 
  size = 'xl', 
  interactive = true, 
  motion = true, 
  className = '' 
}) {
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12 sm:w-14 sm:h-14',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60',
    xl: 'w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80',
    '2xl': 'w-64 h-64 sm:w-76 sm:h-76 md:w-88 md:h-88 lg:w-96 lg:h-96'
  };

  // Trigger one full 360-degree rotation
  const triggerSpin = useCallback(() => {
    setIsSpinning(true);
    setSpinAngle((prev) => prev + 360);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1800);
  }, []);

  // Periodic rotation: Every 10 seconds, rotate one full turn
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!motion) return;

    timerRef.current = setInterval(() => {
      triggerSpin();
    }, 10000); // 10 seconds period
  }, [motion, triggerSpin]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleMouseMove = (e) => {
    if (!interactive || isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D tilt calculation (-16deg to +16deg)
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (!interactive) return;
    triggerSpin();
    resetTimer(); // Reset the 10-second timer on manual click
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: '1200px' }}
      className={`relative select-none flex items-center justify-center cursor-pointer group ${sizeClasses[size] || sizeClasses.xl} ${className}`}
      title="نشان سه‌بعدی شیشه‌ای مجتمع هدی (چرخش خودکار هر ۱۰ ثانیه)"
    >
      {/* 1. Multi-Layer Pulsing Aurora Glow Behind Glass */}
      <div 
        className={`absolute -inset-4 rounded-full bg-gradient-to-tr from-turquoise-500/30 via-amber-400/20 to-emerald-400/30 blur-2xl transition-opacity duration-700 pointer-events-none ${
          motion ? 'animate-pulse-halo' : ''
        } ${isHovered || isSpinning ? 'opacity-90' : 'opacity-60'}`}
      />

      {/* 2. Soft Secondary Ambient Rim Glow */}
      <div 
        className="absolute inset-1 rounded-full bg-turquoise-400/20 blur-lg pointer-events-none"
      />

      {/* 3. Orbiting Sparkle Stars */}
      {motion && size !== 'xs' && size !== 'sm' && (
        <div className="absolute inset-0 pointer-events-none animate-orbit-stars">
          <div className="absolute top-1 right-3 text-amber-300 animate-pulse">
            <Sparkles className="w-4 h-4 opacity-80" />
          </div>
          <div className="absolute bottom-2 left-4 text-turquoise-300 animate-pulse delay-500">
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
          </div>
        </div>
      )}

      {/* Outer Levitation Floating Wrapper (decoupled from rotation) */}
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          motion && !isHovered && !isSpinning ? 'animate-float-vertical' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 4. Glassmorphic Crystal Disc Plate (چرخش هماهنگ بستر شیشه‌ای بدون فیلترهای مات‌کننده) */}
        {size !== 'xs' && (
          <div 
            style={{
              transform: `rotateX(${isHovered ? rotate.x * 0.6 : 0}deg) rotateY(${spinAngle + (isHovered ? rotate.y * 0.6 : 0)}deg) translateZ(0)`,
              transition: isSpinning
                ? 'transform 1.8s cubic-bezier(0.34, 1.2, 0.64, 1)'
                : isHovered
                ? 'transform 0.12s ease-out'
                : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="absolute inset-1.5 sm:inset-2.5 rounded-full bg-white/20 border-2 border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_2px_5px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,0,0,0.2)] ring-1 ring-white/30 pointer-events-none overflow-hidden transition-colors duration-300 group-hover:border-white/80 group-hover:bg-white/25"
          >
            {/* Diagonal Caustic Glass Refraction Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/45 via-white/5 to-transparent pointer-events-none" />
            {/* Inner Concentric Glass Bevel Line */}
            <div className="absolute inset-2 sm:inset-3 rounded-full border border-white/35 pointer-events-none" />
            {/* Upper Rim Crystalline Glint */}
            <div className="absolute top-0 inset-x-6 sm:inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[0.5px]" />
            {/* Subtle Bottom Ground Shadow */}
            <div className="absolute bottom-0 inset-x-10 h-3 bg-black/10 blur-sm rounded-full" />
          </div>
        )}

        {/* 5. Main 3D Logo Container with 10-Second 360° Revolution & Ultra-Sharp Rendering */}
        <div
          style={{
            transform: `rotateX(${isHovered ? rotate.x : 0}deg) rotateY(${spinAngle + (isHovered ? rotate.y : 0)}deg) translateZ(0)`,
            transition: isSpinning
              ? 'transform 1.8s cubic-bezier(0.34, 1.2, 0.64, 1)'
              : isHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
        >
          {/* 4K Ultra-Crisp Transparent 3D Logo (100% Razor Sharp on Hover) */}
          <img
            src="/assets/hoda-3d-logo-4k.png"
            alt="نشان سه‌بعدی شیشه‌ای ۴K مجتمع آموزشی و قرآنی هدی"
            loading="eager"
            decoding="async"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitFontSmoothing: 'antialiased',
              imageRendering: '-webkit-optimize-contrast',
            }}
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* 6. Continuous Light Sweep Shimmer Beam across Glass */}
          {motion && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-overlay">
              <div className={`w-[200%] h-20 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full ${
                isSpinning ? 'animate-light-sweep duration-1000' : 'animate-light-sweep'
              }`} />
            </div>
          )}
        </div>
      </div>

      {/* 7. Tooltip on Hover */}
      {isHovered && !isSpinning && size !== 'xs' && size !== 'sm' && (
        <div className="absolute -bottom-8 px-3.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-white border border-turquoise-400/50 text-[11px] font-bold tracking-tight shadow-2xl whitespace-nowrap z-20 pointer-events-none animate-fadeIn flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>نشان سه‌بعدی شیشه‌ای هدی • چرخش خودکار هر ۱۰ ثانیه</span>
        </div>
      )}
    </div>
  );
}
