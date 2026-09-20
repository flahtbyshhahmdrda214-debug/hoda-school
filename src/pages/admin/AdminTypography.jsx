import React, { useState, useEffect } from 'react';
import { 
  AVAILABLE_FONTS, 
  getActiveFontId, 
  applySiteFont, 
  saveSiteFont 
} from '../../services/fontService';
import { 
  Type, Check, Sparkles, RefreshCw, Eye, Bookmark, 
  Sliders, ArrowRight, ShieldCheck, Layers, BookOpen, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTypography() {
  const [activeFontId, setActiveFontId] = useState(getActiveFontId());
  const [previewFontId, setPreviewFontId] = useState(getActiveFontId());
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customTestText, setCustomTestText] = useState(
    'مجتمع آموزشی قرآنی هدی؛ پرورش نسلی آگاه، متعهد، خلاق و شاداب در سایه‌سار قرآن کریم و عترت طاهرین'
  );

  useEffect(() => {
    const current = getActiveFontId();
    setActiveFontId(current);
    setPreviewFontId(current);
  }, []);

  const handleSelectFont = (fontId) => {
    setPreviewFontId(fontId);
    // Instant live preview on DOM so admin sees the feel immediately
    applySiteFont(fontId);
  };

  const handleSaveFont = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      await saveSiteFont(previewFontId);
      setActiveFontId(previewFontId);
      const chosen = AVAILABLE_FONTS.find(f => f.id === previewFontId);
      setSuccessMessage(`قلم «${chosen?.name || previewFontId}» با موفقیت به عنوان فونت کل وب‌سایت ذخیره و اعمال شد.`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      alert('خطا در ذخیره قلم: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    handleSelectFont('vazirmatn');
    await saveSiteFont('vazirmatn');
    setActiveFontId('vazirmatn');
    setSuccessMessage('قلم پیش‌فرض سایت (وزیرمتن) با موفقیت بازنشانی شد.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const currentPreviewFont = AVAILABLE_FONTS.find(f => f.id === previewFontId) || AVAILABLE_FONTS[0];
  const activeFontObj = AVAILABLE_FONTS.find(f => f.id === activeFontId) || AVAILABLE_FONTS[0];

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-turquoise-700 font-bold text-xs bg-turquoise-50 px-3 py-1.5 rounded-full w-fit border border-turquoise-200">
            <Type className="w-4 h-4" />
            <span>تنظیمات هویت بصری و تایپوگرافی سایت</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-navy-950 tracking-tight">
            مدیریت قلم و فونت کل سایت
          </h1>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
            قلم مورد نظر خود را از میان ۵ فونت اصیل و بهینه‌سازی‌شده فارسی انتخاب نمایید. تغییرات بلافاصله در تمام صفحات مجتمع، سرتیترها، دکمه‌ها و پنل مدیریت اعمال می‌گردد.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="بازنشانی به فونت وزیرمتن"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>

          <button
            onClick={handleSaveFont}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer ${
              previewFontId !== activeFontId
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-turquoise-600 hover:bg-turquoise-500 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {isSaving 
                ? 'در حال ذخیره‌سازی...' 
                : previewFontId !== activeFontId 
                  ? `ذخیره قلم «${currentPreviewFont.name}» برای کل سایت` 
                  : 'ذخیره شده (قلم فعال)'}
            </span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold">{successMessage}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                تغییرات در حافظه محلی، دیتابیس سایت و تمام بخش‌ها اعمال گردید.
              </p>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex-shrink-0"
          >
            مشاهده سایت اصلی
          </Link>
        </div>
      )}

      {/* Active Font Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-lg">
            Aa
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold">قلم فعال کنونی سایت:</div>
            <div className="text-sm font-black text-navy-950 flex items-center gap-1.5">
              <span>{activeFontObj.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({activeFontObj.enName})</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-turquoise-50 text-turquoise-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold">وضعیت بارگذاری فونت‌ها:</div>
            <div className="text-sm font-black text-turquoise-700">
              ۵ فونت رسمی آماده استفاده
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold">پیش‌نمایش زنده:</div>
            <div className="text-sm font-black text-amber-800">
              {previewFontId === activeFontId ? 'مطابق با سایت اصلی' : `در حال تست «${currentPreviewFont.name}»`}
            </div>
          </div>
        </div>
      </div>

      {/* Font Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950">فهرست قلم‌های موجود برای انتخاب</h2>
            <p className="text-xs text-slate-500 mt-0.5">برای مشاهده پیش‌نمایش، بر روی هر فونت کلیک کنید:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVAILABLE_FONTS.map((font) => {
            const isSelected = previewFontId === font.id;
            const isPersisted = activeFontId === font.id;

            return (
              <div
                key={font.id}
                onClick={() => handleSelectFont(font.id)}
                className={`group relative bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? 'border-turquoise-500 shadow-md ring-4 ring-turquoise-500/10 bg-gradient-to-b from-turquoise-50/20 to-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${font.badgeColor}`}>
                    {font.badge}
                  </span>
                  {isPersisted && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-navy-900 text-white flex items-center gap-1 shadow-xs">
                      <Bookmark className="w-3 h-3" />
                      فونت کنونی
                    </span>
                  )}
                </div>

                {/* Font Name & Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className={`text-xl font-bold text-navy-950 ${font.previewClass}`}>
                      {font.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{font.enName}</span>
                  </div>
                  
                  {/* User-defined description */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {font.description}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      {font.tagline}
                    </p>
                  </div>
                </div>

                {/* Live Specimen Preview */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 mb-5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>نمونه حروف و ارقام:</span>
                    <span className="font-mono text-turquoise-400">{font.id}</span>
                  </div>

                  <div className={`space-y-1.5 ${font.previewClass}`}>
                    <p className="text-base font-bold text-white tracking-tight leading-snug">
                      مجتمع آموزشی قرآنی هدی
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {font.sampleVerse}
                    </p>
                    <p className="text-xs text-turquoise-300 font-medium">
                      ارقام فارسی: ۱۲۳۴۵۶۷۸۹۰ | سال تأسیس: ۱۳۸۵
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFont(font.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-turquoise-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>قلم در حال پیش‌نمایش</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده پیش‌نمایش</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Custom Text Tester */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-turquoise-600" />
            <div>
              <h2 className="text-base md:text-lg font-bold text-navy-950">
                میز تست زنده متن دلخواه
              </h2>
              <p className="text-xs text-slate-500">
                متن مورد نظر خود را تایپ نمایید تا فوراً با قلم انتخابی نمایش داده شود:
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
            <span>قلم نمایشی فعلی:</span>
            <span className="text-turquoise-700 font-black">{currentPreviewFont.name}</span>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            rows={2}
            value={customTestText}
            onChange={(e) => setCustomTestText(e.target.value)}
            placeholder="متن دلخواه خود را برای آزمایش در این کادر تایپ کنید..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-turquoise-500 leading-relaxed font-sans"
          />

          <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white shadow-inner border border-navy-800">
            <div className="text-[10px] text-turquoise-400 font-mono mb-2 flex items-center justify-between">
              <span>جلوه متن با قلم {currentPreviewFont.name}:</span>
              <span>font-family: {currentPreviewFont.family}</span>
            </div>
            <div 
              style={{ fontFamily: currentPreviewFont.family }}
              className="text-lg md:text-2xl font-bold leading-relaxed text-white drop-shadow-sm"
            >
              {customTestText || 'متنی وارد نشده است...'}
            </div>
          </div>
        </div>
      </div>

      {/* Website Components Preview Showcase */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Eye className="w-5 h-5 text-turquoise-600" />
          <div>
            <h2 className="text-base md:text-lg font-bold text-navy-950">
              پیش‌نمایش اجزای وب‌سایت در قلم انتخابی ({currentPreviewFont.name})
            </h2>
            <p className="text-xs text-slate-500">
              نحوه نمایش تیترها، دکمه‌ها، کارت‌ها و متون قرآنی سایت اصلی:
            </p>
          </div>
        </div>

        <div 
          style={{ fontFamily: currentPreviewFont.family }}
          className="space-y-6"
        >
          {/* Simulated Hero Section Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-turquoise-950 p-6 md:p-8 text-white">
            <div className="max-w-2xl space-y-4">
              <span className="inline-block bg-turquoise-500/20 text-turquoise-300 text-xs font-bold px-3 py-1 rounded-full border border-turquoise-400/30">
                مجتمع نمونه آموزشی قرآنی پایتخت
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                پرورش انسان‌هایی متفکر، باایمان و تأثیرگذار در جهان فردا
              </h3>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                مجتمع هدی با تکیه بر آموزش‌های قرآنی، رویکرد پژوهش‌محور و مهارت‌آموزی نوین، بستری شاداب و امن برای رشد همه‌جانبه فرزندان شما فراهم ساخته است.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-5 py-2.5 bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-black rounded-xl text-xs shadow-md">
                  ثبت‌نام آنلاین سال تحصیلی
                </button>
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20">
                  معرفی مدارس چهارگانه
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Cards Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-turquoise-600 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>دبستان پیشرو دخترانه هدی</span>
              </div>
              <h4 className="text-base font-bold text-navy-950">
                کسب رتبه نخست جشنواره جابربن حیان و المپیاد ریاضی
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                دانش‌آموزان پایه ششم مجتمع آموزشی هدی با ارائه پروژه‌های خلاقانه علمی و زیست‌محیطی موفق به کسب مدال زرین شدند.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                <Quote className="w-4 h-4" />
                <span>کلام نورانی و شعار تربیتی مجتمع</span>
              </div>
              <p className="text-sm font-bold text-navy-950 leading-relaxed">
                «پیوند مبارک علم و ایمان، کلید فتح قله‌های روشن فرداست.»
              </p>
              <p className="text-[11px] text-slate-500">
                شورای برنامه‌ریزی و هدایت راهبردی مجتمع آموزشی هدی
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Save Bar if not saved */}
      {previewFontId !== activeFontId && (
        <div className="fixed bottom-6 left-6 right-6 md:right-72 z-40 bg-navy-950 text-white p-4 rounded-2xl shadow-2xl border border-navy-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-white">
                قلم «{currentPreviewFont.name}» برای پیش‌نمایش انتخاب شده است.
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                برای ماندگار شدن و اعمال در سراسر سایت، دکمه تایید نهایی را کلیک کنید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleSelectFont(activeFontId)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              onClick={handleSaveFont}
              disabled={isSaving}
              className="px-6 py-2 bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              {isSaving ? 'در حال ذخیره...' : 'تأیید و ذخیره کل سایت'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
