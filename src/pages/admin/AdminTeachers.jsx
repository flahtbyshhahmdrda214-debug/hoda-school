import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Users, Plus, Trash2 } from 'lucide-react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    schoolId: '',
    firstName: '',
    lastName: '',
    roleTitle: '',
    degree: '',
    experience: '',
    highlight: '',
    avatarUrl: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [t, s] = await Promise.all([
      apiRequest('/teachers'),
      apiRequest('/schools')
    ]);
    setTeachers(t || []);
    setSchools(s || []);
    if (s && s.length > 0) {
      setForm((prev) => ({ ...prev, schoolId: s[0].id }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/teachers', { method: 'POST', body: form });
      setIsModalOpen(false);
      setForm({ ...form, firstName: '', lastName: '', roleTitle: '', degree: '', experience: '', highlight: '', avatarUrl: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این استاد/معلم اطمینان دارید؟')) return;
    try {
      await apiRequest(`/teachers/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">اساتید و معلمان</h2>
          <p className="text-xs text-slate-500 mt-1">مدیریت اعضای کادر آموزشی مدارس چهارگانه</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>معلم جدید</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-start justify-between">
            <div className="flex items-start gap-3">
              <img
                src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={t.firstName}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-navy-950">{t.firstName} {t.lastName}</h3>
                <p className="text-xs text-turquoise-700 font-medium">{t.roleTitle}</p>
                <span className="inline-block text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {t.school?.shortName}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(t.id)}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">افزودن معلم / استاد جدید</h3>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مدرسه مربوطه</label>
                <select
                  value={form.schoolId}
                  onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.shortName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سمت / درس</label>
                <input
                  type="text"
                  required
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  placeholder="مثال: سرگروه فیزیک و المپیاد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مدرک تحصیلی</label>
                <input
                  type="text"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="مثال: کارشناسی ارشد دانشگاه تهران"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">لینک تصویر پرسنلی</label>
                <input
                  type="text"
                  value={form.avatarUrl}
                  onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  placeholder="/uploads/avatars/teacher.webp"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-600">انصراف</button>
                <button type="submit" className="px-5 py-2 bg-turquoise-600 text-white rounded-xl text-xs font-bold">ثبت معلم</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
