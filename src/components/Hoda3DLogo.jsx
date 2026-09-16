import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export default function Hoda3DLogo({ 
  size = 'xl', 
  interactive = true, 
  motion = true, 
  className = '' 
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef(null);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12 sm:w-14 sm:h-14',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60',
    xl: 'w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80',
    '2xl': 'w-64 h-64 sm:w-76 sm:h-76 md:w-88 md:h-88 lg:w-96 lg:h-96'
  };

  const handleMouseMove = (e) => {
    if (!interactive || isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D tilt calculation (-20deg to +20deg)
    const rotateX = ((y - centerY) / centerY) * -22;
    const rotateY = ((x - centerX) / centerX) * 22;
    
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
    if (!interactive || isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1400);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: '1100px' }}
      className={`relative select-none flex items-center justify-center cursor-pointer group ${sizeClasses[size] || sizeClasses.xl} ${className}`}
      title="نشان سه‌بعدی شیشه‌ای ۴K مجتمع قرآنی هدی (کلیک جهت چرخش ۳بعدی)"
    >
      {/* 1. Multi-Layer Pulsing Aurora Glow Behind Glass (Motion) */}
      <div 
        className={`absolute -inset-4 rounded-full bg-gradient-to-tr from-turquoise-500/40 via-amber-400/30 to-emerald-400/40 blur-3xl transition-all duration-700 pointer-events-none ${
          motion ? 'animate-pulse-halo' : ''
        } ${isHovered ? 'scale-125 opacity-100' : 'opacity-80'}`}
      />

      {/* 2. Soft Secondary Ambient Rim Glow */}
      <div 
        className="absolute inset-1 rounded-full bg-turquoise-400/25 blur-xl pointer-events-none"
      />

      {/* 3. Orbiting Sparkle Stars (Motion decor) */}
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

      {/* 4. Glassmorphic Crystal Disc Plate (بستر شیشه‌ای آینه‌ای کریستالی) */}
      {size !== 'xs' && (
        <div 
          style={{
            transform: isSpinning
              ? 'rotateY(360deg) scale(1.08)'
              : isHovered
              ? `rotateX(${rotate.x * 0.7}deg) rotateY(${rotate.y * 0.7}deg) scale(1.05)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transition: isSpinning
              ? 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : isHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-1.5 sm:inset-2.5 rounded-full bg-white/20 backdrop-blur-2xl border-2 border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_2px_5px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,0,0,0.2)] ring-1 ring-white/30 pointer-events-none overflow-hidden transition-all duration-500 group-hover:border-white/80 group-hover:bg-white/25"
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

      {/* 5. Main 3D Floating & Rotating Logo Container */}
      <div
        style={{
          transform: isSpinning
            ? 'rotateY(360deg) scale(1.12)'
            : isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.08)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: isSpinning
            ? 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : isHovered
            ? 'transform 0.12s ease-out'
            : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full h-full flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] ${
          motion && !isHovered && !isSpinning ? 'animate-float-3d' : ''
        }`}
      >
        {/* 4K Ultra-Crisp Transparent 3D Logo */}
        <img
          src="/assets/hoda-3d-logo-4k.png"
          alt="نشان سه‌بعدی شیشه‌ای ۴K مجتمع آموزشی و قرآنی هدی"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none transform transition-transform filter drop-shadow-[0_14px_26px_rgba(0,0,0,0.35)]"
        />

        {/* 6. Continuous Light Sweep Shimmer Beam across Glass */}
        {motion && (
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-overlay">
            <div className="w-[200%] h-16 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-light-sweep" />
          </div>
        )}

        {/* 7. Dynamic Mouse-Follow Specular Glass Sheen */}
        {isHovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${50 + rotate.y * 1.8}% ${50 - rotate.x * 1.8}%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 65%)`,
            }}
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay transition-opacity duration-150"
          />
        )}
      </div>

      {/* 8. Floating 3D Badge Tooltip on Hover */}
      {isHovered && !isSpinning && size !== 'xs' && size !== 'sm' && (
        <div className="absolute -bottom-8 px-3.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-white border border-turquoise-400/50 text-[11px] font-bold tracking-tight shadow-2xl whitespace-nowrap z-20 pointer-events-none animate-fadeIn flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>نشان سه‌بعدی شیشه‌ای هدی • برای چرخش کلیک کنید</span>
        </div>
      )}
    </div>
  );
}
