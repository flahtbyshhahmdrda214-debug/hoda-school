import React, { useState, useEffect } from 'react';
import { 
  fetchAdminAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from '../../services/achievementsService';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Search, 
  Calendar,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';
import ImageUploadField from '../../components/ImageUploadField';

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialForm = {
    title: '',
    recipient: '',
    year: '۱۴۰۳',
    description: '',
    imageUrl: '',
    isPublished: true,
  };
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const achsRes = await fetchAdminAchievements();
      setAchievements(Array.isArray(achsRes) ? achsRes : []);
    } catch (err) {
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({
      ...item,
      imageUrl: item.imageUrl || '',
      isPublished: item.isPublished !== false,
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        institution: 'مجتمع آموزشی هدی',
      };
      await createAchievement(payload);
      setIsAddModalOpen(false);
      setForm(initialForm);
      await loadData();
    } catch (err) {
      alert(err.message || 'خطا در ثبت افتخار');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);
    try {
      const payload = {
        ...editingItem,
        institution: 'مجتمع آموزشی هدی',
      };
      await updateAchievement(editingItem.id, payload);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'خطا در به‌روزرسانی افتخار');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`آیا از حذف افتخار «${title}» اطمینان دارید؟`)) return;
    try {
      await deleteAchievement(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'خطا در حذف افتخار');
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      await updateAchievement(item.id, { isPublished: !item.isPublished });
      await loadData();
    } catch (err) {
      alert(err.message || 'خطا در تغییر وضعیت انتشار');
    }
  };

  // Filtered list
  const filteredList = achievements.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchRecipient = item.recipient?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchYear = item.year?.toString().includes(q);
      if (!matchTitle && !matchRecipient && !matchDesc && !matchYear) return false;
    }
    if (statusFilter === 'published' && item.isPublished === false) return false;
    if (statusFilter === 'draft' && item.isPublished !== false) return false;
    return true;
  });

  // Calculate metrics
  const totalCount = achievements.length;
  const publishedCount = achievements.filter(a => a.isPublished !== false).length;
  const draftCount = achievements.filter(a => a.isPublished === false).length;
  const withImageCount = achievements.filter(a => !!a.imageUrl).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>مدیریت تالار افتخارات مجتمع هدی</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ثبت، ویرایش و مدیریت دستاوردها، تندیس‌ها و افتخارات موسسه در وب‌سایت
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت افتخار جدید</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{totalCount}</div>
            <div className="text-xs text-slate-500 font-medium">کل افتخارات مجتمع</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{publishedCount}</div>
            <div className="text-xs text-slate-500 font-medium">منتشر شده در سایت</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{draftCount}</div>
            <div className="text-xs text-slate-500 font-medium">پیش‌نویس / غیرفعال</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{withImageCount}</div>
            <div className="text-xs text-slate-500 font-medium">همراه با عکس / لوح</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="جستجو در عنوان، برگزیده یا شرح..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs focus:outline-none focus:border-turquoise-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-navy-950 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            همه ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            منتشر شده ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            پیش‌نویس ({draftCount})
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">در حال دریافت فهرست افتخارات...</div>
        ) : filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold">عنوان دستاورد / افتخار</th>
                  <th className="p-4 font-bold">فرد یا تیم برگزیده</th>
                  <th className="p-4 font-bold">سال</th>
                  <th className="p-4 font-bold text-center">تصویر</th>
                  <th className="p-4 font-bold text-center">وضعیت انتشار</th>
                  <th className="p-4 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-navy-950 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="line-clamp-2 leading-relaxed">{item.title}</div>
                          {item.description && (
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      {item.recipient ? (
                        <span className="font-semibold">{item.recipient}</span>
                      ) : (
                        <span className="text-slate-400">مجتمع هدی</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 font-mono font-bold">
                      {item.year || '۱۴۰۳'}
                    </td>
                    <td className="p-4 text-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 mx-auto shadow-xs"
                        />
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          item.isPublished !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {item.isPublished !== false ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>منتشر شده</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>پیش‌نویس</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            هیچ افتخاری با معیارهای جستجوی فعلی یافت نشد.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>ثبت افتخار جدید در مجتمع هدی</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان افتخار یا دستاورد *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: کسب رتبه اول کشوری در مسابقات همخوانی و قرآن کریم"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام فرد یا تیم برگزیده</label>
                  <input
                    type="text"
                    placeholder="مثال: گروه سرود و نغمه‌های قرآنی"
                    value={form.recipient}
                    onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">سال کسب افتخار *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ۱۴۰۳"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              {/* Image Upload for Achievement */}
              <ImageUploadField
                label="تصویر افتخار، مدال یا لوح تقدیر"
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                helperText="تصویر لوح تقدیر، مدال یا عکس مراسم اهدای جوایز"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح و جزئیات تکمیلی</label>
                <textarea
                  rows={3}
                  placeholder="توضیحات دستاورد، رتبه، برگزارکننده یا بازتاب افتخار..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addPublishedCheck"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-turquoise-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="addPublishedCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  انتشار فوری در تالار افتخارات سایت
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'در حال ثبت...' : 'ثبت نهایی افتخار'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>ویرایش افتخار</span>
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان افتخار یا دستاورد *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام فرد یا تیم برگزیده</label>
                  <input
                    type="text"
                    value={editingItem.recipient || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, recipient: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">سال کسب افتخار *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              {/* Image Upload for Achievement */}
              <ImageUploadField
                label="تصویر افتخار، مدال یا لوح تقدیر"
                value={editingItem.imageUrl || ''}
                onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                helperText="تصویر لوح تقدیر، مدال یا عکس مراسم اهدای جوایز"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح و جزئیات تکمیلی</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editPublishedCheck"
                  checked={editingItem.isPublished !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-turquoise-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="editPublishedCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  انتشار در تالار افتخارات سایت
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
