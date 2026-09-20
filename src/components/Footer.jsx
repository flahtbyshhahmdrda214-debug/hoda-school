import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  ChevronLeft,
  Activity,
  Heart
} from 'lucide-react';
import { schoolsData } from '../data/schoolsData';
import { fetchSchools } from '../services/schoolsService';
import { fetchSettings } from '../services/settingsService';
import { onDataChanged } from '../services/dataEvents';
import Hoda3DLogo from './Hoda3DLogo';

export default function Footer({ onSelectSchool }) {
  const [schools, setSchools] = useState(schoolsData);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSchools().then(data => {
      if (Array.isArray(data) && data.length > 0) setSchools(data);
    });
    fetchSettings().then(data => {
      if (data) setSettings(data);
    });

    const unsub = onDataChanged(() => {
      fetchSchools().then(data => {
        if (Array.isArray(data) && data.length > 0) setSchools(data);
      });
      fetchSettings().then(data => {
        if (data) setSettings(data);
      });
    });
    return unsub;
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tickerItems = [
    { icon: '📖', text: '«وَقُلْ رَبِّ زِدْنِي عِلْمًا» (طه: ۱۱۴)', highlight: true },
    { icon: '✨', text: 'مجتمع آموزشی قرآنی هدی • با هم برای فردای بهتر', highlight: false },
    { icon: '🌿', text: 'تلفیق دانش نوین روز با معارف نورانی و اخلاق قرآنی', highlight: false },
    { icon: '🏫', text: 'چهار مدرسه مستقل: پیش‌دبستان، دبستان دوره اول و دوم، دبیرستان', highlight: true },
    { icon: '💎', text: '«يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ»', highlight: false },
    { icon: '🏆', text: 'پیشتاز در افتخارات علمی، فرهنگی، قرآنی و ورزشی', highlight: false },
    { icon: '🤝', text: 'پیوند همیشگی خانه و مدرسه در مسیر تربیت بالنده', highlight: true }
  ];

  return (
    <footer id="contact" className="bg-navy-950 text-white relative overflow-hidden">
      
      {/* 1. Top Undulating Waves (موج‌های متحرک و زنده بالای فوتر) */}
      <div className="w-full overflow-hidden leading-none relative -mb-1 select-none pointer-events-none">
        <svg 
          className="relative block w-[200%] h-12 sm:h-16 lg:h-20 text-navy-950" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          {/* Layer 1: Translucent Cyan Wave */}
          <path 
            d="M0,35 C150,90 350,-10 600,35 C750,90 950,-10 1200,35 L1200,120 L0,120 Z" 
            className="fill-turquoise-500/20 animate-wave-flow-1" 
          />
          {/* Layer 2: Deeper Navy Wave */}
          <path 
            d="M0,50 C200,10 400,95 600,50 C800,10 1000,95 1200,50 L1200,120 L0,120 Z" 
            className="fill-navy-900/60 animate-wave-flow-2" 
          />
          {/* Layer 3: Solid Navy Wave Base */}
          <path 
            d="M0,65 C150,35 450,95 600,65 C750,35 1050,95 1200,65 L1200,120 L0,120 Z" 
            className="fill-navy-950 animate-wave-flow-3" 
          />
        </svg>
      </div>

      {/* 2. Infinite Flowing Marquee Ribbon (نوار متحرک سخنان و پیام‌ها) */}
      <div className="w-full bg-navy-900/90 border-y border-navy-800/80 py-3 overflow-hidden backdrop-blur-md relative z-10">
        <div className="animate-marquee-continuous flex items-center whitespace-nowrap text-xs sm:text-sm">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 mx-6">
              <span className="text-base">{item.icon}</span>
              <span className={item.highlight ? 'text-turquoise-300 font-bold drop-shadow-sm' : 'text-slate-300 font-medium'}>
                {item.text}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 inline-block mr-3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Ambient Breathing Glows in Background */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none animate-footer-orb" />
      <div className="absolute bottom-16 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-footer-orb" style={{ animationDelay: '3.5s' }} />
      <div className="absolute inset-0 islamic-subtle-pattern opacity-10 pointer-events-none" />

      {/* 4. Main Footer Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        
        {/* Top Direct Contact Grid for All 4 Schools */}
        <div className="mb-14 pb-12 border-b border-navy-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise-500/10 border border-turquoise-500/30 text-turquoise-400 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span>ارتباط مستقیم و هوشمند با شعب</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                شماره‌های تماس اختصاصی هر مدرسه
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              جهت هماهنگی ثبت‌نام، مشاوره تحصیلی و ارتباط با مدیریت هر یک از واحدهای آموزشی مجتمع هدی با شماره مستقیم همان واحد تماس حاصل فرمایید.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {schools.map((school) => (
              <div
                key={school.id}
                className="group relative bg-slate-900/90 rounded-2xl p-4.5 border border-slate-800 hover:border-turquoise-500/60 hover:shadow-[0_12px_30px_-5px_rgba(13,148,136,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Gentle Shimmer on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-black text-turquoise-400 px-2.5 py-0.5 rounded-lg bg-turquoise-500/10 border border-turquoise-500/20">
                      {school.shortName}
                    </span>
                    <button
                      onClick={() => onSelectSchool && onSelectSchool(school)}
                      className="text-[11px] text-slate-400 hover:text-turquoise-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer group-hover:translate-x-[-2px]"
                    >
                      <span>ورود به پنل</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-turquoise-300 transition-colors">
                    {school.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {school.address}
                  </p>
                </div>

                <a
                  href={`tel:${school.phone}`}
                  dir="ltr"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/90 group-hover:bg-turquoise-600 text-turquoise-300 group-hover:text-white font-mono text-xs font-bold border border-slate-700/80 group-hover:border-turquoise-500 transition-all duration-300 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 animate-phone-ring" />
                  <span>{school.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-14">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Hoda3DLogo size="sm" interactive={false} className="!w-14 !h-14 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <span>مجتمع آموزشی قرآنی هدی</span>
                </h4>
                <p className="text-xs text-turquoise-400 font-semibold mt-0.5">
                  با هم برای فردای بهتر
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-justify">
              مجتمع آموزشی قرآنی هدی به عنوان یکی از پیشتازان تلفیق آموزش‌های قرآنی و متدهای علمی روز، با برخورداری از ۴ مدرسه مستقل در تمامی مقاطع، بستری شایسته برای رشد همه‌جانبه، علمی و اخلاقی فرزندان ایران اسلامی فراهم آورده است.
            </p>

            {/* Social channels (Iranian & global) */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-300 block mb-2.5">
                کانال‌های رسمی در پیام‌رسان‌ها:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <a 
                  href={settings.socials?.eitaa || settings.social_eitaa || "https://eitaa.com/hodaschool"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-turquoise-500 hover:scale-105"
                >
                  کانال ایتا (Eitaa)
                </a>
                <a 
                  href={settings.socials?.bale || settings.social_bale || "https://ble.ir/hodaschool"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-turquoise-500 hover:scale-105"
                >
                  پیام‌رسان بله (Bale)
                </a>
                <a 
                  href={settings.socials?.shad || settings.social_shad || "https://shad.ir/hodaschool"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-turquoise-500 hover:scale-105"
                >
                  شاد (Shad)
                </a>
                <a 
                  href={settings.socials?.aparat || settings.social_aparat || "https://aparat.com/hodaschool"} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-turquoise-500 hover:scale-105"
                >
                  آپارات (Aparat)
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-sm font-bold text-white border-r-2 border-turquoise-500 pr-2">
              دسترسی سریع
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#schools" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>مدارس چهارگانه هدی</span>
                </a>
              </li>
              <li>
                <a href="#honors" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>تالار افتخارات و دستاوردها</span>
                </a>
              </li>
              <li>
                <a href="#members" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>ارکان و مدیران مجتمع</span>
                </a>
              </li>
              <li>
                <a href="#credentials-section" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>اسناد و مجوزهای رسمی</span>
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>اخبار مهم و اطلاعیه‌ها</span>
                </a>
              </li>
              <li>
                <a href="#identity" className="hover:text-turquoise-400 transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-turquoise-400 transition-colors" />
                  <span>هویت و فلسفه آموزشی</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Central Office Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-sm font-bold text-white border-r-2 border-turquoise-500 pr-2">
              دبیرخانه مرکزی و ستاد
            </h5>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-turquoise-400 flex-shrink-0 mt-0.5" />
                <span>{settings.contact?.centralOfficeAddress || settings.central_address || 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span dir="ltr" className="font-mono text-slate-300">{settings.contact?.centralOfficePhone || settings.central_phone || '۰۲۱-۷۷۲۴۱۰۰۰'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span className="font-mono text-slate-300">{settings.contact?.centralOfficeEmail || settings.central_email || 'info@hoda-complex.ir'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span>{settings.contact?.workingHours || settings.working_hours || 'شنبه تا چهارشنبه ۷:۰۰ الی ۱۶:۰۰ | پنج‌شنبه‌ها ۷:۰۰ الی ۱۳:۰۰'}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Official Enamad & Trust Badges (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-sm font-bold text-white border-r-2 border-turquoise-500 pr-2">
              تاییدیه و نمادهای معتبر
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              دارای مجوز قطعی از وزارت آموزش و پرورش و منطبق بر استانداردهای بین‌المللی کیفیت آموزش.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-all flex flex-col items-center justify-center text-center group">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-300 font-bold">مجوز آموزش و پرورش</span>
                <span className="text-[9px] text-slate-500">کد: ۳۴۸۲/م</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-turquoise-500/40 hover:shadow-[0_4px_20px_rgba(13,148,136,0.15)] transition-all flex flex-col items-center justify-center text-center group">
                <GraduationCap className="w-8 h-8 text-turquoise-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-300 font-bold">سازمان مدارس نمونه</span>
                <span className="text-[9px] text-slate-500">رتبه الف ممتاز</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Online Status & Back to Top */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
            <span>تمام حقوق مادی و معنوی این وب‌سایت محفوظ و متعلق به <strong>مجتمع آموزشی قرآنی هدی</strong> می‌باشد © ۱۴۰۴</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>سامانه برخط فعال است</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-turquoise-600 text-slate-300 hover:text-white text-xs font-bold transition-all duration-300 border border-slate-800 hover:border-turquoise-500 shadow-md cursor-pointer hover:shadow-[0_4px_15px_rgba(13,148,136,0.3)]"
          >
            <span>بازگشت به بالا</span>
            <ArrowUp className="w-3.5 h-3.5 text-turquoise-400 group-hover:text-white group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </footer>
  );
}
