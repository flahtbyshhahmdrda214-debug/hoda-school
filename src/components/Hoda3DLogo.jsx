import React, { useState, useRef } from 'react';

export default function Hoda3DLogo({ size = 'md', interactive = true, className = '' }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36',
    lg: 'w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56',
    xl: 'w-52 h-52 sm:w-64 sm:h-64'
  };

  const handleMouseMove = (e) => {
    if (!interactive || isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D tilt calculation (-18deg to +18deg)
    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;
    
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
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: '900px' }}
      className={`relative select-none flex items-center justify-center cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title="نشان سه‌بعدی مجتمع هدی (جهت چرخش ۳بعدی کلیک کنید)"
    >
      {/* Background Soft Aura Glow */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-turquoise-500/30 via-amber-400/25 to-emerald-500/30 blur-2xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100 scale-125' : 'opacity-70 scale-100'
        }`}
      />

      {/* 3D Transform Container */}
      <div
        style={{
          transform: isSpinning
            ? 'rotateY(360deg) scale(1.08)'
            : isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.06)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: isSpinning
            ? 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center filter drop-shadow-2xl"
      >
        {/* 3D Extruded Depth Shadow */}
        <img
          src="/assets/hoda-3d-logo-transparent.png"
          alt="نشان سه‌بعدی مجتمع آموزشی و قرآنی هدی"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] pointer-events-none"
        />

        {/* Dynamic Specular Sheen on Hover */}
        {isHovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${50 + rotate.y * 2}% ${50 - rotate.x * 2}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
            }}
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay transition-opacity duration-200"
          />
        )}
      </div>

      {/* Floating 3D Badge Tooltip on Hover */}
      {isHovered && !isSpinning && (
        <div className="absolute -bottom-7 px-3 py-1 rounded-full bg-navy-950/90 backdrop-blur-md text-white border border-turquoise-400/40 text-[10px] font-bold tracking-tight shadow-xl whitespace-nowrap z-20 pointer-events-none animate-fadeIn">
          مدل سه‌بعدی هدی • کلیک جهت چرخش
        </div>
      )}
    </div>
  );
}
