import React from 'react';
import { ChevronDown, Sparkles, GraduationCap, PhoneCall, ArrowLeft, BookOpen } from 'lucide-react';
import { schoolsData } from '../data/schoolsData';
import Hoda3DLogo from './Hoda3DLogo';

export default function Hero({ onSelectSchool, onScrollToNews, onScrollToIdentity }) {
  const schoolStyles = {
    1: {
      text: 'text-white',
      accent: 'text-blue-400',
      glow: 'from-blue-400/40 to-indigo-500/0',
      badgeBorder: 'border-blue-400/40 group-hover:border-blue-300',
      floatAnim: 'animate-float-s1',
      shadowAnim: 'animate-shadow-s1',
    },
    2: {
      text: 'text-white',
      accent: 'text-blue-300',
      glow: 'from-blue-600/40 to-indigo-700/0',
      badgeBorder: 'border-blue-400/40 group-hover:border-blue-300',
      floatAnim: 'animate-float-s2',
      shadowAnim: 'animate-shadow-s2',
    },
    3: {
      text: 'text-white',
      accent: 'text-turquoise-300',
      glow: 'from-turquoise-400/40 to-teal-500/0',
      badgeBorder: 'border-turquoise-400/40 group-hover:border-turquoise-300',
      floatAnim: 'animate-float-s3',
      shadowAnim: 'animate-shadow-s3',
    },
    4: {
      text: 'text-white',
      accent: 'text-indigo-400',
      glow: 'from-indigo-400/40 to-purple-500/0',
      badgeBorder: 'border-indigo-400/40 group-hover:border-indigo-300',
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
    <section className="relative w-full min-h-[96vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* Background Image: The authentic campus building photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.png"
          alt="ساختمان و محوطه مجتمع آموزشی قرآنی هدی"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000 ease-out"
        />
        {/* Multi-layer cinematic dark gradient for crystal-clear readability over photographic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/45 to-slate-950/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />
      </div>

      {/* Top Header & 4 Floating School Portals */}
      <div className="relative z-10 w-full pt-3 sm:pt-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Info Bar - Frosted Glass with High Contrast Typography */}
        <div className="flex items-center justify-between pb-2 text-xs md:text-sm font-medium text-slate-100 backdrop-blur-xl bg-slate-950/65 rounded-2xl px-4 py-2.5 mb-3 sm:mb-4 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <Hoda3DLogo size="sm" interactive={false} className="!w-7 !h-7" />
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-bold tracking-tight">وب‌سایت رسمی مجتمع آموزشی قرآنی هدی | پیشگام در تربیت قرآنی و سرآمدی علمی</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-slate-200">
            <a href="#schools" className="hover:text-turquoise-400 transition-colors font-medium">معرفی مدارس چهارگانه</a>
            <a href="#news" className="hover:text-turquoise-400 transition-colors font-medium">اخبار مهم</a>
            <a href="#identity" className="hover:text-turquoise-400 transition-colors font-medium">هویت قرآنی</a>
            <a href="#contact" className="hover:text-turquoise-300 transition-colors font-bold text-turquoise-400 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-turquoise-400" />
              تماس با شعب
            </a>
          </div>
        </div>

        {/* 4 Borderless Floating 3D School Portals */}
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
                <div className={`absolute top-1 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b ${style.glow} blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-130 transition-all duration-500 pointer-events-none`} />

                {/* Free-Floating 3D Icon with Continuous Staggered Motion */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
                  {/* Subtle levitation contact shadow */}
                  <div className={`absolute -bottom-1.5 w-14 sm:w-16 h-3 bg-black/40 rounded-full blur-md ${style.shadowAnim} group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                  {/* 3D Icon with Levitation and Hover Tilt */}
                  <img
                    src={school.icon3d}
                    alt={school.shortName}
                    className={`w-full h-full object-contain filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:scale-120 group-hover:-translate-y-2 pointer-events-none ${style.floatAnim}`}
                  />
                </div>

                {/* Typography & High-Contrast Glass Capsule */}
                <div className="relative z-10 flex flex-col items-center mt-2">
                  {/* School Title - Crisp White with Deep Text Shadow */}
                  <span className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-turquoise-300">
                    {school.shortName}
                  </span>

                  {/* Sleek Floating Capsule Pill - Frosted Dark Glass for 100% Readability */}
                  <span className={`mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-slate-100 bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-md border ${style.badgeBorder} shadow-xl group-hover:text-white transition-all duration-300`}>
                    <span>{school.tag.split('(')[0].trim()}</span>
                    <ArrowLeft className="w-3 h-3 text-turquoise-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Section: Glassmorphic 3D Hoda Medallion + Typography and Slogan */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto py-4 md:py-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Glassmorphic 3D Hoda Logo Medallion */}
          <div className="mb-2 sm:mb-4">
            <Hoda3DLogo size="xl" motion={true} />
          </div>

          {/* Main Title with Luminous High-Contrast Finish */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] font-vazir">
            مجتمع آموزشی قرآنی هدی
          </h1>

          {/* Decorative Divider Lines with Radiant Turquoise Slogan */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-3 max-w-xl mx-auto">
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-turquoise-400 to-transparent rounded-full shadow-sm" />
            <p className="text-lg sm:text-xl md:text-2xl font-black text-turquoise-300 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              با هم برای فردای بهتر
            </p>
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-turquoise-400 to-transparent rounded-full shadow-sm" />
          </div>

          {/* Mission Capsule with Frosted Dark Glass */}
          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-100 max-w-xl mx-auto font-medium leading-relaxed bg-slate-950/70 hover:bg-slate-950/85 backdrop-blur-xl rounded-full py-2 px-6 border border-white/20 shadow-2xl transition-all">
            تلفیق اصالت تربیتی قرآن کریم با پیشتازی علمی و هوشمندسازی نوین
          </p>

          {/* Institutional Showcase CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-5">
            <a
              href="#schools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-slate-950 font-black text-sm shadow-[0_10px_30px_rgba(20,184,166,0.35)] hover:shadow-[0_14px_35px_rgba(20,184,166,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              بررسی مدارس چهارگانه
            </a>
            <a
              href="#identity"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold text-sm shadow-xl hover:shadow-2xl border border-white/30 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-turquoise-400" />
              هویت قرآنی و افتخارات
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Down Button */}
      <div className="relative z-10 pb-4 sm:pb-6 flex flex-col items-center justify-center">
        <button
          onClick={handleScrollDown}
          aria-label="اسکرول به بخش بعد"
          className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/30 shadow-2xl backdrop-blur-md flex items-center justify-center text-turquoise-300 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce"
        >
          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
        </button>
        <span className="text-xs font-bold text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-1 tracking-wide">
          مشاهده مدارک معتبر و اخبار
        </span>
      </div>
    </section>
  );
}
