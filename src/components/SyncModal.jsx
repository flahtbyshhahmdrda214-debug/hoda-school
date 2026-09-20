import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, QrCode, Copy, Check, Download, Upload, 
  RefreshCw, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink 
} from 'lucide-react';
import { generateSyncUrl, downloadBackupFile, restoreFromFile } from '../services/deviceSyncService';

export default function SyncModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('qr'); // qr, link, file
  const [syncUrl, setSyncUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
      const saved = localStorage.getItem('hoda_last_device_sync');
      if (saved) {
        setLastSyncTime(new Date(saved).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
      }
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const url = await generateSyncUrl();
      setSyncUrl(url);
    } catch (err) {
      console.error('Error generating sync url:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!syncUrl) return;
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await restoreFromFile(file);
      setUploadStatus({
        success: true,
        message: `اطلاعات با موفقیت بازیابی شد (${res.keysUpdated.length} بخش به‌روزرسانی شد).`
      });
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err) {
      setUploadStatus({
        success: false,
        message: err.message
      });
    }
  };

  if (!isOpen) return null;

  const qrImageUrl = syncUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(syncUrl)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-turquoise-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-navy-950 flex items-center gap-2">
              <span>همگام‌سازی اطلاعات با گوشی و سایر دستگاه‌ها</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              انتقال آنی تمامی اخبار، اسناد، افتخارات و تصاویر ادیت‌شده به موبایل
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <QrCode className="w-4 h-4 text-turquoise-600" />
            <span>اسکن بارکد QR</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'link' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Copy className="w-4 h-4 text-blue-600" />
            <span>لینک مستقیم</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'file' ? 'bg-white text-navy-950 shadow-sm' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>فایل پشتیبان</span>
          </button>
        </div>

        {/* Tab 1: QR Code Scanner */}
        {activeTab === 'qr' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 inline-block mx-auto shadow-inner">
              {generating ? (
                <div className="w-52 h-52 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-turquoise-600" />
                  <span className="text-xs font-bold">در حال تولید بارکد اختصاصی...</span>
                </div>
              ) : qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="بارکد همگام‌سازی با گوشی"
                  className="w-52 h-52 mx-auto rounded-xl"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
                  خطا در تولید بارکد
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed bg-turquoise-50/60 p-3.5 rounded-2xl border border-turquoise-100">
              <p className="font-bold text-turquoise-900 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-turquoise-600" />
                <span>نحوه استفاده در گوشی:</span>
              </p>
              <p>
                دوربین گوشی موبایل خود را روی بارکد بالا بگیرید تا لینک باز شود. به محض باز شدن، تمامی تغییرات کامپیوتر فوراً در گوشی ثبت می‌گردند.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Copy Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              می‌توانید این لینک اختصاصی را کپی کرده و در پیام‌رسان‌های ایتا، بله، تلگرام یا واتساپ برای خود ارسال کنید و در گوشی روی آن کلیک نمایید:
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={syncUrl}
                dir="ltr"
                className="w-full bg-transparent text-xs text-slate-700 font-mono focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی لینک</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">ویژگی‌های این لینک:</p>
              <p>• فشرده‌سازی خودکار و حجم بسیار پایین</p>
              <p>• قابل استفاده در تمام مرورگرهای موبایل (کروم، سافاری آیفون، سامسونگ)</p>
            </div>
          </div>
        )}

        {/* Tab 3: File Backup / Restore */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              همچنین می‌توانید کل دیتابیس سایت (شامل تمام نوشته‌ها و تنظیمات) را به صورت فایل ذخیره کنید و در گوشی بارگذاری نمایید:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={downloadBackupFile}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 rounded-2xl font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-6 h-6 text-emerald-600" />
                <span>دانلود فایل پشتیبان (JSON)</span>
              </button>

              <label className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100/80 text-blue-900 border border-blue-200 rounded-2xl font-bold text-xs transition-colors cursor-pointer shadow-2xs">
                <Upload className="w-6 h-6 text-blue-600" />
                <span>بازیابی فایل پشتیبان در گوشی</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                uploadStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{lastSyncTime ? `آخرین همگام‌سازی: ساعت ${lastSyncTime}` : 'آماده برای همگام‌سازی'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
