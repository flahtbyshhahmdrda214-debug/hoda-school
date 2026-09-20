import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ShieldCheck, 
  GraduationCap
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

  return (
    <footer id="contact" className="bg-navy-950 text-white pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Direct Contact Grid for All 4 Schools */}
        <div className="mb-14 pb-12 border-b border-slate-800">
          <div className="text-center sm:text-right mb-6">
            <span className="text-xs text-turquoise-400 font-bold tracking-wider">
              ارتباط مستقیم با شعب چهارگانه
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              شماره‌های تماس اختصاصی هر مدرسه
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {schools.map((school) => (
              <div
                key={school.id}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-turquoise-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-turquoise-400">
                      {school.shortName}
                    </span>
                    <button
                      onClick={() => onSelectSchool(school)}
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      ورود به پنل
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">
                    {school.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {school.address}
                  </p>
                </div>

                <a
                  href={`tel:${school.phone}`}
                  dir="ltr"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-turquoise-600/20 text-turquoise-300 font-mono text-xs font-bold border border-slate-700 hover:border-turquoise-500 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
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
                <h4 className="text-lg font-black text-white">
                  مجتمع آموزشی قرآنی هدی
                </h4>
                <p className="text-xs text-turquoise-400 font-medium">
                  با هم برای فردای بهتر
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              مجتمع هدی به عنوان یکی از پیشتازان تلفیق آموزش‌های قرآنی و متدهای علمی روز، با برخورداری از ۴ مدرسه مستقل در تمامی مقاطع، بستری شایسته برای رشد همه‌جانبه فرزندان ایران اسلامی فراهم آورده است.
            </p>

            {/* Social channels (Iranian & global) */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">کانال‌های رسمی در پیام‌رسان‌ها:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href={settings.socials?.eitaa || settings.social_eitaa || "https://eitaa.com/hodaschool"} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-colors border border-slate-700">
                  کانال ایتا (Eitaa)
                </a>
                <a href={settings.socials?.bale || settings.social_bale || "https://ble.ir/hodaschool"} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-colors border border-slate-700">
                  پیام‌رسان بله (Bale)
                </a>
                <a href={settings.socials?.shad || settings.social_shad || "https://shad.ir/hodaschool"} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-colors border border-slate-700">
                  شاد (Shad)
                </a>
                <a href={settings.socials?.aparat || settings.social_aparat || "https://aparat.com/hodaschool"} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-turquoise-600 text-slate-300 hover:text-white transition-colors border border-slate-700">
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
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#schools" className="hover:text-turquoise-400 transition-colors">مدارس چهارگانه هدی</a>
              </li>
              <li>
                <a href="#honors" className="hover:text-turquoise-400 transition-colors">تالار افتخارات و دستاوردها</a>
              </li>
              <li>
                <a href="#credentials-section" className="hover:text-turquoise-400 transition-colors">اسناد و مجوزهای رسمی</a>
              </li>
              <li>
                <a href="#news" className="hover:text-turquoise-400 transition-colors">اخبار مهم و اطلاعیه‌ها</a>
              </li>
              <li>
                <a href="#identity" className="hover:text-turquoise-400 transition-colors">هویت و فلسفه آموزشی</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-turquoise-400 transition-colors">اطلاعات تماس با شعب</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Central Office Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-sm font-bold text-white border-r-2 border-turquoise-500 pr-2">
              دبیرخانه مرکزی و ستاد
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-turquoise-400 flex-shrink-0 mt-0.5" />
                <span>{settings.contact?.centralOfficeAddress || settings.central_address || 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span dir="ltr" className="font-mono text-slate-300">{settings.contact?.centralOfficePhone || settings.central_phone || '۰۲۱-۷۷۲۴۱۰۰۰'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span className="font-mono text-slate-300">{settings.contact?.centralOfficeEmail || settings.central_email || 'info@hoda-complex.ir'}</span>
              </div>
              <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-400">
              دارای مجوز قطعی از وزارت آموزش و پرورش و منطبق بر استانداردهای بین‌المللی کیفیت.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1" />
                <span className="text-[10px] text-slate-300 font-bold">مجوز آموزش و پرورش</span>
                <span className="text-[9px] text-slate-500">کد: ۳۴۸۲/م</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                <GraduationCap className="w-8 h-8 text-turquoise-400 mb-1" />
                <span className="text-[10px] text-slate-300 font-bold">سازمان مدارس نمونه</span>
                <span className="text-[9px] text-slate-500">رتبه الف ممتاز</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            تمام حقوق مادی و معنوی این وب‌سایت محفوظ و متعلق به **مجتمع آموزشی قرآنی هدی** می‌باشد © ۱۴۰۴
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>بازگشت به ابتدای صفحه</span>
            <ArrowUp className="w-3.5 h-3.5 text-turquoise-400" />
          </button>
        </div>

      </div>
    </footer>
  );
}
