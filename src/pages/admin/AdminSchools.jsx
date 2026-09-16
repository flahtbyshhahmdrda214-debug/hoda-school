import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { School, Edit3, Check, Eye } from 'lucide-react';

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [editingSchool, setEditingSchool] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    const data = await apiRequest('/schools');
    setSchools(data || []);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiRequest(`/schools/${editingSchool.id}`, {
        method: 'PUT',
        body: editingSchool,
      });
      setMessage('تغییرات با موفقیت ذخیره شد');
      setEditingSchool(null);
      loadSchools();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">مدیریت مدارس چهارگانه</h2>
          <p className="text-xs text-slate-500 mt-1">ویرایش اطلاعات، اهداف تربیتی، شماره‌های تماس و پیوندها</p>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-xs border border-emerald-200">
          {message}
        </div>
      )}

      {/* Schools List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schools.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {s.icon3dUrl && <img src={s.icon3dUrl} alt={s.shortName} className="w-12 h-12 object-contain" />}
                <div>
                  <h3 className="text-base font-bold text-navy-950">{s.shortName}</h3>
                  <span className="text-xs text-slate-400 font-mono">{s.slug}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingSchool({ ...s })}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-turquoise-50 hover:text-turquoise-700 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {s.subtitle || s.overview}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>تلفن: {s.phone || 'ثبت نشده'}</span>
              <a href={`/schools/${s.slug}`} target="_blank" rel="noreferrer" className="text-turquoise-600 flex items-center gap-1 hover:underline">
                <Eye className="w-3.5 h-3.5" />
                <span>مشاهده صفحه مدرسه</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">ویرایش اطلاعات {editingSchool.shortName}</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام کامل مدرسه</label>
                <input
                  type="text"
                  value={editingSchool.fullName || ''}
                  onChange={(e) => setEditingSchool({ ...editingSchool, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان کوتاه زیرنویس</label>
                <input
                  type="text"
                  value={editingSchool.subtitle || ''}
                  onChange={(e) => setEditingSchool({ ...editingSchool, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تلفن تماس</label>
                  <input
                    type="text"
                    value={editingSchool.phone || ''}
                    onChange={(e) => setEditingSchool({ ...editingSchool, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل اختصاصی</label>
                  <input
                    type="email"
                    value={editingSchool.email || ''}
                    onChange={(e) => setEditingSchool({ ...editingSchool, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نشانی پستی</label>
                <input
                  type="text"
                  value={editingSchool.address || ''}
                  onChange={(e) => setEditingSchool({ ...editingSchool, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح معرفی و چشم‌انداز</label>
                <textarea
                  rows={4}
                  value={editingSchool.overview || ''}
                  onChange={(e) => setEditingSchool({ ...editingSchool, overview: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors flex items-center gap-2"
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
