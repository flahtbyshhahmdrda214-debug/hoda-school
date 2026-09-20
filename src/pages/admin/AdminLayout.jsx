import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';
import { 
  LayoutDashboard, School, Newspaper, Users, Building2, 
  FileText, Image, Settings, ShieldCheck, History, LogOut, ExternalLink, Menu, X, Trophy, Type, UserCheck 
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getCurrentUser() || { fullName: 'مدیر سیستم', role: 'SUPERADMIN' };

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
          <img src="/assets/hoda-logo.png" alt="Hoda Logo" className="w-10 h-10 object-contain drop-shadow-md" />
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
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
