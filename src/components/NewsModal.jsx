import React from 'react';
import { X, Calendar, Clock, Tag, Share2, ArrowLeft } from 'lucide-react';

export default function NewsModal({ news, onClose }) {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* News Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 shadow ${news.badgeClass}`}>
              {news.category}
            </span>
            <h3 className="text-lg sm:text-2xl font-black leading-snug">
              {news.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-turquoise-400" />
                {news.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                زمان مطالعه: {news.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* News Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="p-4 rounded-2xl bg-turquoise-50/50 border border-turquoise-100 text-slate-700 text-sm font-semibold leading-relaxed">
            {news.summary}
          </div>

          <div className="text-sm sm:text-base text-slate-700 leading-loose space-y-4">
            <p>{news.content}</p>
            <p>
              مجتمع آموزشی قرآنی هدی همواره در تلاش است تا با بهره‌گیری از اساتید فرهیخته، جدیدترین ابزارهای کمک‌آموزشی و فضایی مبتنی بر آموزه‌های نورانی وحی، بستری ممتاز برای رشد همه‌جانبه فرزندان این مرز و بوم پدید آورد.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>منبع: روابط عمومی مجتمع هدی</span>
            <span>انتشار در پرتال خبری مدارس چهارگانه</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
          >
            بستن خبر
          </button>
        </div>

      </div>
    </div>
  );
}
