import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Laptop, 
  Trophy, 
  ExternalLink,
  BadgeCheck
} from 'lucide-react';
import { credentialsData } from '../data/credentialsData';
import { fetchDocuments } from '../services/documentsService';
import { onDataChanged } from '../services/dataEvents';

const iconMap = {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Laptop,
  Trophy,
};

export default function CredentialsTicker({ onSelectCredential }) {
  const [docs, setDocs] = useState(credentialsData);

  useEffect(() => {
    fetchDocuments().then(data => {
      if (Array.isArray(data) && data.length > 0) setDocs(data);
    });
    const unsub = onDataChanged(() => {
      fetchDocuments().then(data => {
        if (Array.isArray(data) && data.length > 0) setDocs(data);
      });
    });
    return unsub;
  }, []);

  // We duplicate the list to make seamless continuous loop marquee
  const tickerItems = [...docs, ...docs];

  return (
    <section id="credentials-section" className="py-8 bg-slate-900 border-y border-slate-800 text-white overflow-hidden relative">
      {/* Background soft glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-24 bg-navy-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-turquoise-500/20 text-turquoise-400 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                اسناد، مجوزها و گواهینامه‌های رسمی اعتبارسنجی
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30">
                  تایید شده
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                جهت مشاهده تاییدیه و مفاد گواهی، روی هر سند کلیک فرمایید
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            نوار اعتبار پیوسته • حرکت خودکار
          </div>
        </div>
      </div>

      {/* Infinite Marquee Strip */}
      <div className="relative w-full overflow-hidden flex mask-radial">
        {/* Gradient edge fades */}
        <div className="absolute top-0 right-0 w-16 sm:w-28 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-16 sm:w-28 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-continuous flex items-center gap-4 py-2">
          {tickerItems.map((item, index) => {
            const IconComponent = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => onSelectCredential(item)}
                className="group flex-shrink-0 flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-turquoise-500/60 shadow-lg cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 w-[310px] sm:w-[350px]"
              >
                {/* Badge Icon */}
                <div className="w-11 h-11 rounded-xl bg-turquoise-500/15 group-hover:bg-turquoise-500/25 text-turquoise-400 flex items-center justify-center flex-shrink-0 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono text-turquoise-300/80 tracking-wider">
                      {item.code || item.documentNumber || 'HOD'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.date ? item.date.split('(')[0] : '۱۴۰۳'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-turquoise-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    {item.issuer}
                  </p>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-turquoise-400 transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
