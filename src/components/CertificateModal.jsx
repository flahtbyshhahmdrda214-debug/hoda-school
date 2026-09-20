import React from 'react';
import { X, ShieldCheck, Award, CheckCircle2, Calendar, Building, Stamp } from 'lucide-react';

export default function CertificateModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border-4 border-amber-400/30">
        
        {/* Certificate Golden/Official Header */}
        <div className="p-6 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-turquoise-400" />
              <span className="text-xs font-bold tracking-wider text-turquoise-300">
                سند رسمی و معتبر مجتمع هدی
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black mt-3 text-white">
            {item.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            صادرکننده: {item.issuer}
          </p>
        </div>

        {/* Certificate Body (Formal styling) */}
        <div className="p-6 sm:p-8 bg-[#fbfbf9] text-slate-800 relative">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <div className="w-64 h-64 rounded-full border-8 border-navy-900 flex items-center justify-center text-navy-900 text-4xl font-black rotate-[-25deg]">
              هُـدَی
            </div>
          </div>

          {/* Top metadata grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs mb-6">
            <div>
              <span className="text-slate-400 block mb-0.5">شناسه اعتبارسنجی:</span>
              <span className="font-mono font-bold text-navy-950">{item.code}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">تاریخ صدور و تایید:</span>
              <span className="font-semibold text-slate-700">{item.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">نوع تاییدیه:</span>
              <span className="font-semibold text-turquoise-700">{item.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">وضعیت اعتبار:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                فعال و معتبر
              </span>
            </div>
          </div>

          {/* Optional Document Image */}
          {(item.imageUrl || (item.fileUrl && !item.fileUrl.endsWith('.pdf'))) && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
              <img
                src={item.imageUrl || item.fileUrl}
                alt={item.title}
                className="w-full max-h-80 object-contain mx-auto"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-navy-900 mb-2">
              شرح گواهی و دستاورد سازمانی:
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {item.description}
            </p>
          </div>

          {/* Key verification features */}
          <div>
            <h4 className="text-sm font-bold text-navy-900 mb-2">
              شاخص‌های کلیدی احراز صلاحیت:
            </h4>
            <ul className="space-y-2">
              {item.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-turquoise-600 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Stamp & Sign Box */}
          <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-700">دبیرخانه ارزیابی و کیفیت‌سنجی</p>
              <p className="text-[11px] text-slate-400 mt-0.5">سامانه جامع استعلام مدارک آموزشی</p>
            </div>
            <div className="border-2 border-emerald-600/60 rounded-xl px-4 py-1.5 text-center rotate-[-4deg] bg-emerald-50">
              <span className="block text-[10px] text-emerald-800 font-black">مهر تایید رسمی</span>
              <span className="text-[9px] text-emerald-700 font-mono">VERIFIED • HODA</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
}
