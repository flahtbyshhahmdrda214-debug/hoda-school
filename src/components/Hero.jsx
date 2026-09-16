import React from 'react';
import { ChevronDown, Sparkles, GraduationCap, PhoneCall, ArrowLeft } from 'lucide-react';
import { schoolsData } from '../data/schoolsData';
import Hoda3DLogo from './Hoda3DLogo';

export default function Hero({ onSelectSchool, onScrollToNews, onScrollToIdentity }) {
  const schoolStyles = {
    1: {
      text: 'text-navy-950',
      accent: 'text-blue-600',
      glow: 'from-blue-500/25 to-indigo-500/0',
      hoverBorder: 'hover:border-blue-400/80',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      floatAnim: 'animate-float-s1',
      bottomLine: 'bg-gradient-to-r from-transparent via-blue-500 to-transparent',
    },
    2: {
      text: 'text-navy-950',
      accent: 'text-turquoise-600',
      glow: 'from-turquoise-500/25 to-emerald-500/0',
      hoverBorder: 'hover:border-turquoise-400/80',
      badgeBg: 'bg-turquoise-50 text-turquoise-700 border border-turquoise-200/60',
      floatAnim: 'animate-float-s2',
      bottomLine: 'bg-gradient-to-r from-transparent via-turquoise-500 to-transparent',
    },
    3: {
      text: 'text-navy-950',
      accent: 'text-slate-600',
      glow: 'from-slate-400/25 to-slate-600/0',
      hoverBorder: 'hover:border-slate-400/80',
      badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200/60',
      floatAnim: 'animate-float-s3',
      bottomLine: 'bg-gradient-to-r from-transparent via-slate-500 to-transparent',
    },
    4: {
      text: 'text-navy-950',
      accent: 'text-indigo-600',
      glow: 'from-indigo-500/25 to-teal-500/0',
      hoverBorder: 'hover:border-indigo-400/80',
      badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
      floatAnim: 'animate-float-s4',
      bottomLine: 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent',
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
        {/* Soft overlay gradient for crisp typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-950/75 pointer-events-none" />
      </div>

      {/* Top Header & 4 Floating School Cards (Redesigned Modern Floating Islands with Motion) */}
      <div className="relative z-10 w-full pt-4 md:pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between pb-3 text-xs md:text-sm font-medium text-slate-800 backdrop-blur-md bg-white/80 rounded-2xl px-4 py-2 mb-4 border border-white/70 shadow-sm">
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

        {/* 4 Modern Motion-Driven Floating Islands (No square bounding box!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 mt-3">
          {schoolsData.map((school) => {
            const style = schoolStyles[school.id];
            return (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-[28px] sm:rounded-[34px] bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-white/80 ${style.hoverBorder} shadow-[0_10px_30px_-6px_rgba(15,36,92,0.1)] hover:shadow-[0_20px_45px_-8px_rgba(15,36,92,0.22)] transition-all duration-500 ease-out transform hover:-translate-y-2 active:scale-95 text-center cursor-pointer overflow-hidden`}
              >
                {/* Ambient Soft Colored Aura Blooming on Hover */}
                <div className={`absolute -top-12 inset-x-0 h-28 bg-gradient-to-b ${style.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Free-Floating 3D Icon with Continuous Staggered Motion (NO SQUARE CONTAINER!) */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 my-1 flex items-center justify-center">
                  {/* Subtle dynamic drop shadow under the 3D element */}
                  <div className="absolute -bottom-1.5 w-12 h-3 bg-navy-950/15 rounded-full blur-sm scale-75 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                  
                  <img
                    src={school.icon3d}
                    alt={school.shortName}
                    className={`w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-out group-hover:scale-115 group-hover:-translate-y-2 pointer-events-none ${style.floatAnim}`}
                  />
                </div>

                {/* Typography Hierarchy */}
                <div className="relative z-10 flex flex-col items-center mt-1">
                  {/* Primary Title */}
                  <span className="text-base sm:text-lg md:text-xl font-black text-navy-950 tracking-tight transition-colors group-hover:text-turquoise-700">
                    {school.shortName}
                  </span>

                  {/* Subtitle Grade */}
                  <span className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-1 font-medium group-hover:text-slate-900">
                    {school.tag.split('(')[0]}
                  </span>
                </div>

                {/* Interactive Micro Action Pill with Animated Arrow */}
                <div className="relative z-10 mt-3 pt-2.5 w-full flex items-center justify-center border-t border-slate-100/90">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${style.badgeBg} group-hover:shadow-sm transition-all duration-300`}>
                    <span>ورود به پنل</span>
                    <ArrowLeft className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </div>

                {/* Bottom Active Accent Line */}
                <div className={`absolute bottom-0 inset-x-0 h-[2.5px] ${style.bottomLine} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Section: 3D Hoda Medallion + Typography and Slogan */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto py-8 md:py-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Interactive 3D Hoda Logo Medallion (4K, Ultra Clean, Large & Motion-enabled) */}
          <div className="mb-2 sm:mb-4">
            <Hoda3DLogo size="xl" motion={true} />
          </div>

          {/* Main Title matching reference photo */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight drop-shadow-sm font-vazir">
            مجتمع آموزشی قرآنی هدی
          </h1>

          {/* Decorative Divider Lines with Subtitle */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-3 sm:mt-4 max-w-xl mx-auto">
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-navy-900 to-transparent rounded-full" />
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-navy-900 tracking-wide">
              با هم برای فردای بهتر
            </p>
            <span className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-navy-900 to-transparent rounded-full" />
          </div>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-800 max-w-lg mx-auto font-medium leading-relaxed bg-white/75 backdrop-blur-sm rounded-full py-1.5 px-5 border border-white/70 shadow-sm">
            تلفیق اصالت تربیتی قرآن کریم با پیشتازی علمی و هوشمندسازی نوین
          </p>

          {/* Fast CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="#fast-consultation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-xl hover:shadow-navy-950/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-turquoise-400" />
              درخواست مشاوره و ثبت‌نام
            </a>
            <a
              href="#schools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/95 hover:bg-white text-navy-950 font-bold text-sm shadow-lg hover:shadow-xl border border-white/90 transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4 text-turquoise-600" />
              بررسی مدارس چهارگانه
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Down Button (Matching circular chevron in photo) */}
      <div className="relative z-10 pb-6 sm:pb-8 flex flex-col items-center justify-center">
        <button
          onClick={handleScrollDown}
          aria-label="اسکرول به بخش بعد"
          className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white border border-white/90 shadow-lg backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-navy-900 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce"
        >
          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
        </button>
        <span className="text-[11px] font-bold text-white/90 drop-shadow-md mt-1.5 tracking-wide">
          مشاهده مدارک معتبر و اخبار
        </span>
      </div>
    </section>
  );
}
