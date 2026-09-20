import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Calendar, 
  User, 
  ArrowLeft, 
  X,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { fetchAchievements } from '../services/achievementsService';
import { onDataChanged } from '../services/dataEvents';

export default function HonorsSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalHonor, setActiveModalHonor] = useState(null);

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

  const publishedItems = achievements.filter((item) => item.isPublished !== false);

  return (
    <section id="honors" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-turquoise-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-black mb-4 border border-amber-200/80 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>افتخارات و دستاوردهای سراسری</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight font-vazir leading-tight">
            تالار افتخارات مجتمع آموزشی هدی
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            کارنامه درخشان و دستاوردهای ماندگار مجتمع آموزشی قرآنی هدی در عرصه‌های علمی، آموزشی، تربیتی و قرآنی در سطح استان و کشور
          </p>
        </div>

        {/* Honors Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">در حال بارگذاری تالار افتخارات مجتمع...</p>
          </div>
        ) : publishedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedItems.map((honor) => (
              <div
                key={honor.id}
                onClick={() => setActiveModalHonor(honor)}
                className="group bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                <div>
                  {/* Top Row: Year Pill & Institution Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>سال {honor.year || '۱۴۰۳'}</span>
                    </span>

                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Building2 className="w-3 h-3 text-amber-600" />
                      <span>مجتمع هدی</span>
                    </span>
                  </div>

                  {/* Optional Image Banner */}
                  {honor.imageUrl && (
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                      <img
                        src={honor.imageUrl}
                        alt={honor.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Honor Title with Gold Icon */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-base font-black text-navy-950 leading-snug group-hover:text-amber-600 transition-colors">
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
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {honor.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-turquoise-600 group-hover:text-turquoise-700">
                  <span>مشاهده جزئیات دستاورد</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto shadow-xs">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm font-bold">افتخاری برای نمایش ثبت نشده است.</p>
            <p className="text-slate-400 text-xs mt-1">افتخارات جدید از طریق پنل مدیریت ثبت می‌شوند.</p>
          </div>
        )}

      </div>

      {/* Modal View Detail */}
      {activeModalHonor && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalHonor(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>سال {activeModalHonor.year || '۱۴۰۳'}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                مجتمع هدی
              </span>
            </div>

            {/* Image if available */}
            {activeModalHonor.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-64 w-full bg-slate-100 border border-slate-200">
                <img
                  src={activeModalHonor.imageUrl}
                  alt={activeModalHonor.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-amber-50 text-amber-600">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-navy-950 leading-snug">
                {activeModalHonor.title}
              </h3>
            </div>

            {/* Recipient info */}
            {activeModalHonor.recipient && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                <User className="w-4 h-4 text-turquoise-600" />
                <span>دریافت‌کننده یا برگزیده:</span>
                <span className="text-navy-950 font-black">{activeModalHonor.recipient}</span>
              </div>
            )}

            {/* Full description */}
            {activeModalHonor.description && (
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="whitespace-pre-line">{activeModalHonor.description}</p>
              </div>
            )}

            {/* Close action */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalHonor(null)}
                className="px-5 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-bold hover:bg-navy-900 transition-colors cursor-pointer"
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
