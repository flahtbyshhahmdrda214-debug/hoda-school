import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { Upload, Trash2, Copy, Check, File } from 'lucide-react';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const res = await apiRequest('/media?limit=60');
    setMedia(res?.items || []);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'general');

    try {
      await fetch('http://localhost:4000/api/v1/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hoda_admin_token')}`
        }
      });
      loadMedia();
    } catch (err) {
      alert('خطا در بارگذاری فایل');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) return;
    try {
      await apiRequest(`/media/${id}`, { method: 'DELETE' });
      loadMedia();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-950">مدیریت فایل‌ها و رسانه</h2>
          <p className="text-xs text-slate-500 mt-1">بارگذاری تصاویر WebP و اسناد PDF با بهینه‌سازی خودکار</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'در حال آپلود...' : 'آپلود فایل جدید'}</span>
          <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between group">
            <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center">
              {item.mimeType?.startsWith('image/') ? (
                <img src={item.thumbnailUrl || item.url} alt={item.filename} className="w-full h-full object-cover" />
              ) : (
                <File className="w-10 h-10 text-slate-400" />
              )}
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-[11px] font-mono text-slate-600 truncate">{item.originalName}</p>
              <p className="text-[9px] text-slate-400 font-mono">{(item.sizeBytes / 1024).toFixed(1)} KB</p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCopy(item.url, item.id)}
                className="p-1 text-slate-500 hover:text-turquoise-600 rounded transition-colors"
                title="کپی آدرس فایل"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
