import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Settings, Save, Check } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    general: { siteName: '', establishedYear: '' },
    contact: { centralOfficePhone: '', centralOfficeEmail: '', centralOfficeAddress: '' },
    socials: { eitaa: '', bale: '', shad: '', aparat: '' }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest('/settings').then((data) => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleSave = async (key) => {
    setSaving(true);
    setMessage('');
    try {
      await apiRequest(`/settings/${key}`, {
        method: 'PUT',
        body: { value: settings[key] }
      });
      setMessage('تنظیمات با موفقیت ذخیره گردید');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-navy-950">تنظیمات پایگاه اینترنتی</h2>
        <p className="text-xs text-slate-500 mt-1">مدیریت شماره‌های تماس عمومی، نشانی مرکزی و شبکه‌های اجتماعی</p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-xs border border-emerald-200">
          {message}
        </div>
      )}

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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل مرکزی</label>
            <input
              type="email"
              value={settings.contact?.centralOfficeEmail || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, centralOfficeEmail: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">آدرس دفتر مرکزی</label>
            <input
              type="text"
              value={settings.contact?.centralOfficeAddress || ''}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, centralOfficeAddress: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('contact')}
          disabled={saving}
          className="px-5 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال بله (Bale)</label>
            <input
              type="text"
              value={settings.socials?.bale || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, bale: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال شاد (Shad)</label>
            <input
              type="text"
              value={settings.socials?.shad || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, shad: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">کانال آپارات (Aparat)</label>
            <input
              type="text"
              value={settings.socials?.aparat || ''}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, aparat: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave('socials')}
          disabled={saving}
          className="px-5 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors"
        >
          ذخیره پیوندهای اجتماعی
        </button>
      </div>
    </div>
  );
}
