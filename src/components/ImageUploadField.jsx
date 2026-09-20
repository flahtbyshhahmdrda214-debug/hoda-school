import React, { useState, useRef } from 'react';
import { uploadMedia } from '../services/mediaService';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Loader2, CheckCircle2, Eye, X } from 'lucide-react';

export default function ImageUploadField({
  label = 'تصویر',
  value = '',
  onChange,
  placeholder = 'انتخاب فایل از سیستم یا درج آدرس اینترنتی تصویر...',
  helperText = 'فرمت‌های مجاز: JPG, PNG, WebP (بهینه‌سازی خودکار به حجم زیر ۱۵۰ کیلوبایت)',
  required = false
}) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    setErrorMsg('');
    setUploading(true);

    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        onChange(res.url);
      } else if (res && res.dataUrl) {
        onChange(res.dataUrl);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setErrorMsg(err.message || 'خطا در بارگذاری تصویر');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-turquoise-600 hover:text-turquoise-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'مخفی‌سازی آدرس دستی' : 'درج مستقیم لینک اینترنتی'}</span>
        </button>
      </div>

      {/* Direct URL Input (optional toggle) */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... یا /assets/..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-turquoise-500 font-mono text-left"
            dir="ltr"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="پاک کردن"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Upload Dropzone & Preview Box */}
      {value ? (
        <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3 overflow-hidden group">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
            <img
              src={value}
              alt="پیش‌نمایش"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/campus-1.webp';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="absolute inset-0 bg-navy-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
              title="مشاهده بزرگ‌تر"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تصویر با موفقیت انتخاب شد</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate font-mono" dir="ltr">
              {value.startsWith('data:') ? 'تصویر بهینه‌شده محلی (WebP/JPEG)' : value}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-turquoise-700 hover:text-turquoise-800 hover:underline cursor-pointer"
              >
                تغییر تصویر...
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                حذف تصویر
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="حذف تصویر"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-turquoise-500 bg-turquoise-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-turquoise-400 hover:bg-slate-50/80 bg-white'
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center gap-2 text-turquoise-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">در حال پردازش و بهینه‌سازی تصویر...</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-turquoise-50 text-turquoise-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-700">
                <span>کلیک کنید یا فایل تصویر را اینجا رها کنید</span>
              </div>
              <p className="text-[11px] text-slate-400">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-semibold">{errorMsg}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Lightbox / Preview Modal */}
      {showPreviewModal && value && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-navy-950/60 hover:bg-navy-950 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={value}
              alt="نمایش کامل تصویر"
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
