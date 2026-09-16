import React from 'react';
import { ChevronDown, Sparkles, GraduationCap, PhoneCall, ArrowLeft } from 'lucide-react';
import { schoolsData } from '../data/schoolsData';
import Hoda3DLogo from './Hoda3DLogo';

export default function Hero({ onSelectSchool, onScrollToNews, onScrollToIdentity }) {
  const schoolStyles = {
    1: {
      text: 'text-navy-950',
      accent: 'text-blue-600',
      glow: 'from-blue-400/40 to-indigo-500/0',
      badgeHover: 'group-hover:border-blue-300 group-hover:text-blue-800',
      floatAnim: 'animate-float-s1',
      shadowAnim: 'animate-shadow-s1',
    },
    2: {
      text: 'text-navy-950',
      accent: 'text-turquoise-600',
      glow: 'from-teal-400/40 to-emerald-500/0',
      badgeHover: 'group-hover:border-teal-300 group-hover:text-teal-800',
      floatAnim: 'animate-float-s2',
      shadowAnim: 'animate-shadow-s2',
    },
    3: {
      text: 'text-navy-950',
      accent: 'text-slate-600',
      glow: 'from-cyan-400/35 to-blue-500/0',
      badgeHover: 'group-hover:border-cyan-300 group-hover:text-slate-800',
      floatAnim: 'animate-float-s3',
      shadowAnim: 'animate-shadow-s3',
    },
    4: {
      text: 'text-navy-950',
      accent: 'text-indigo-600',
      glow: 'from-indigo-400/40 to-purple-500/0',
      badgeHover: 'group-hover:border-indigo-300 group-hover:text-indigo-800',
      floatAnim: 'animate-float-s4',
      shadowAnim: 'animate-shadow-s4',
    },
  };

  const handleScrollDown = () => {
    const target = document.getElementById('credentials-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[96vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-slate-900">
      {/* Background Image: The school campus */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.png"
          alt="محوطه مجتمع آموزشی قرآنی هدی"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000 ease-out"
        />
        {/* Soft overlay gradient for crisp typography and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* Top Header & 4 Floating School Icons (Borderless Modern Motion Portals - No Box Container!) */}
      <div className="relative z-10 w-full pt-3 sm:pt-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between pb-2 text-xs md:text-sm font-medium text-slate-800 backdrop-blur-md bg-white/80 rounded-2xl px-4 py-2 mb-3 sm:mb-4 border border-white/70 shadow-sm">
          <div className="flex items-center gap-3">
            <Hoda3DLogo size="sm" interactive={false} className="!w-7 !h-7" />
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-turquoise-500 animate-pulse"></span>
              <span className="text-navy-950 font-bold">پذیرش و پیش‌ثبت‌نام سال تحصیلی ۱۴۰۴-۱۴۰۵ آغاز شد</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-slate-700">
            <a href="#schools" className="hover:text-turquoise-600 transition-colors font-medium">معرفی مدارس چهارگانه</a>
            <a href="#news" className="hover:text-turquoise-600 transition-colors font-medium">اخبار مهم</a>
            <a href="#identity" className="hover:text-turquoise-600 transition-colors font-medium">هویت قرآنی</a>
            <a href="#contact" className="hover:text-turquoise-600 transition-colors font-bold text-navy-950 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-turquoise-600" />
              تماس با شعب
            </a>
          </div>
        </div>

        {/* 4 Borderless Floating 3D School Portals (Zero Box Enclosure - Free Floating & Motion-Driven) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto my-1 sm:my-2">
          {schoolsData.map((school) => {
            const style = schoolStyles[school.id];
            return (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="group relative flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-500 transform hover:-translate-y-2 focus:outline-none"
              >
                {/* Luminous Pulsing Colored Aura */}
                <div className={`absolute top-1 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b ${style.glow} blur-2xl opacity-45 group-hover:opacity-100 group-hover:scale-130 transition-all duration-500 pointer-events-none`} />

                {/* Free-Floating 3D Icon with Continuous Staggered Motion */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
                  {/* Subtle levitation contact shadow that breathes with the float motion */}
                  <div className={`absolute -bottom-1.5 w-14 sm:w-16 h-3 bg-navy-950/25 rounded-full blur-md ${style.shadowAnim} group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                  {/* 3D Icon with Levitation and Hover Tilt */}
                  <img
                    src={school.icon3d}
                    alt={school.shortName}
                    className={`w-full h-full object-contain filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.22)] transition-transform duration-500 ease-out group-hover:scale-120 group-hover:-translate-y-2 pointer-events-none ${style.floatAnim}`}
                  />
                </div>

                {/* Typography & Floating Glass Capsule (No Rigid Box Container!) */}
                <div className="relative z-10 flex flex-col items-center mt-2">
                  {/* School Title */}
                  <span className="text-sm sm:text-base md:text-lg font-black text-navy-950 tracking-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)] transition-colors duration-300 group-hover:text-turquoise-700">
                    {school.shortName}
                  </span>

                  {/* Sleek Floating Capsule Pill */}
                  <span className={`mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-bold text-slate-700 bg-white/75 hover:bg-white backdrop-blur-md border border-white/75 shadow-sm ${style.badgeHover} group-hover:shadow-md transition-all duration-300`}>
                    <span>{school.tag.split('(')[0].trim()}</span>
                    <ArrowLeft className="w-3 h-3 text-turquoise-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Section: 3D Hoda Medallion + Typography and Slogan */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto py-4 md:py-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Interactive 3D Hoda Logo Medallion (4K, Ultra Clean, Large & Motion-enabled) */}
          <div className="mb-2 sm:mb-3">
            <Hoda3DLogo size="xl" motion={true} />
          </div>

          {/* Main Title matching reference photo */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight drop-shadow-sm font-vazir">
            مجتمع آموزشی قرآنی هدی
          </h1>

          {/* Decorative Divider Lines with Subtitle */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-3 max-w-xl mx-auto">
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-navy-900 to-transparent rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-navy-900 tracking-wide">
              با هم برای فردای بهتر
            </p>
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-navy-900 to-transparent rounded-full" />
          </div>

          <p className="mt-2.5 text-xs sm:text-sm md:text-base text-slate-800 max-w-lg mx-auto font-medium leading-relaxed bg-white/75 backdrop-blur-sm rounded-full py-1.5 px-5 border border-white/70 shadow-sm">
            تلفیق اصالت تربیتی قرآن کریم با پیشتازی علمی و هوشمندسازی نوین
          </p>

          {/* Fast CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 sm:mt-5">
            <a
              href="#fast-consultation"
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-xl hover:shadow-navy-950/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-turquoise-400" />
              درخواست مشاوره و ثبت‌نام
            </a>
            <a
              href="#schools"
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-white/95 hover:bg-white text-navy-950 font-bold text-sm shadow-lg hover:shadow-xl border border-white/90 transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4 text-turquoise-600" />
              بررسی مدارس چهارگانه
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Down Button */}
      <div className="relative z-10 pb-4 sm:pb-6 flex flex-col items-center justify-center">
        <button
          onClick={handleScrollDown}
          aria-label="اسکرول به بخش بعد"
          className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white border border-white/90 shadow-lg backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-navy-900 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce"
        >
          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
        </button>
        <span className="text-[11px] font-bold text-white/90 drop-shadow-md mt-1 tracking-wide">
          مشاهده مدارک معتبر و اخبار
        </span>
      </div>
    </section>
  );
}
