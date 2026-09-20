import React, { useState, useEffect, useRef } from 'react';
import { fetchMedia, uploadMedia, deleteMedia } from '../../services/mediaService';
import { 
  Upload, Trash2, Copy, Check, FileText, Image as ImageIcon, 
  Search, Eye, X, Download, HardDrive, Filter, AlertCircle 
} from 'lucide-react';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, images, documents
  const [previewItem, setPreviewItem] = useState(null);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await fetchMedia();
      setMedia(items || []);
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage('');

    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await uploadMedia(file);
        if (uploaded) uploadedCount++;
      }
      await loadMedia();
      setMessage(`${uploadedCount} فایل با موفقیت بارگذاری و ذخیره شد.`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('خطا در بارگذاری فایل: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) return;
    try {
      await deleteMedia(id);
      setMedia(prev => prev.filter(m => String(m.id) !== String(id)));
      if (previewItem?.id === id) setPreviewItem(null);
      setMessage('فایل با موفقیت حذف گردید.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('خطا در حذف فایل: ' + err.message);
    }
  };

  // Filter & Search
  const filteredMedia = media.filter(item => {
    const isImage = item.mimeType?.startsWith('image/') || item.url?.startsWith('data:image') || item.url?.match(/\.(jpeg|jpg|png|webp|gif|svg)/i);
    
    if (filterType === 'images' && !isImage) return false;
    if (filterType === 'documents' && isImage) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.originalName || item.filename || '').toLowerCase();
      return name.includes(q);
    }
    return true;
  });

  const totalBytes = media.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      
      {/* Header & Stats */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-turquoise-700 font-bold text-xs bg-turquoise-50 px-3 py-1.5 rounded-full w-fit border border-turquoise-200 mb-2">
            <ImageIcon className="w-4 h-4" />
            <span>کتابخانه چندرسانه‌ای و اسناد</span>
          </div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">
            مدیریت فایل‌ها و رسانه‌ها
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            بارگذاری سریع تصاویر، اسناد بخشنامه، گواهینامه‌ها و فایل‌های تصویری مجتمع هدی با فشرده‌سازی خودکار
          </p>
        </div>

        {/* Quick Upload Trigger */}
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleInputChange} 
            disabled={uploading} 
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden" 
            id="file-upload-input"
          />
          <label 
            htmlFor="file-upload-input"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
              uploading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-turquoise-600 hover:bg-turquoise-500'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'در حال بهینه‌سازی و آپلود...' : 'بارگذاری فایل جدید'}</span>
          </label>
        </div>
      </div>

      {/* Success / Info Message */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer bg-white ${
          isDragging
            ? 'border-turquoise-500 bg-turquoise-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-turquoise-400 hover:bg-slate-50/60'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-turquoise-50 text-turquoise-600 flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy-950">
              فایل‌ها را به اینجا بکشید یا برای انتخاب فایل کلیک کنید
            </p>
            <p className="text-xs text-slate-400 mt-1">
              پشتیبانی از انواع تصاویر (JPG, PNG, WebP) و فایل‌های اسناد (PDF)
            </p>
          </div>
          <span className="inline-block text-[11px] font-bold text-turquoise-700 bg-turquoise-50 px-3 py-1 rounded-lg">
            تصاویر به صورت خودکار فشرده و بهینه‌سازی می‌شوند
          </span>
        </div>
      </div>

      {/* Search, Filter & Stats Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو در میان نام فایل‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-turquoise-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-navy-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه فایل‌ها ({media.length})
          </button>
          <button
            onClick={() => setFilterType('images')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'images'
                ? 'bg-turquoise-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            تصاویر
          </button>
          <button
            onClick={() => setFilterType('documents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'documents'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            اسناد و مدارک
          </button>
        </div>

        {/* Total Size Counter */}
        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <span>حجم کل: {totalMB} مگابایت</span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-turquoise-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-bold">در حال بارگذاری فایل‌های رسانه...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-navy-950">هیچ فایلی یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery 
              ? 'موردی متناسب با عبارت جستجوی شما پیدا نشد.' 
              : 'هنوز فایلی بارگذاری نشده است. با استفاده از دکمه بالای صفحه یا درگ اند دراپ اولین فایل را آپلود کنید.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mimeType?.startsWith('image/') || item.url?.startsWith('data:image') || item.url?.match(/\.(jpeg|jpg|png|webp|gif|svg)/i);
            const displayName = item.originalName || item.filename || 'فایل بدون نام';
            const sizeKB = item.sizeBytes ? (item.sizeBytes / 1024).toFixed(1) : '–';

            return (
              <div 
                key={item.id} 
                onClick={() => setPreviewItem(item)}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer hover:border-turquoise-300"
              >
                {/* Thumbnail */}
                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center border border-slate-100">
                  {isImage ? (
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={displayName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <FileText className="w-10 h-10 text-rose-500 mb-1" />
                      <span className="text-[9px] font-bold font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {item.filename?.split('.').pop() || 'DOC'}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 bg-white/90 text-navy-900 rounded-xl hover:bg-white shadow-sm transition-colors">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* File Info */}
                <div className="mt-2.5 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate" title={displayName}>
                    {displayName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{sizeKB} KB</span>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.url, item.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-turquoise-600 hover:bg-turquoise-50 rounded-lg transition-colors cursor-pointer"
                    title="کپی نشانی فایل (URL)"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف فایل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base font-bold text-navy-950 truncate max-w-md">
                  {previewItem.originalName || previewItem.filename}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {(previewItem.sizeBytes ? (previewItem.sizeBytes / 1024).toFixed(1) + ' KB' : '')} | {previewItem.mimeType}
                </p>
              </div>
              <button 
                onClick={() => setPreviewItem(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] flex items-center justify-center bg-slate-900/5">
              {previewItem.mimeType?.startsWith('image/') || previewItem.url?.startsWith('data:image') || previewItem.url?.match(/\.(jpeg|jpg|png|webp|gif|svg)/i) ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.originalName || previewItem.filename} 
                  className="max-h-[50vh] max-w-full rounded-xl object-contain shadow-md"
                />
              ) : (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">سند پی‌دی‌اف / پرونده متنی</p>
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noreferrer"
                    download={previewItem.filename}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-turquoise-600 text-white rounded-xl text-xs font-bold hover:bg-turquoise-500 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود یا مشاهده مستقیم سند</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 max-w-md flex-1">
                <input
                  type="text"
                  readOnly
                  value={previewItem.url}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-600 select-all"
                />
                <button
                  onClick={() => handleCopy(previewItem.url, previewItem.id)}
                  className="px-3 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  {copiedId === previewItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی آدرس</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewItem.url}
                  download={previewItem.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود</span>
                </a>
                <button
                  onClick={(e) => handleDelete(previewItem.id, e)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
