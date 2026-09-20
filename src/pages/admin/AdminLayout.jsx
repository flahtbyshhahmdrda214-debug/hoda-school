import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import { 
  LayoutDashboard, School, Newspaper, Users, Building2, 
  FileText, Image, Settings, ShieldCheck, History, LogOut, ExternalLink, Menu, X, Trophy, Type, UserCheck,
  ChevronUp, ChevronDown, RefreshCw, ArrowUp, Clock, Sparkles, CheckCircle2
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [footerExpanded, setFooterExpanded] = useState(false);
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

          <div className="flex items-center gap-3">
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

        {/* Dynamic Expandable Admin Footer (فوتر دینامیک با قابلیت باز و بسته شدن فهرست) */}
        <footer className="bg-navy-950 border-t border-navy-800 text-white z-30 shadow-2xl transition-all duration-300 flex-shrink-0">
          
          {/* Expanded Drawer (فهرست باز شونده و جمع شونده ابزارها و صفحات) */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              footerExpanded ? 'max-h-[600px] border-b border-navy-800/90 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="p-4 sm:p-6 bg-navy-900/95 backdrop-blur-xl space-y-5">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-turquoise-500/10 border border-turquoise-500/30 flex items-center justify-center text-turquoise-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>فهرست دسترسی سریع و مانیتورینگ سیستم</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-turquoise-500/20 text-turquoise-300 font-mono">
                        CMS v2.5
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      دسترسی مستقیم به تمامی صفحات مدیریت محتوا و ابزارهای مانیتورینگ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFooterExpanded(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-semibold border border-navy-700 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4 text-rose-400" />
                    <span>جمع کردن فهرست</span>
                  </button>
                </div>
              </div>

              {/* Navigation Grid (فهرست کامل بخش‌ها) */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400"></span>
                  <span>صفحات و ماژول‌های فعال پنل مدیریت:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setFooterExpanded(false)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                          active
                            ? 'bg-turquoise-600 text-white border-turquoise-500 shadow-md shadow-turquoise-900/30'
                            : 'bg-navy-950/70 hover:bg-navy-800 text-slate-300 hover:text-white border-navy-800/80 hover:border-turquoise-500/40'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-turquoise-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* System Stats & Quick Actions Toolbar */}
              <div className="pt-3 border-t border-navy-800/80 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>اتصال ابری Cloudflare Edge برقرار است</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950 border border-navy-800 text-slate-300">
                    <span>کاربر:</span>
                    <strong className="text-white">{user.fullName}</strong>
                    <span className="text-slate-500">({user.role})</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-medium border border-navy-700 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-turquoise-400" />
                    <span>اسکرول به بالا</span>
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-medium border border-navy-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>بروزرسانی اطلاعات</span>
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-turquoise-600/20 hover:bg-turquoise-600 text-turquoise-300 hover:text-white text-xs font-medium border border-turquoise-500/30 transition-colors"
                  >
                    <span>سایت اصلی</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Collapsed Bar / Trigger (نوار کنترل با دکمه باز و بسته کردن پویا) */}
          <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs bg-navy-950/95 backdrop-blur-md select-none">
            
            {/* Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFooterExpanded(!footerExpanded)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm border ${
                  footerExpanded
                    ? 'bg-navy-800 text-white border-navy-700 hover:bg-navy-700'
                    : 'bg-turquoise-600/15 hover:bg-turquoise-600/25 text-turquoise-300 border-turquoise-500/40 hover:border-turquoise-500'
                }`}
              >
                {footerExpanded ? (
                  <>
                    <ChevronDown className="w-4 h-4 text-rose-400 transition-transform" />
                    <span>جمع کردن فهرست فوتر</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 text-turquoise-400 animate-bounce" />
                    <span>فهرست ابزارها و صفحات (کلیک جهت باز شدن)</span>
                  </>
                )}
              </button>

              {/* Shamsi Date & Live Clock */}
              <div className="hidden md:flex items-center gap-2 text-slate-400 text-[11px] font-medium mr-2">
                <Clock className="w-3.5 h-3.5 text-turquoise-400" />
                <span>{currentDate}</span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-slate-300 font-bold">{currentTime}</span>
              </div>
            </div>

            {/* Status Indicator & Live Link */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline text-slate-400">وضعیت سرور:</span>
                <span className="text-emerald-400 font-bold">برخط (Active)</span>
              </div>

              <span className="hidden sm:inline text-slate-700">|</span>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white text-[11px] border border-navy-800 transition-colors"
              >
                <span>مشاهده سایت</span>
                <ExternalLink className="w-3 h-3 text-turquoise-400" />
              </a>
            </div>

          </div>

        </footer>
      </div>
    </div>
  );
}
