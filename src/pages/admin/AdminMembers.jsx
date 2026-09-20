import React, { useState, useEffect } from 'react';
import { 
  fetchMembers, 
  saveMembers, 
  updateDirector, 
  addTrustee, 
  updateTrustee, 
  deleteTrustee, 
  updatePrincipal 
} from '../../services/membersService';
import { 
  Users, Crown, GraduationCap, Building, Save, Check, Plus, 
  Trash2, Edit, X, Phone, Mail, Sparkles, Quote, Image as ImageIcon,
  CheckCircle2, ArrowLeft, ExternalLink, AlertCircle
} from 'lucide-react';

export default function AdminMembers() {
  const [data, setData] = useState({ director: {}, trustees: [], principals: [] });
  const [activeTab, setActiveTab] = useState('director'); // 'director', 'trustees', 'principals'
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Trustee Edit/Add Modal
  const [editingTrustee, setEditingTrustee] = useState(null);
  const [isNewTrustee, setIsNewTrustee] = useState(false);

  // New responsibility temporary input for Director
  const [newResp, setNewResp] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const res = await fetchMembers();
    if (res) {
      setData(res);
    }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // Director handlers
  const handleDirectorChange = (field, value) => {
    setData(prev => ({
      ...prev,
      director: { ...prev.director, [field]: value }
    }));
  };

  const handleAddResponsibility = () => {
    if (!newResp.trim()) return;
    setData(prev => ({
      ...prev,
      director: {
        ...prev.director,
        responsibilities: [...(prev.director.responsibilities || []), newResp.trim()]
      }
    }));
    setNewResp('');
  };

  const handleRemoveResponsibility = (index) => {
    setData(prev => ({
      ...prev,
      director: {
        ...prev.director,
        responsibilities: (prev.director.responsibilities || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSaveDirector = async () => {
    setSaving(true);
    try {
      await updateDirector(data.director);
      showNotification('اطلاعات مدیر مجتمع با موفقیت ذخیره و در صفحه اصلی اعمال شد.');
    } catch (err) {
      alert('خطا در ذخیره اطلاعات: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Trustee Handlers
  const handleOpenAddTrustee = () => {
    setEditingTrustee({
      name: '',
      title: 'عضو هیئت امنا',
      roleLabel: 'هیئت امنا',
      degree: '',
      experience: '',
      highlight: '',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });
    setIsNewTrustee(true);
  };

  const handleOpenEditTrustee = (trustee) => {
    setEditingTrustee({ ...trustee });
    setIsNewTrustee(false);
  };

  const handleSaveTrusteeModal = async (e) => {
    e.preventDefault();
    if (!editingTrustee.name) {
      alert('لطفاً نام عضو هیئت امنا را وارد نمایید');
      return;
    }

    setSaving(true);
    try {
      if (isNewTrustee) {
        await addTrustee(editingTrustee);
        showNotification('عضو جدید هیئت امنا با موفقیت افزوده شد.');
      } else {
        await updateTrustee(editingTrustee.id, editingTrustee);
        showNotification('اطلاعات عضو هیئت امنا به‌روزرسانی شد.');
      }
      setEditingTrustee(null);
      await loadMembers();
    } catch (err) {
      alert('خطا: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrustee = async (id) => {
    if (!confirm('آیا از حذف این عضو هیئت امنا اطمینان دارید؟')) return;
    try {
      await deleteTrustee(id);
      setData(prev => ({
        ...prev,
        trustees: prev.trustees.filter(t => String(t.id) !== String(id))
      }));
      showNotification('عضو مورد نظر از فهرست هیئت امنا حذف شد.');
    } catch (err) {
      alert('خطا در حذف: ' + err.message);
    }
  };

  // Principal Handlers
  const handlePrincipalChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      principals: (prev.principals || []).map(p => 
        String(p.id) === String(id) ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleSavePrincipals = async () => {
    setSaving(true);
    try {
      await saveMembers({ principals: data.principals });
      showNotification('مشخصات مدیران مدارس چهارگانه با موفقیت ذخیره و اعمال شد.');
    } catch (err) {
      alert('خطا: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Save All
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveMembers(data);
      showNotification('تمام اطلاعات ارکان مجتمع با موفقیت ذخیره و در سایت عمومی به‌روزرسانی شد.');
    } catch (err) {
      alert('خطا: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const director = data.director || {};
  const trustees = data.trustees || [];
  const principals = data.principals || [];

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-turquoise-700 font-bold text-xs bg-turquoise-50 px-3 py-1.5 rounded-full w-fit border border-turquoise-200">
            <Users className="w-4 h-4" />
            <span>مدیریت ارکان، رهبری و مسئولان مجتمع هدی</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-navy-950 tracking-tight">
            مدیریت اعضای مجتمع
          </h1>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
            ویرایش مستقیم نام، سمت، مدارک تحصیلی، تصاویر پرتره و بیوگرافی مدیر مجتمع، اعضای هیئت امنا و مدیران مدارس چهارگانه
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'در حال ذخیره...' : 'ذخیره کل تغییرات'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
          <a
            href="/#members"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
          >
            <span>مشاهده در صفحه اصلی</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('director')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'director'
              ? 'bg-turquoise-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>۱. مدیر مجتمع (ریاست)</span>
        </button>

        <button
          onClick={() => setActiveTab('trustees')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'trustees'
              ? 'bg-navy-950 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>۲. اعضای هیئت امنا ({trustees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('principals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'principals'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>۳. مدیران مدارس چهارگانه ({principals.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: مدیر مجتمع                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'director' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy-950">مشخصات ریاست و مدیر کل مجتمع</h2>
                  <p className="text-[11px] text-slate-400">این اطلاعات در کادر ویژه بالای بخش اعضای صفحه اصلی به نمایش درمی‌آید</p>
                </div>
              </div>

              <button
                onClick={handleSaveDirector}
                disabled={saving}
                className="px-5 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره مدیر مجتمع</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Photo & Preview */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-700">تصویر پرتره مدیر مجتمع</label>
                <div className="w-full aspect-square rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden relative flex items-center justify-center">
                  {director.avatar ? (
                    <img 
                      src={director.avatar} 
                      alt={director.name} 
                      className="w-full h-full object-cover object-top" 
                    />
                  ) : (
                    <Users className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">آدرس عکس پرتره (URL یا مسیر لوکال):</label>
                  <input
                    type="text"
                    value={director.avatar || ''}
                    onChange={(e) => handleDirectorChange('avatar', e.target.value)}
                    placeholder="/assets/director-avatar.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-turquoise-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    می‌توانید از بخش «مدیریت فایل‌ها و رسانه» عکسی آپلود کرده و آدرس آن را در این کادر قرار دهید.
                  </p>
                </div>
              </div>

              {/* General Fields */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی</label>
                    <input
                      type="text"
                      value={director.name || ''}
                      onChange={(e) => handleDirectorChange('name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سمت رسمی</label>
                    <input
                      type="text"
                      value={director.title || ''}
                      onChange={(e) => handleDirectorChange('title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">مدرک و رشته تحصیلی</label>
                    <input
                      type="text"
                      value={director.degree || ''}
                      onChange={(e) => handleDirectorChange('degree', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">سابقه و تجربه کاری</label>
                    <input
                      type="text"
                      value={director.experience || ''}
                      onChange={(e) => handleDirectorChange('experience', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تلفن دفتر مرکزی</label>
                    <input
                      type="text"
                      value={director.phone || ''}
                      onChange={(e) => handleDirectorChange('phone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل دفتر مدیریت</label>
                    <input
                      type="text"
                      value={director.email || ''}
                      onChange={(e) => handleDirectorChange('email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شعار تربیتی یا کلام راهبردی (پیام ریاست)</label>
                  <textarea
                    rows={2}
                    value={director.slogan || ''}
                    onChange={(e) => handleDirectorChange('slogan', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed font-semibold text-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شرح بیوگرافی و سوابق تفصیلی</label>
                  <textarea
                    rows={4}
                    value={director.bio || ''}
                    onChange={(e) => handleDirectorChange('bio', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                محورهای راهبری و شرح وظایف نظارت عالیه
              </label>
              
              <div className="space-y-2">
                {(director.responsibilities || []).map((resp, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-turquoise-600 flex-shrink-0" />
                      <span>{resp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(i)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="حذف این مورد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Responsibility Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  placeholder="افزودن شرح وظیفه یا محور جدید..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddResponsibility();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  + افزودن مورد
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: اعضای هیئت امنا                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'trustees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">اعضای محترم هیئت امنا و شورای سیاست‌گذاری</h2>
              <p className="text-xs text-slate-500">مدیریت اعضای شورای عالی و ناظران کلان آموزشی و تربیتی مجتمع</p>
            </div>
            <button
              onClick={handleOpenAddTrustee}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن عضو جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustees.map((trustee) => (
              <div key={trustee.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                    <img src={trustee.avatar} alt={trustee.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-navy-950">{trustee.name}</h3>
                    <p className="text-xs text-turquoise-700 font-semibold">{trustee.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{trustee.degree}</p>
                  </div>
                  {trustee.highlight && (
                    <div className="bg-slate-50 p-2 rounded-xl text-[10px] text-slate-600 text-right">
                      <span className="font-bold block text-navy-900">مسئولیت:</span>
                      <span className="line-clamp-2">{trustee.highlight}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditTrustee(trustee)}
                    className="p-1.5 text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTrustee(trustee.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer"
                    title="حذف عضو"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: مدیران مدارس چهارگانه                                              */}
      {/* ========================================================================= */}
      {activeTab === 'principals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">مدیران مدارس چهارگانه هدی</h2>
              <p className="text-xs text-slate-500">ویرایش مشخصات مدیران دبستان و دبیرستان‌های پسرانه و دخترانه مجتمع</p>
            </div>
            <button
              onClick={handleSavePrincipals}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'در حال ذخیره...' : 'ذخیره مدیران مدارس'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principals.map((principal) => (
              <div key={principal.id} className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <img src={principal.icon3d} alt={principal.schoolName} className="w-8 h-8 object-contain" />
                    <div>
                      <h3 className="text-sm font-bold text-navy-950">{principal.schoolName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{principal.schoolSlug}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${principal.badgeClass}`}>
                    مدیر شعبه
                  </span>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">نام و نام خانوادگی مدیر</label>
                    <input
                      type="text"
                      value={principal.name || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان سمت</label>
                    <input
                      type="text"
                      value={principal.title || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">مدرک و رشته تحصیلی</label>
                    <input
                      type="text"
                      value={principal.degree || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'degree', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">سابقه مدیریت</label>
                    <input
                      type="text"
                      value={principal.experience || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'experience', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">مقطع آموزشی تحت پوشش</label>
                    <input
                      type="text"
                      value={principal.schoolLevel || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'schoolLevel', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">شماره تماس مستقیم مدرسه</label>
                    <input
                      type="text"
                      value={principal.phone || ''}
                      onChange={(e) => handlePrincipalChange(principal.id, 'phone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">آدرس عکس پرتره مدیر</label>
                  <input
                    type="text"
                    value={principal.avatar || ''}
                    onChange={(e) => handlePrincipalChange(principal.id, 'avatar', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">بیوگرافی و چکیده رویکرد تربیتی</label>
                  <textarea
                    rows={2}
                    value={principal.bio || ''}
                    onChange={(e) => handlePrincipalChange(principal.id, 'bio', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Add / Edit Trustee                                                 */}
      {/* ========================================================================= */}
      {editingTrustee && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy-950">
                {isNewTrustee ? 'افزودن عضو جدید به هیئت امنا' : 'ویرایش مشخصات عضو هیئت امنا'}
              </h3>
              <button onClick={() => setEditingTrustee(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrusteeModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={editingTrustee.name || ''}
                    onChange={(e) => setEditingTrustee({ ...editingTrustee, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان سمت</label>
                  <input
                    type="text"
                    value={editingTrustee.title || ''}
                    onChange={(e) => setEditingTrustee({ ...editingTrustee, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مدرک و درجه علمی</label>
                  <input
                    type="text"
                    value={editingTrustee.degree || ''}
                    onChange={(e) => setEditingTrustee({ ...editingTrustee, degree: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">سابقه و تجربه</label>
                  <input
                    type="text"
                    value={editingTrustee.experience || ''}
                    onChange={(e) => setEditingTrustee({ ...editingTrustee, experience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مسئولیت راهبردی در مجتمع (Highlight)</label>
                <input
                  type="text"
                  value={editingTrustee.highlight || ''}
                  onChange={(e) => setEditingTrustee({ ...editingTrustee, highlight: e.target.value })}
                  placeholder="مثال: رئیس کمیسیون برنامه‌ریزی درسی و ارزیابی کیفیت"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">آدرس تصویر پرتره</label>
                <input
                  type="text"
                  value={editingTrustee.avatar || ''}
                  onChange={(e) => setEditingTrustee({ ...editingTrustee, avatar: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-turquoise-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح بیوگرافی و سوابق علمی</label>
                <textarea
                  rows={3}
                  value={editingTrustee.bio || ''}
                  onChange={(e) => setEditingTrustee({ ...editingTrustee, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-turquoise-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTrustee(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {saving ? 'در حال ذخیره...' : 'ثبت و ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
