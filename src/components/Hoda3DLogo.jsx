import React, { useState, useRef, useEffect, useCallback } from 'react';

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
    >
      {/* Outer Levitation Floating Wrapper */}
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          motion && !isHovered && !isSpinning ? 'animate-float-vertical' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main 3D Logo Container with 10-Second 360° Revolution & Ultra-Sharp 4K Rendering */}
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
          className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
        >
          {/* 4K Ultra-Crisp Transparent 3D Logo */}
          <img
            src="/assets/hoda-3d-logo-4k.png"
            alt="نشان سه‌بعدی مجتمع آموزشی و قرآنی هدی"
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

          {/* Continuous Light Sweep Shimmer Beam across Logo */}
          {motion && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-overlay">
              <div className={`w-[200%] h-20 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full ${
                isSpinning ? 'animate-light-sweep duration-1000' : 'animate-light-sweep'
              }`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
