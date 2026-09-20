import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw, Smartphone, ArrowLeft, ShieldCheck, AlertCircle, Home, LayoutDashboard } from 'lucide-react';
import { decompressData, importAllData, restoreFromFile } from '../services/deviceSyncService';

export default function SyncPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error, manual
  const [errorMessage, setErrorMessage] = useState('');
  const [keysUpdated, setKeysUpdated] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // Extract query parameter ?d=... or #/sync?d=...
    const urlParams = new URLSearchParams(location.search);
    let d = urlParams.get('d');

    // Also check window.location.hash in case query is in hash
    if (!d && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      d = hashParams.get('d');
    }

    if (d) {
      applySyncCode(d);
    } else {
      setStatus('manual');
    }
  }, [location]);

  const applySyncCode = async (compressedStr) => {
    setStatus('processing');
    try {
      const data = await decompressData(compressedStr);
      const res = importAllData(data);
      setKeysUpdated(res.keysUpdated || []);
      setStatus('success');
    } catch (err) {
      console.error('Sync failed:', err);
      setErrorMessage(err.message || 'خطا در پردازش اطلاعات همگام‌سازی');
      setStatus('error');
    }
  };

  // Auto redirect countdown on success
  useEffect(() => {
    if (status !== 'success') return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    let code = manualCode.trim();
    if (code.includes('?d=')) {
      code = code.split('?d=')[1];
    }
    applySyncCode(code);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('processing');
    try {
      const res = await restoreFromFile(file);
      setKeysUpdated(res.keysUpdated || []);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 flex items-center justify-center p-4 text-slate-800">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-scaleUp">
        
        {/* Processing State */}
        {status === 'processing' && (
          <div className="py-12 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-turquoise-50 text-turquoise-600 flex items-center justify-center mx-auto shadow-inner">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-lg font-black text-navy-950">در حال دریافت و اعمال اطلاعات...</h2>
            <p className="text-xs text-slate-500">
              داده‌های ویرایش‌شده در کامپیوتر در حال انتقال به حافظه گوشی شما هستند.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-black text-emerald-700">همگام‌سازی با موفقیت انجام شد!</h2>
              <p className="text-xs text-slate-500 mt-1">
                تمامی اطلاعات و تغییرات پنل مدیریت بر روی این دستگاه ثبت گردید.
              </p>
            </div>

            {keysUpdated.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">بخش‌های به‌روزرسانی شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {keysUpdated.map((key, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold">
                      ✓ {key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 font-mono">
              هدایت خودکار به صفحه اصلی در {countdown} ثانیه...
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Home className="w-4 h-4" />
                <span>مشاهده سایت</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 py-2.5 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>پنل مدیریت</span>
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-lg font-black text-rose-700">خطا در همگام‌سازی اطلاعات</h2>
              <p className="text-xs text-slate-500 mt-1">{errorMessage}</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setStatus('manual')}
                className="w-full py-2.5 bg-navy-950 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                تلاش مجدد یا ورود دستی کد
              </button>
              <Link
                to="/"
                className="w-full py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold"
              >
                بازگشت به سایت
              </Link>
            </div>
          </div>
        )}

        {/* Manual Sync Input State */}
        {status === 'manual' && (
          <div className="space-y-5 text-right">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-50 text-turquoise-600 flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-navy-950">همگام‌سازی دستی دستگاه</h2>
              <p className="text-xs text-slate-500 mt-1">
                کد یا لینک دریافتی از کامپیوتر را در کادر زیر قرار دهید:
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="لینک کامل همگام‌سازی یا کد دیتابیس..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-turquoise-500 font-mono text-left"
                dir="ltr"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-turquoise-600 hover:bg-turquoise-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                اعمال و همگام‌سازی فوری
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400">یا بارگذاری فایل</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <label className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200">
              <span>انتخاب فایل پشتیبان hoda-backup.json</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="pt-2 text-center">
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
                انصراف و بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
