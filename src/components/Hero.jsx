import React from 'react';
import { ChevronDown, Sparkles, GraduationCap, PhoneCall, ArrowLeft } from 'lucide-react';
import { schoolsData } from '../data/schoolsData';
import Hoda3DLogo from './Hoda3DLogo';

export default function Hero({ onSelectSchool, onScrollToNews, onScrollToIdentity }) {
  const schoolStyles = {
    1: {
      text: 'text-navy-900',
      border: 'border-navy-200/90',
      hoverBorder: 'hover:border-navy-600',
      bg: 'bg-navy-50/90',
      tagBg: 'text-navy-900 bg-navy-100/70',
      shadow: 'hover:shadow-navy-300/40',
    },
    2: {
      text: 'text-turquoise-800',
      border: 'border-turquoise-200/90',
      hoverBorder: 'hover:border-turquoise-500',
      bg: 'bg-turquoise-50/90',
      tagBg: 'text-turquoise-800 bg-turquoise-100/70',
      shadow: 'hover:shadow-turquoise-300/40',
    },
    3: {
      text: 'text-slate-800',
      border: 'border-slate-300/90',
      hoverBorder: 'hover:border-slate-600',
      bg: 'bg-slate-100/90',
      tagBg: 'text-slate-800 bg-slate-200/70',
      shadow: 'hover:shadow-slate-400/30',
    },
    4: {
      text: 'text-navy-950',
      border: 'border-turquoise-300/90',
      hoverBorder: 'hover:border-navy-800',
      bg: 'bg-gradient-to-br from-navy-50/90 to-turquoise-50/90',
      tagBg: 'text-navy-900 bg-turquoise-100/80',
      shadow: 'hover:shadow-turquoise-400/30',
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

      {/* Top Header & 4 Floating School Cards (Exact match to reference photo) */}
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

        {/* 4 School Cards matching the top cards in the user image */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-2">
          {schoolsData.map((school) => {
            const style = schoolStyles[school.id];
            return (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border-2 ${style.border} ${style.hoverBorder} shadow-lg ${style.shadow} transition-all duration-300 transform hover:-translate-y-1.5 active:scale-95 text-center cursor-pointer`}
              >
                {/* 3D Soft Clay Icon inside rounded container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50/90 border border-slate-200/80 p-1 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110 shadow-sm overflow-hidden">
                  <img
                    src={school.icon3d}
                    alt={school.shortName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Primary Card Title (e.g. مدرسهٔ اول) */}
                <span className="text-base sm:text-lg md:text-xl font-black text-navy-950 tracking-tight transition-colors group-hover:text-turquoise-700">
                  {school.shortName}
                </span>

                {/* Secondary subtitle descriptor */}
                <span className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-1 font-medium group-hover:text-slate-900">
                  {school.tag.split('(')[0]}
                </span>

                {/* Micro Action Pill */}
                <span className={`mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.tagBg} opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                  <span>ورود به پنل</span>
                  <ArrowLeft className="w-2.5 h-2.5" />
                </span>
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
