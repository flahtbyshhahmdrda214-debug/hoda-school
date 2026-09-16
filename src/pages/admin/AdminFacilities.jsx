import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Building2, Plus, Trash2 } from 'lucide-react';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ schoolId: '', title: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [f, s] = await Promise.all([apiRequest('/facilities'), apiRequest('/schools')]);
    setFacilities(f || []);
    setSchools(s || []);
    if (s && s.length > 0) setForm(prev => ({ ...prev, schoolId: s[0].id }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/facilities', { method: 'POST', body: form });
      setIsModalOpen(false);
      setForm({ ...form, title: '', description: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    try {
      await apiRequest(`/facilities/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">امکانات و فضاهای آموزشی</h2>
          <p className="text-xs text-slate-500 mt-1">مدیریت آزمایشگاه‌ها، کتابخانه‌ها، سالن‌های ورزشی و کارگاه‌ها</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن امکانات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((fac) => (
          <div key={fac.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-navy-950">{fac.title}</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{fac.school?.shortName}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
            </div>
            <button onClick={() => handleDelete(fac.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">افزودن فضای آموزشی جدید</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مدرسه مربوطه</label>
                <select
                  value={form.schoolId}
                  onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                >
                  {schools.map((s) => <option key={s.id} value={s.id}>{s.shortName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان امکانات</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیح کوتاه</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-600">انصراف</button>
                <button type="submit" className="px-5 py-2 bg-turquoise-600 text-white rounded-xl text-xs font-bold">ثبت</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
