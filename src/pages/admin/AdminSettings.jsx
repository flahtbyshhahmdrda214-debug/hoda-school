import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/apiClient';
import { Save, Check, Type, ArrowLeft } from 'lucide-react';
import { AVAILABLE_FONTS, getActiveFontId, saveSiteFont } from '../../services/fontService';

const INITIAL_SETTINGS = {
  general: {
    siteName: 'مجتمع آموزشی قرآنی هدی',
    establishedYear: '۱۳۸۵'
  },
  typography: {
    fontFamily: 'vazirmatn',
    fontName: 'وزیرمتن'
  },
  contact: {
    centralOfficePhone: '۰۲۱-۷۷۲۴۱۰۰۰',
    centralOfficeEmail: 'info@hoda-complex.ir',
    centralOfficeAddress: 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی',
    workingHours: 'شنبه تا چهارشنبه ۷:۰۰ الی ۱۶:۰۰ | پنج‌شنبه‌ها ۷:۰۰ الی ۱۳:۰۰'
  },
  socials: {
    eitaa: 'https://eitaa.com/hodaschool',
    bale: 'https://ble.ir/hodaschool',
    shad: 'https://shad.ir/hodaschool',
    aparat: 'https://aparat.com/hodaschool'
  }
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [selectedFont, setSelectedFont] = useState(getActiveFontId());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest('/settings').then((data) => {
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          contact: { ...prev.contact, ...(data.contact || {}) },
          socials: { ...prev.socials, ...(data.socials || {}) },
          general: { ...prev.general, ...(data.general || {}) },
        }));
      }
    });
  }, []);

  const handleSave = async (key) => {
    setSaving(true);
    setMessage('');
    try {
      if (key === 'all') {
        await apiRequest('/settings', {
          method: 'PUT',
          body: settings
        });
      } else {
        await apiRequest(`/settings/${key}`, {
          method: 'PUT',
          body: { value: settings[key] }
        });
      }
      setMessage('تنظیمات با موفقیت ذخیره گردید و در تمام صفحات اعمال شد');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">تنظیمات پایگاه اینترنتی</h2>
          <p className="text-xs text-slate-500 mt-1">مدیریت شماره‌های تماس عمومی، نشانی مرکزی و شبکه‌های اجتماعی</p>
        </div>
        <button
          onClick={() => handleSave('all')}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'در حال ذخیره...' : 'ذخیره کل تنظیمات'}</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-xs border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Site Typography & Font Settings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-turquoise-50 text-turquoise-700 flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-950">قلم و تایپوگرافی رسمی وب‌سایت</h3>
              <p className="text-[11px] text-slate-500">انتخاب قلم فعال سراسر سایت از بین ۵ فونت رسمی و استاندارد فارسی</p>
            </div>
          </div>
          <Link
            to="/admin/typography"
            className="flex items-center gap-1.5 text-xs font-bold text-turquoise-600 hover:text-turquoise-700 bg-turquoise-50 px-3 py-1.5 rounded-xl border border-turquoise-200 hover:bg-turquoise-100 transition-colors"
          >
            <span>میز کار پیشرفته فونت</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {AVAILABLE_FONTS.map((font) => {
            const isSelected = selectedFont === font.id;
            return (
              <div
                key={font.id}
                onClick={async () => {
                  setSelectedFont(font.id);
                  await saveSiteFont(font.id);
                  setMessage(`قلم کل سایت به «${font.name}» تغییر یافت و ذخیره گردید.`);
                  setTimeout(() => setMessage(''), 4000);
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-turquoise-500 bg-turquoise-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base font-bold text-navy-950 ${font.previewClass}`}>
                    {font.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${font.badgeColor}`}>
                    {isSelected ? 'قلم فعال' : font.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {font.description}
                </p>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-1">
                  <span>{font.enName}</span>
                  <span className={isSelected ? 'text-turquoise-600 font-bold' : ''}>
                    {isSelected ? '✓ انتخاب شده' : 'انتخاب'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-navy-950">مشخصات عمومی سامانه</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نام رسمی مجتمع</label>
            <input
              type="text"
              value={settings.general?.siteName || ''}
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">سال تاسیس</label>
            <input
              type="text"
              value={settings.general?.establishedYear || ''}
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, establishedYear: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('general')}
          disabled={saving}
          className="px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition-colors cursor-pointer"
        >
          ذخیره مشخصات عمومی
        </button>
      </div>

      {/* Contact Settings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-navy-950">اطلاعات تماس دفتر مرکزی</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">شماره تلفن مرکزی</label>
            <input
              type="text"
              value={settings.contact?.centralOfficePhone || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, centralOfficePhone: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل مرکزی</label>
            <input
              type="email"
              value={settings.contact?.centralOfficeEmail || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, centralOfficeEmail: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">آدرس دفتر مرکزی</label>
            <input
              type="text"
              value={settings.contact?.centralOfficeAddress || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, centralOfficeAddress: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">ساعات کاری ستاد</label>
            <input
              type="text"
              value={settings.contact?.workingHours || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, workingHours: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('contact')}
          disabled={saving}
          className="px-5 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer"
        >
          ذخیره اطلاعات تماس
        </button>
      </div>

      {/* Socials */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-navy-950">پیوند پیام‌رسان‌ها و رسانه‌های داخلی</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال ایتا (Eitaa)</label>
            <input
              type="text"
              value={settings.socials?.eitaa || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, eitaa: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال بله (Bale)</label>
            <input
              type="text"
              value={settings.socials?.bale || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, bale: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال شاد (Shad)</label>
            <input
              type="text"
              value={settings.socials?.shad || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, shad: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-turquoise-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال آپارات (Aparat)</label>
            <input
              type="text"
              value={settings.socials?.aparat || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, aparat: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-turquoise-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('socials')}
          disabled={saving}
          className="px-5 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer"
        >
          ذخیره پیوندهای اجتماعی
        </button>
      </div>
    </div>
  );
}
