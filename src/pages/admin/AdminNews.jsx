import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    contentHtml: '',
    category: 'اطلاعیه مهم',
    coverImageUrl: '',
    isFeatured: false,
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    const res = await apiRequest('/news?limit=50');
    setNews(res?.items || res || []);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('/news', { method: 'POST', body: form });
      setIsModalOpen(false);
      setForm({ title: '', summary: '', contentHtml: '', category: 'اطلاعیه مهم', coverImageUrl: '', isFeatured: false, isPublished: true });
      await loadNews();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(`/news/${editingNews.id}`, { method: 'PUT', body: editingNews });
      setEditingNews(null);
      await loadNews();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این خبر اطمینان دارید؟')) return;
    try {
      await apiRequest(`/news/${id}`, { method: 'DELETE' });
      await loadNews();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">مدیریت اخبار و اطلاعیه‌ها</h2>
          <p className="text-xs text-slate-500 mt-1">تولید، ویرایش، بهینه‌سازی و انتشار اخبار مجموعه</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>خبر جدید</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">عنوان خبر</th>
              <th className="p-4">دسته‌بندی</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4">تاریخ انتشار</th>
              <th className="p-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-bold text-navy-950 max-w-xs truncate">{item.title}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium text-[11px]">
                    {item.category}
                  </span>
                </td>
                <td className="p-4">
                  {item.isPublished !== false ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> منتشرشده
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> پیش‌نویس
                    </span>
                  )}
                </td>
                <td className="p-4 text-slate-500 font-mono">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('fa-IR') : (item.date || 'امروز')}
                </td>
                <td className="p-4 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingNews({
                      ...item,
                      coverImageUrl: item.coverImageUrl || item.thumbnail || '',
                      contentHtml: item.contentHtml || item.content || '',
                    })}
                    className="p-1.5 text-turquoise-700 hover:bg-turquoise-50 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش خبر"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف خبر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add News Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">افزودن خبر / اطلاعیه جدید</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان خبر</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: آغاز ثبت‌نام دوره‌های تابستانه..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                  >
                    <option value="اطلاعیه مهم">اطلاعیه مهم</option>
                    <option value="افتخارات قرآنی">افتخارات قرآنی</option>
                    <option value="توسعه فناوری">توسعه فناوری</option>
                    <option value="رویداد و آموزش خانواده">رویداد و آموزش خانواده</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">لینک تصویر کاور</label>
                  <input
                    type="text"
                    value={form.coverImageUrl}
                    onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                    placeholder="/assets/campus-1.webp یا آدرس اینترنتی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">خلاصه کوتاه خبر (نمایش در کارت‌ها)</label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">متن کامل خبر (پشتیبانی از تگ‌های HTML)</label>
                <textarea
                  rows={6}
                  required
                  value={form.contentHtml}
                  onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                  placeholder="<p>متن خبر در این بخش قرار می‌گیرد...</p>"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded border-slate-300 text-turquoise-600 focus:ring-turquoise-500"
                  />
                  <span>نمایش در بخش خبرهای ویژه</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="rounded border-slate-300 text-turquoise-600 focus:ring-turquoise-500"
                  />
                  <span>انتشار عمومی فوری</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer"
                >
                  {loading ? 'در حال ثبت...' : 'انتشار خبر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-navy-950">ویرایش خبر: {editingNews.title}</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان خبر</label>
                <input
                  type="text"
                  required
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی</label>
                  <select
                    value={editingNews.category || 'اطلاعیه مهم'}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                  >
                    <option value="اطلاعیه مهم">اطلاعیه مهم</option>
                    <option value="افتخارات قرآنی">افتخارات قرآنی</option>
                    <option value="توسعه فناوری">توسعه فناوری</option>
                    <option value="رویداد و آموزش خانواده">رویداد و آموزش خانواده</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">لینک تصویر کاور</label>
                  <input
                    type="text"
                    value={editingNews.coverImageUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, coverImageUrl: e.target.value })}
                    placeholder="/assets/campus-1.webp یا آدرس اینترنتی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">خلاصه کوتاه خبر</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.summary || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">متن کامل خبر</label>
                <textarea
                  rows={6}
                  required
                  value={editingNews.contentHtml || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, contentHtml: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editingNews.isFeatured || editingNews.isImportant)}
                    onChange={(e) => setEditingNews({ ...editingNews, isFeatured: e.target.checked, isImportant: e.target.checked })}
                    className="rounded border-slate-300 text-turquoise-600 focus:ring-turquoise-500"
                  />
                  <span>نمایش در بخش خبرهای ویژه</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingNews.isPublished !== false}
                    onChange={(e) => setEditingNews({ ...editingNews, isPublished: e.target.checked })}
                    className="rounded border-slate-300 text-turquoise-600 focus:ring-turquoise-500"
                  />
                  <span>انتشار عمومی</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors cursor-pointer"
                >
                  {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
