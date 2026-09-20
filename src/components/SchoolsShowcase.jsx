import React, { useState, useEffect } from 'react';
import { schoolsData } from '../data/schoolsData';
import { fetchSchools } from '../services/schoolsService';
import { onDataChanged } from '../services/dataEvents';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function SchoolsShowcase({ onSelectSchool }) {
  const [schools, setSchools] = useState(schoolsData);

  useEffect(() => {
    fetchSchools().then(data => {
      if (Array.isArray(data) && data.length > 0) setSchools(data);
    });
    const unsub = onDataChanged(() => {
      fetchSchools().then(data => {
        if (Array.isArray(data) && data.length > 0) setSchools(data);
      });
    });
    return unsub;
  }, []);

  const badgeVariants = {
    1: {
      gradient: 'from-blue-600 to-indigo-700',
      lightBg: 'bg-blue-50/80 hover:bg-blue-50',
      border: 'border-blue-200 hover:border-blue-400',
      accent: 'text-blue-700',
      badge: 'bg-blue-100/80 text-blue-800',
      glow: 'group-hover:shadow-blue-200/60',
    },
    2: {
      gradient: 'from-[#0b2246] to-[#1e5eb4]',
      lightBg: 'bg-sky-50/80 hover:bg-sky-50',
      border: 'border-sky-200 hover:border-sky-400',
      accent: 'text-sky-800',
      badge: 'bg-sky-100/80 text-sky-900',
      glow: 'group-hover:shadow-sky-200/60',
    },
    3: {
      gradient: 'from-turquoise-600 to-teal-700',
      lightBg: 'bg-turquoise-50/80 hover:bg-turquoise-50',
      border: 'border-turquoise-200 hover:border-turquoise-400',
      accent: 'text-turquoise-700',
      badge: 'bg-turquoise-100/80 text-turquoise-800',
      glow: 'group-hover:shadow-turquoise-200/60',
    },
    4: {
      gradient: 'from-indigo-600 to-purple-700',
      lightBg: 'bg-indigo-50/80 hover:bg-indigo-50',
      border: 'border-indigo-200 hover:border-indigo-400',
      accent: 'text-indigo-700',
      badge: 'bg-indigo-100/80 text-indigo-900',
      glow: 'group-hover:shadow-indigo-200/60',
    },
  };

  return (
    <section id="schools" className="py-12 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/60">
          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise-50 text-turquoise-800 text-xs font-bold mb-1.5 border border-turquoise-200">
              <Sparkles className="w-3.5 h-3.5 text-turquoise-600" />
              <span>دسترسی سریع به مقاطع تحصیلی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight font-vazir">
              مدارس چهارگانه مجتمع هدی
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            برای مشاهده معرفی و امکانات هر مقطع، روی آیکون آن کلیک کنید
          </span>
        </div>

        {/* 4 Schools Compact Icon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {schools.map((school) => {
            const v = badgeVariants[school.id] || badgeVariants[1];
            const iconUrl = school.icon3d || school.icon3dUrl || '/assets/icon-school1.png';
            const cleanTag = (school.tag || '').split('(')[0].trim() || 'پیش‌دبستان تا کنکور';

            return (
              <button
                key={school.id}
                onClick={() => onSelectSchool && onSelectSchool(school)}
                className={`group text-right p-4 sm:p-5 rounded-3xl ${v.lightBg} border-2 ${v.border} transition-all duration-300 shadow-xs hover:shadow-xl ${v.glow} transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer relative overflow-hidden focus:outline-none`}
              >
                {/* School 3D Icon Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/70 rounded-full blur-xl scale-75 group-hover:scale-110 transition-transform duration-500" />
                  <img
                    src={iconUrl}
                    alt={school.shortName}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] transform group-hover:scale-115 group-hover:-translate-y-1 transition-all duration-300"
                  />
                </div>

                {/* School Name */}
                <h3 className="text-sm sm:text-base font-black text-navy-950 group-hover:text-turquoise-700 transition-colors">
                  {school.shortName}
                </h3>

                {/* Tag / Stage */}
                <span className={`mt-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${v.badge}`}>
                  {cleanTag}
                </span>

                {/* Quick Link Hint */}
                <span className="mt-3 text-[11px] font-bold text-slate-500 group-hover:text-turquoise-600 flex items-center gap-1 transition-colors">
                  <span>مشاهده جزئیات</span>
                  <ArrowLeft className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
