import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    documentNumber: '',
    issuer: 'سازمان آموزش و پرورش',
    date: '۱۴۰۳',
    type: 'مجوز رسمی',
    description: '',
    icon: 'ShieldCheck'
  });
  const [saving, setSaving] = useState(false);

  const loadDocs = async () => {
    const data = await apiRequest('/documents');
    setDocuments(data || []);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/documents', { method: 'POST', body: form });
      setIsModalOpen(false);
      setForm({
        title: '',
        documentNumber: '',
        issuer: 'سازمان آموزش و پرورش',
        date: '۱۴۰۳',
        type: 'مجوز رسمی',
        description: '',
        icon: 'ShieldCheck'
      });
      await loadDocs();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این سند اطمینان دارید؟')) return;
    try {
      await apiRequest(`/documents/${id}`, { method: 'DELETE' });
      await loadDocs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">مجوزها و اسناد اعتبار</h2>
          <p className="text-xs text-slate-500 mt-1">مدیریت تاییدیه‌ها، کدهای سازمانی و استانداردهای ایزو</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن سند جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-6 h-6 text-turquoise-600" />
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {doc.documentNumber || doc.code || 'HOD'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-navy-950">{doc.title}</h3>
              <p className="text-xs text-slate-500">{doc.issuer}</p>
              {doc.description && (
                <p className="text-xs text-slate-600 line-clamp-2">{doc.description}</p>
              )}
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>تاریخ: {doc.date || '۱۴۰۳'}</span>
              <button 
                onClick={() => handleDelete(doc.id)} 
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                title="حذف سند"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">افزودن مجوز یا سند رسمی جدید</h3>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سند / مجوز</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: گواهی استاندارد مدیریت کیفیت ISO 9001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره یا شناسه سند</label>
                  <input
                    type="text"
                    required
                    value={form.documentNumber}
                    onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                    placeholder="مثال: HOD-98234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مرجع صادرکننده</label>
                  <input
                    type="text"
                    required
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    placeholder="مثال: سازمان سنجش و پایش کیفیت"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ یا سال صدور</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="مثال: ۱۴۰۳/۰۶/۱۵"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع تاییدیه</label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="مثال: تاییدیه رسمی دولتی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات تکمیلی</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="شرح کوتاه درباره مفاد و اعتبار این مدرک..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer"
                >
                  {saving ? 'در حال ثبت...' : 'ثبت سند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
