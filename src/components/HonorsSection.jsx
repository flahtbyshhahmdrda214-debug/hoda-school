import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  User, 
  ArrowLeft, 
  X, 
  Filter 
} from 'lucide-react';
import { fetchAchievements } from '../services/achievementsService';
import { onDataChanged } from '../services/dataEvents';

export default function HonorsSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [activeModalHonor, setActiveModalHonor] = useState(null);

  const categories = [
    { id: 'all', label: 'همه افتخارات', icon: Trophy },
    { id: 'قرآنی', label: 'مسابقات قرآنی و معارف', icon: BookOpen },
    { id: 'کنکور سراسری', label: 'رتبه‌های برتر کنکور', icon: GraduationCap },
    { id: 'علمی و المپیاد', label: 'المپیادها و جشنواره‌ها', icon: Award },
    { id: 'فرهنگی و ورزشی', label: 'فرهنگی، هنری و ورزشی', icon: Medal },
  ];

  const schoolFilters = [
    { id: 'all', label: 'همه مقاطع هدی' },
    { id: 'boys-elementary', label: 'دبستان پسرانه' },
    { id: 'boys-highschool', label: 'دبیرستان پسرانه' },
    { id: 'girls-elementary', label: 'دبستان دخترانه' },
    { id: 'girls-highschool', label: 'دبیرستان دخترانه' },
  ];

  const loadData = () => {
    fetchAchievements().then((data) => {
      if (Array.isArray(data)) {
        setAchievements(data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    const unsub = onDataChanged(() => {
      loadData();
    });
    return unsub;
  }, []);

  const filteredItems = achievements.filter((item) => {
    if (item.isPublished === false) return false;
    
    // Category matching
    if (selectedCategory !== 'all') {
      const matchCat = item.category === selectedCategory || 
        (selectedCategory === 'علمی و المپیاد' && (item.category?.includes('علمی') || item.category?.includes('المپیاد'))) ||
        (selectedCategory === 'قرآنی' && item.category?.includes('قرآن')) ||
        (selectedCategory === 'کنکور سراسری' && item.category?.includes('کنکور'));
      if (!matchCat) return false;
    }

    // School matching
    if (selectedSchool !== 'all') {
      const matchSchool = item.schoolSlug === selectedSchool || item.school?.slug === selectedSchool;
      if (!matchSchool) return false;
    }

    return true;
  });

  const getCategoryStyle = (category) => {
    if (category?.includes('قرآن')) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeBg: 'bg-emerald-500 text-white',
        cardBorder: 'border-emerald-100 hover:border-emerald-300',
        glow: 'hover:shadow-emerald-100/70',
        icon: BookOpen,
        color: 'text-emerald-600',
      };
    }
    if (category?.includes('کنکور')) {
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        badgeBg: 'bg-blue-600 text-white',
        cardBorder: 'border-blue-100 hover:border-blue-300',
        glow: 'hover:shadow-blue-100/70',
        icon: GraduationCap,
        color: 'text-blue-600',
      };
    }
    if (category?.includes('المپیاد') || category?.includes('علمی')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-500 text-white',
        cardBorder: 'border-amber-100 hover:border-amber-300',
        glow: 'hover:shadow-amber-100/70',
        icon: Award,
        color: 'text-amber-500',
      };
    }
    return {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      badgeBg: 'bg-purple-600 text-white',
      cardBorder: 'border-purple-100 hover:border-purple-300',
      glow: 'hover:shadow-purple-100/70',
      icon: Trophy,
      color: 'text-purple-600',
    };
  };

  return (
    <section id="honors" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-turquoise-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-black mb-4 border border-amber-200/80 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>افتخارآفرینان و سرآمدان مجتمع هدی</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight font-vazir leading-tight">
            تالار افتخارات و دستاوردها
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            کارنامه‌ای درخشان از رتبه‌های برتر کنکور سراسری، مدال‌های المپیاد، افتخارات قرآنی کشوری و دستاوردهای علمی نخبگان هدی
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-navy-950 text-white shadow-md shadow-navy-900/20 scale-102'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary School Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <div className="flex items-center gap-1 text-xs text-slate-400 pl-2">
            <Filter className="w-3.5 h-3.5" />
            <span>مقطع:</span>
          </div>
          {schoolFilters.map((sc) => {
            const isSelected = selectedSchool === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedSchool(sc.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-turquoise-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-500 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        {/* Honors Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">در حال بارگذاری تالار افتخارات...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((honor) => {
              const style = getCategoryStyle(honor.category);
              const Icon = style.icon;

              return (
                <div
                  key={honor.id}
                  onClick={() => setActiveModalHonor(honor)}
                  className={`group bg-white rounded-3xl p-6 border-2 ${style.cardBorder} shadow-sm hover:shadow-xl ${style.glow} transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1`}
                >
                  <div>
                    {/* Top Row: Year Pill & Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>سال {honor.year}</span>
                      </span>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${style.bg}`}>
                        {honor.category}
                      </span>
                    </div>

                    {/* Optional Image Banner */}
                    {honor.imageUrl && (
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                        <img
                          src={honor.imageUrl}
                          alt={honor.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Honor Title with Gold/Accent Icon */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${style.color}`} />
                      </div>
                      <h3 className="text-base font-black text-navy-950 leading-snug group-hover:text-turquoise-800 transition-colors">
                        {honor.title}
                      </h3>
                    </div>

                    {/* Recipient */}
                    {honor.recipient && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <User className="w-3.5 h-3.5 text-turquoise-600" />
                        <span>دریافت‌کننده: {honor.recipient}</span>
                      </div>
                    )}

                    {/* Description excerpt */}
                    {honor.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {honor.description}
                      </p>
                    )}
                  </div>

                  {/* Footer: School Tag & Action hint */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {honor.schoolName || honor.school?.shortName || 'مجتمع هدی'}
                    </span>
                    <span className="text-turquoise-600 font-bold flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                      <span>مشاهده جزئیات</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto shadow-xs">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">موردی یافت نشد</h4>
            <p className="text-xs text-slate-500 mt-1">
              در دسته‌بندی یا مقطع انتخابی، افتخاری ثبت نشده است.
            </p>
          </div>
        )}

      </div>

      {/* Honor Detail Modal */}
      {activeModalHonor && (
        <div 
          className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModalHonor(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalHonor(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-turquoise-700 block">
                  {activeModalHonor.schoolName || activeModalHonor.school?.shortName || 'مجتمع هدی'}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  دوره تحصیلی / سال {activeModalHonor.year}
                </span>
              </div>
            </div>

            {/* Modal Title */}
            <h3 className="text-lg sm:text-xl font-black text-navy-950 leading-relaxed mb-4">
              {activeModalHonor.title}
            </h3>

            {/* Optional Image in Modal */}
            {activeModalHonor.imageUrl && (
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200">
                <img
                  src={activeModalHonor.imageUrl}
                  alt={activeModalHonor.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Recipient */}
            {activeModalHonor.recipient && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4 flex items-center gap-2.5 text-sm font-bold text-amber-950">
                <Medal className="w-4 h-4 text-amber-600" />
                <span>کسب عنوان توسط: {activeModalHonor.recipient}</span>
              </div>
            )}

            {/* Description */}
            {activeModalHonor.description && (
              <div className="mb-6 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">شرح و جزئیات افتخار:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeModalHonor.description}
                </p>
              </div>
            )}

            {/* Badge & Tags */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                دسته‌بندی: {activeModalHonor.category}
              </span>
              <button
                onClick={() => setActiveModalHonor(null)}
                className="px-5 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
