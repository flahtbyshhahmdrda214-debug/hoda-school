import React, { useState } from 'react';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { newsData } from '../data/newsData';

export default function NewsSection({ onSelectNews }) {
  const [activeCategory, setActiveCategory] = useState('همه');

  const categories = ['همه', 'اطلاعیه مهم', 'افتخارات قرآنی', 'توسعه فناوری', 'رویداد و آموزش خانواده'];

  const filteredNews = activeCategory === 'همه'
    ? newsData
    : newsData.filter(item => item.category === activeCategory);

  const importantNews = newsData.find(item => item.isImportant) || newsData[0];

  return (
    <section id="news" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold mb-2">
              <Newspaper className="w-4 h-4 text-turquoise-600" />
              رویدادها و اطلاعیه‌های رسمی
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950 tracking-tight">
              اخبار مهم مجتمع آموزشی قرآنی هدی
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              آخرین گزارش‌ها، تقویم آزمون‌های ورودی، درخشش دانش‌آموزان و برنامه‌های فرهنگی
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Top News Card */}
        {activeCategory === 'همه' && importantNews && (
          <div className="mb-10 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
            {/* Image Column */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
              <img
                src={importantNews.thumbnail}
                alt={importantNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                اطلاعیه فوری
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg font-bold border ${importantNews.badgeClass}`}>
                    {importantNews.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-turquoise-600" />
                    {importantNews.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    زمان مطالعه: {importantNews.readTime}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectNews(importantNews)}
                  className="text-xl sm:text-2xl font-black text-navy-950 hover:text-turquoise-700 transition-colors cursor-pointer leading-snug"
                >
                  {importantNews.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                  {importantNews.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  ثبت‌نام سال تحصیلی ۱۴۰۴-۱۴۰۵
                </span>
                <button
                  onClick={() => onSelectNews(importantNews)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-turquoise-600 hover:text-turquoise-700 group/btn"
                >
                  مطالعه متن کامل اطلاعیه
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-md bg-white/90 shadow ${item.badgeClass}`}>
                    {item.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-turquoise-600" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.readTime}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectNews(item)}
                    className="text-base font-bold text-navy-950 group-hover:text-turquoise-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={() => onSelectNews(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-turquoise-50 hover:text-turquoise-700 text-slate-700 text-xs font-bold transition-all border border-slate-200 hover:border-turquoise-200"
                >
                  مشاهده خبر و جزئیات
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
