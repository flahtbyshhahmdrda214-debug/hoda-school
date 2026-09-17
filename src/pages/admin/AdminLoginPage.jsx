import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      // Hard navigation ensures clean mounting and re-reading of localStorage session
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'نام کاربری یا کلمه عبور نادرست است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-850 flex items-center justify-center p-4 selection:bg-turquoise-500 selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shadow-inner">
              <img src="/assets/hoda-logo.png" alt="لوگوی هدی" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-extrabold text-white">سامانه مدیریت مجتمع هدی</h1>
            <p className="text-xs text-slate-400">ورود مدیران، کارشناسان آموزشی و دبیران</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">نام کاربری یا ایمیل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin یا admin@hodaschool.ir"
                  className="w-full bg-navy-950/80 border border-navy-700/80 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">کلمه عبور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-950/80 border border-navy-700/80 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Quick Fill Credentials Helper */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="text-[11px] text-slate-400 block">حساب پیش‌فرض مدیر:</span>
                <span className="font-mono text-turquoise-400 font-bold">admin / Admin@Hoda2026!</span>
              </div>
              <button
                type="button"
                onClick={() => { setIdentifier('admin'); setPassword('Admin@Hoda2026!'); }}
                className="text-[11px] bg-turquoise-500/20 hover:bg-turquoise-500/30 text-turquoise-300 px-2.5 py-1 rounded-lg transition-colors font-medium"
              >
                درج خودکار
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-turquoise-500 to-blue-600 hover:from-turquoise-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-turquoise-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ورود امن به سامانه</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-navy-800 text-center">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به وب‌سایت اصلی مجتمع</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
