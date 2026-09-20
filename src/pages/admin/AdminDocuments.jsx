import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Plus, Trash2, Edit, ShieldCheck, FileCheck, X, Eye } from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  const initialForm = {
    title: '',
    documentNumber: '',
    issuer: 'سازمان آموزش و پرورش',
    date: '۱۴۰۳',
    type: 'مجوز رسمی',
    description: '',
    imageUrl: '',
    icon: 'ShieldCheck'
  };

  const [form, setForm] = useState(initialForm);
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
      setForm(initialForm);
      await loadDocs();
    } catch (err) {
      alert(err.message || 'خطا در ثبت سند جدید');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingDoc) return;
    setSaving(true);
    try {
      await apiRequest(`/documents/${editingDoc.id}`, { method: 'PUT', body: editingDoc });
      setEditingDoc(null);
      await loadDocs();
    } catch (err) {
      alert(err.message || 'خطا در به‌روزرسانی سند');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-turquoise-600" />
            <span>مجوزها و اسناد اعتبار</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مدیریت تاییدیه‌ها، کدهای سازمانی، استانداردهای ایزو و تصاویر اسناد رسمی
          </p>
        </div>
        <button
          onClick={() => {
            setForm(initialForm);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن سند جدید</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => {
          const hasImage = doc.imageUrl || (doc.fileUrl && !doc.fileUrl.endsWith('.pdf'));

          return (
            <div 
              key={doc.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Optional Document Image Preview Banner */}
              {hasImage && (
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden border-b border-slate-100 group">
                  <img
                    src={doc.imageUrl || doc.fileUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImageModal(doc.imageUrl || doc.fileUrl)}
                    className="absolute bottom-2 left-2 px-2.5 py-1 bg-navy-950/70 hover:bg-navy-950 text-white rounded-lg text-[11px] font-bold backdrop-blur-sm flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>مشاهده تصویر</span>
                  </button>
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    دارای تصویر سند
                  </span>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-turquoise-50 text-turquoise-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {doc.documentNumber || doc.code || 'HOD'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy-950 leading-snug">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{doc.issuer}</p>
                </div>

                {doc.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>تاریخ: {doc.date || '۱۴۰۳'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingDoc({
                      ...doc,
                      imageUrl: doc.imageUrl || (doc.fileUrl && !doc.fileUrl.endsWith('.pdf') ? doc.fileUrl : ''),
                      documentNumber: doc.documentNumber || doc.code || '',
                    })}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="ویرایش سند و تصویر"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)} 
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="حذف سند"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-turquoise-600" />
                <span>افزودن مجوز یا سند رسمی جدید</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سند / مجوز *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: گواهی استاندارد مدیریت کیفیت ISO 9001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              {/* Image Upload Component */}
              <ImageUploadField
                label="تصویر مدرک یا گواهینامه رسمی"
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                helperText="آپلود مستقیم تصویر مدرک (فرمت‌های JPG، PNG یا WebP)"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره یا شناسه سند</label>
                  <input
                    type="text"
                    required
                    value={form.documentNumber}
                    onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                    placeholder="مثال: HOD-98234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مرجع صادرکننده</label>
                  <input
                    type="text"
                    required
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    placeholder="مثال: سازمان آموزش و پرورش"
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
                  className="px-5 py-2 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'در حال ثبت...' : 'ثبت سند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>ویرایش مجوز یا سند رسمی</span>
              </h3>
              <button 
                onClick={() => setEditingDoc(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سند / مجوز *</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              {/* Image Upload Component in Edit */}
              <ImageUploadField
                label="تصویر مدرک یا گواهینامه رسمی"
                value={editingDoc.imageUrl || ''}
                onChange={(url) => setEditingDoc({ ...editingDoc, imageUrl: url })}
                helperText="امکان بارگذاری تصویر جدید یا تغییر تصویر قبلی سند"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره یا شناسه سند</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.documentNumber || editingDoc.code || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, documentNumber: e.target.value, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مرجع صادرکننده</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.issuer || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, issuer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ یا سال صدور</label>
                  <input
                    type="text"
                    value={editingDoc.date || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع تاییدیه</label>
                  <input
                    type="text"
                    value={editingDoc.type || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات تکمیلی</label>
                <textarea
                  rows={3}
                  value={editingDoc.description || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات سند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal for Document Image */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-navy-950/60 hover:bg-navy-950 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewImageModal}
              alt="سند رسمی"
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
