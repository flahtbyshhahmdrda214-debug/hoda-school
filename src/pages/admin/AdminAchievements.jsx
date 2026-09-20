import React, { useState, useEffect } from 'react';
import { 
  fetchAdminAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from '../../services/achievementsService';
import { apiRequest } from '../../services/apiClient';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Search, 
  Filter, 
  Award, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialForm = {
    title: '',
    recipient: '',
    schoolId: '',
    year: '۱۴۰۳',
    category: 'قرآنی',
    description: '',
    sortOrder: 1,
    isPublished: true,
  };
  const [form, setForm] = useState(initialForm);

  const categories = ['قرآنی', 'کنکور سراسری', 'علمی و المپیاد', 'فرهنگی و ورزشی'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [achsRes, schoolsRes] = await Promise.all([
        fetchAdminAchievements(),
        apiRequest('/schools'),
      ]);
      setAchievements(Array.isArray(achsRes) ? achsRes : []);
      const schoolsList = Array.isArray(schoolsRes) ? schoolsRes : [];
      setSchools(schoolsList);
      if (schoolsList.length > 0 && !form.schoolId) {
        setForm(prev => ({ ...prev, schoolId: String(schoolsList[0].id) }));
      }
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
    setForm({
      ...initialForm,
      schoolId: schools.length > 0 ? String(schools[0].id) : '1',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({
      ...item,
      schoolId: String(item.schoolId || (item.school?.id || '1')),
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedSchool = schools.find(s => String(s.id) === String(form.schoolId));
      const payload = {
        ...form,
        schoolSlug: selectedSchool?.slug || '',
        schoolName: selectedSchool?.shortName || '',
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
      const selectedSchool = schools.find(s => String(s.id) === String(editingItem.schoolId));
      const payload = {
        ...editingItem,
        schoolSlug: selectedSchool?.slug || editingItem.schoolSlug,
        schoolName: selectedSchool?.shortName || editingItem.schoolName,
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
      alert(err.message || 'خطا در تغییر وضعیت');
    }
  };

  // Filtered list
  const filteredList = achievements.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchRecipient = item.recipient?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchRecipient && !matchDesc) return false;
    }
    if (filterSchool !== 'all') {
      const matchSchool = String(item.schoolId) === filterSchool || item.schoolSlug === filterSchool || item.school?.slug === filterSchool;
      if (!matchSchool) return false;
    }
    if (filterCategory !== 'all') {
      if (item.category !== filterCategory) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalCount = achievements.length;
  const quranCount = achievements.filter(a => a.category?.includes('قرآن')).length;
  const konkurCount = achievements.filter(a => a.category?.includes('کنکور')).length;
  const olympiadCount = achievements.filter(a => a.category?.includes('علمی') || a.category?.includes('المپیاد')).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>مدیریت تالار افتخارات و دستاوردها</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ثبت، ویرایش و انتشار کارنامه درخشان و رتبه‌های نخبگان مجتمع هدی در صفحه اصلی
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
            <div className="text-xs text-slate-500 font-medium">کل افتخارات ثبت‌شده</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{quranCount}</div>
            <div className="text-xs text-slate-500 font-medium">مسابقات قرآنی و تواشیح</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{konkurCount}</div>
            <div className="text-xs text-slate-500 font-medium">رتبه‌های برتر کنکور</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-950 font-mono">{olympiadCount}</div>
            <div className="text-xs text-slate-500 font-medium">المپیادها و جشنواره‌ها</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="جستجو در عنوان یا دریافت‌کننده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs focus:outline-none focus:border-turquoise-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              <option value="all">همه مدارس</option>
              {schools.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.shortName}</option>
              ))}
            </select>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="all">همه موضوعات</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">در حال بارگذاری اطلاعات...</div>
        ) : filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">سال</th>
                  <th className="p-4">عنوان افتخار</th>
                  <th className="p-4">دریافت‌کننده</th>
                  <th className="p-4">مدرسه / مقطع</th>
                  <th className="p-4">دسته‌بندی</th>
                  <th className="p-4 text-center">وضعیت</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {item.year}
                    </td>
                    <td className="p-4 font-bold text-navy-950 max-w-xs">
                      <div className="truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-700 whitespace-nowrap">
                      {item.recipient || '—'}
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.schoolName || item.school?.shortName || 'عمومی'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublished(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          item.isPublished !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {item.isPublished !== false ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>منتشرشده</span>
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
            هیچ افتخاری با معیارهای فعلی یافت نشد.
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
                <span>ثبت افتخار جدید در تالار</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان افتخار *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: کسب رتبه ۹ کشوری در کنکور سراسری تجربی"
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
                    placeholder="مثال: محمدصادق نوری"
                    value={form.recipient}
                    onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مدرسه مربوطه</label>
                  <select
                    value={form.schoolId}
                    onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={String(s.id)}>{s.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی موضوعی</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات و جزئیات تکمیلی</label>
                <textarea
                  rows={3}
                  placeholder="شرح جزئیات، رتبه، دانشگاه قبولی یا دستاورد..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-turquoise-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="publishedCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  انتشار عمومی در تالار افتخارات سایت
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

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان افتخار *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">سال کسب افتخار *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مدرسه مربوطه</label>
                  <select
                    value={editingItem.schoolId}
                    onChange={(e) => setEditingItem({ ...editingItem, schoolId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={String(s.id)}>{s.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی موضوعی</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات و جزئیات تکمیلی</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editPublishedCheck"
                  checked={editingItem.isPublished !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-turquoise-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="editPublishedCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  انتشار عمومی در تالار افتخارات سایت
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
