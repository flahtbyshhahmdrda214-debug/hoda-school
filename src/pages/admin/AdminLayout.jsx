import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import { 
  LayoutDashboard, School, Newspaper, Users, Building2, 
  FileText, Image, Settings, ShieldCheck, History, LogOut, ExternalLink, Menu, X, Trophy, Type, UserCheck,
  ChevronUp, ChevronDown, RefreshCw, ArrowUp, Clock, Sparkles, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const mainRef = useRef(null);
  const user = getCurrentUser() || { fullName: 'مدیر سیستم', role: 'SUPERADMIN' };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDate = new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  }).format(new Date());

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'پیشخوان و آمار', to: '/admin', icon: LayoutDashboard },
    { label: 'مدارس چهارگانه', to: '/admin/schools', icon: School },
    { label: 'ارکان و مدیران مجتمع', to: '/admin/members', icon: UserCheck },
    { label: 'تالار افتخارات', to: '/admin/achievements', icon: Trophy },
    { label: 'اخبار و اطلاعیه‌ها', to: '/admin/news', icon: Newspaper },
    { label: 'اساتید و معلمان', to: '/admin/teachers', icon: Users },
    { label: 'امکانات آموزشی', to: '/admin/facilities', icon: Building2 },
    { label: 'مجوزها و اسناد', to: '/admin/documents', icon: FileText },
    { label: 'مدیریت فایل‌ها و رسانه', to: '/admin/media', icon: Image },
    { label: 'مدیریت فونت و ظاهر', to: '/admin/typography', icon: Type },
    { label: 'تنظیمات عمومی سایت', to: '/admin/settings', icon: Settings },
  ];

  if (user.role === 'SUPERADMIN') {
    navItems.push(
      { label: 'کاربران و دسترسی‌ها', to: '/admin/users', icon: ShieldCheck },
      { label: 'گزارش وقایع و لاگ‌ها', to: '/admin/audit-logs', icon: History }
    );
  }

  const isActive = (to) => {
    if (to === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 selection:bg-turquoise-500 selection:text-white font-sans">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-950 text-white border-l border-navy-800 flex-shrink-0">
        <div className="p-6 border-b border-navy-800 flex items-center gap-3">
          <img 
            src="/assets/hoda-3d-logo-transparent.png" 
            onError={(e) => { e.currentTarget.src = '/assets/hoda-logo.png'; }}
            alt="Hoda Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(13,148,136,0.3)] hover:scale-105 transition-transform" 
          />
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">پنل مدیریت هدی</h2>
            <span className="text-[10px] text-turquoise-400 font-mono tracking-wider">CMS v2.0 Production</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-turquoise-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 bg-navy-900/60 hover:bg-navy-900 hover:text-white transition-colors"
          >
            <span>مشاهده سایت اصلی</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <img 
              src="/assets/hoda-3d-logo-transparent.png" 
              onError={(e) => { e.currentTarget.src = '/assets/hoda-logo.png'; }}
              alt="Hoda Logo" 
              className="w-8 h-8 object-contain md:hidden drop-shadow-sm" 
            />
            <h1 className="text-base font-bold text-navy-950">سامانه مدیریت محتوای هدی</h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Trigger Button for Vertical Side Panel */}
            <button
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-turquoise-50 hover:text-turquoise-800 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              title="باز و بسته کردن پنل عمودی کنار صفحه"
            >
              <Sparkles className="w-3.5 h-3.5 text-turquoise-600" />
              <span className="hidden sm:inline">ابزارها و مانیتورینگ</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-navy-950">{user.fullName}</div>
              <div className="text-[10px] text-slate-500 font-mono">{user.role}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-navy-900 text-turquoise-400 flex items-center justify-center font-bold text-xs shadow-inner">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="md:hidden bg-navy-950 text-white p-4 space-y-2 border-b border-navy-800">
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-navy-800/80">
              <img 
                src="/assets/hoda-3d-logo-transparent.png" 
                onError={(e) => { e.currentTarget.src = '/assets/hoda-logo.png'; }}
                alt="Hoda Logo" 
                className="w-9 h-9 object-contain drop-shadow-sm" 
              />
              <div>
                <div className="text-sm font-bold text-white">پنل مدیریت مجتمع هدی</div>
                <div className="text-[10px] text-turquoise-400 font-mono">CMS v2.0 Production</div>
              </div>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-navy-900"
                >
                  <Icon className="w-4 h-4 text-turquoise-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-navy-800 flex justify-between items-center">
              <a href="/" target="_blank" rel="noreferrer" className="text-xs text-turquoise-400">مشاهده سایت</a>
              <button onClick={handleLogout} className="text-xs text-rose-400">خروج</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Vertical Side Panel (جایگزین عمودی فوتر در کنار صفحه با قابلیت باز و جمع شدن) */}
        
        {/* 1. Backdrop Overlay when Side Panel is open */}
        {sidePanelOpen && (
          <div 
            onClick={() => setSidePanelOpen(false)}
            className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs z-40 transition-opacity"
          />
        )}

        {/* 2. Vertical Floating Tab on Left Edge (زبانه عمودی چسبان در کنار صفحه) */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none">
          <button
            onClick={() => setSidePanelOpen(!sidePanelOpen)}
            className="flex flex-col items-center gap-2.5 py-4 px-2 rounded-r-2xl bg-navy-950/95 hover:bg-navy-900 text-white border-y border-r border-turquoise-500/40 shadow-[4px_0_20px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group cursor-pointer hover:pl-2.5"
            title="کلیک کنید: باز و بسته کردن فهرست و ابزارهای سریع"
          >
            {/* Live Server Pulse Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>

            {/* Sparkles Icon */}
            <Sparkles className="w-4 h-4 text-turquoise-400 group-hover:rotate-45 transition-transform duration-300" />

            {/* Vertical Persian Text */}
            <span 
              className="text-[11px] font-bold tracking-wider text-slate-300 group-hover:text-turquoise-300 transition-colors py-2 [writing-mode:vertical-rl] rotate-180"
            >
              فهرست و ابزارهای سریع
            </span>

            {/* Chevron Indicator */}
            <ChevronRight className={`w-4 h-4 text-turquoise-400 transition-transform duration-300 ${sidePanelOpen ? 'rotate-180' : 'animate-pulse'}`} />
          </button>
        </div>

        {/* 3. Vertical Side Drawer Panel (پنل کشویی عمودی با فهرست کامل و ابزارها) */}
        <aside
          className={`fixed left-0 top-0 bottom-0 w-80 sm:w-96 bg-navy-950 text-white z-50 border-r border-navy-800 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-300 ease-in-out ${
            sidePanelOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between bg-navy-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-turquoise-500/15 border border-turquoise-500/30 flex items-center justify-center text-turquoise-400 shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>پنل ابزارها و ماژول‌ها</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-turquoise-500/20 text-turquoise-300 font-mono">
                    CMS v2.5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  دسترسی سریع، ناوبری و مانیتورینگ
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidePanelOpen(false)}
              className="p-2 rounded-xl bg-navy-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-navy-700 transition-colors cursor-pointer"
              title="بستن و جمع کردن منو"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* System Status & Shamsi Clock Card */}
          <div className="p-4 border-b border-navy-800 bg-navy-900/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-400">وضعیت سرور:</span>
                <span className="text-emerald-400 font-bold">برخط (Cloudflare Edge)</span>
              </div>
              <span className="font-mono text-turquoise-300 font-bold text-[11px]">{currentTime}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-navy-800/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-turquoise-400" />
                <span>{currentDate}</span>
              </div>
              <span className="text-slate-400">کاربر: <strong className="text-slate-200">{user.fullName}</strong></span>
            </div>
          </div>

          {/* Scrollable Vertical Navigation List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 mb-2 px-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400"></span>
              <span>فهرست کامل صفحات مدیریت:</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidePanelOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    active
                      ? 'bg-turquoise-600 text-white border-turquoise-500 shadow-md shadow-turquoise-900/30'
                      : 'bg-navy-900/50 hover:bg-navy-800 text-slate-300 hover:text-white border-navy-800/70 hover:border-turquoise-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-turquoise-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white">فعال</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons Toolbar */}
          <div className="p-4 border-t border-navy-800 bg-navy-900/80 space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={scrollToTop}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-turquoise-400" />
                <span>اسکرول به بالا</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>بروزرسانی</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-turquoise-600/20 hover:bg-turquoise-600 text-turquoise-300 hover:text-white border border-turquoise-500/30 transition-colors"
              >
                <span>مشاهده سایت اصلی</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                title="خروج از حساب"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Big Collapse Button */}
            <button
              onClick={() => setSidePanelOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-slate-300 hover:text-white font-bold border border-navy-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-rose-400" />
              <span>جمع کردن و بستن این منو</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
