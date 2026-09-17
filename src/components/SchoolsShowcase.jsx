import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Trophy, 
  ArrowLeft, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { schoolsData } from '../data/schoolsData';

export default function SchoolsShowcase({ onSelectSchool }) {
  const badgeVariants = {
    1: {
      headerGradient: 'from-blue-700 to-indigo-800',
      tagBg: 'bg-blue-50 text-blue-800 border-blue-200',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      accentColor: 'text-blue-600',
      ring: 'group-hover:border-blue-400',
    },
    2: {
      headerGradient: 'from-[#0b2246] via-[#143e74] to-[#1e5eb4]',
      tagBg: 'bg-blue-50 text-blue-900 border-blue-200',
      btnBg: 'bg-gradient-to-r from-[#0b2246] to-[#1e5eb4] hover:from-[#143e74] hover:to-[#2563eb] text-white',
      accentColor: 'text-blue-700',
      ring: 'group-hover:border-blue-400',
    },
    3: {
      headerGradient: 'from-turquoise-700 to-teal-800',
      tagBg: 'bg-turquoise-50 text-turquoise-800 border-turquoise-200',
      btnBg: 'bg-turquoise-600 hover:bg-turquoise-700 text-white',
      accentColor: 'text-turquoise-600',
      ring: 'group-hover:border-turquoise-400',
    },
    4: {
      headerGradient: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
      tagBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      btnBg: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      accentColor: 'text-indigo-700',
      ring: 'group-hover:border-indigo-400',
    },
  };

  return (
    <section id="schools" className="py-20 bg-white relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-turquoise-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-navy-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-turquoise-50 text-turquoise-800 text-xs font-bold mb-3 border border-turquoise-200">
            <GraduationCap className="w-4 h-4 text-turquoise-600" />
            زنجیره پیوسته آموزش و پرورش نخبگان
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight font-vazir">
            مدارس چهارگانه مجتمع هدی
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            از پیش‌دبستان تا کنکور؛ هر مقطع با کادر اختصاصی، هویت قرآنی و برنامه‌ریزی هدفمند برای موفقیت علمی و تربیتی فرزند شما
          </p>
        </div>

        {/* 4 Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schoolsData.map((school) => {
            const v = badgeVariants[school.id];
            return (
              <div
                key={school.id}
                className={`group bg-white rounded-3xl border-2 border-slate-200 ${v.ring} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  {/* Card Header Banner with color gradient matching the palette */}
                  <div className={`p-6 bg-gradient-to-r ${v.headerGradient} text-white relative overflow-hidden`}>
                    {/* Subtle ambient light orb */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                          {school.shortName}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black mt-2 leading-tight drop-shadow-sm">
                          {school.fullName}
                        </h3>
                      </div>
                      {/* Free-Floating 3D clay icon in banner with motion */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
                        <img
                          src={school.icon3d}
                          alt={school.shortName}
                          className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.3)] transform group-hover:scale-115 group-hover:-translate-y-1 transition-transform duration-500 pointer-events-none"
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                      {school.subtitle}
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                      {school.stats.map((st, i) => (
                        <div key={i} className="text-center">
                          <div className={`text-base sm:text-lg font-black ${v.accentColor}`}>
                            {st.value}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overview Paragraph */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {school.overview}
                    </p>

                    {/* Quranic Feature Highlight */}
                    <div className="p-4 rounded-2xl bg-turquoise-50/50 border border-turquoise-100 mb-6">
                      <div className="flex items-center gap-2 text-turquoise-800 font-bold text-xs sm:text-sm mb-2">
                        <BookOpen className="w-4 h-4 text-turquoise-600" />
                        {school.quranicProgram.title}
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {school.quranicProgram.features.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-turquoise-600 mt-0.5">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highlights of Teachers & Honors */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        معرفی {school.teachers.length} استاد و معلم برجسته
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        {school.honors.length} دستاورد و افتخار ثبت شده
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectSchool(school)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl ${v.btnBg} font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer`}
                  >
                    <span>مشاهده مشخصات جامع {school.shortName} (امکانات، اساتید و افتخارات)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
