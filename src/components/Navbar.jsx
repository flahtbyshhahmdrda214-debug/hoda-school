import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, School, Newspaper, Info, Lock, Trophy, Users } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'صفحه اصلی', to: '/', icon: School },
    { label: 'تالار افتخارات', to: '/#honors', icon: Trophy },
    { label: 'ارکان مجتمع', to: '/#members', icon: Users },
    { label: 'اخبار و اطلاعیه‌ها', to: '/news', icon: Newspaper },
    { label: 'مجوزها و اسناد اعتبار', to: '/credentials', icon: Shield },
    { label: 'درباره مجتمع', to: '/about', icon: Info },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/' && !location.hash;
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      return location.pathname === (path || '/') && location.hash === `#${hash}`;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/assets/hoda-logo.png" 
            alt="لوگوی مجتمع هدی" 
            className="w-12 h-12 object-contain drop-shadow-[0_4px_10px_rgba(19,181,222,0.3)] group-hover:scale-105 transition-transform" 
          />
          <div className="text-right">
            <span className="block text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-turquoise-400 transition-colors">
              مجتمع آموزشی قرآنی هدی
            </span>
            <span className="block text-xs text-slate-300 font-light">
              پیش‌دبستان، دبستان و دبیرستان
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-turquoise-500/20 text-turquoise-400 border border-turquoise-500/30 shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Portal Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-200 hover:text-turquoise-400 border border-navy-700/60 hover:border-turquoise-500/40 transition-all shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-turquoise-400" />
            <span>ورود مدیران</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-850 focus:outline-none"
          aria-label="منو"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-navy-950/95 border-b border-navy-800 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-turquoise-500/20 text-turquoise-400 border border-turquoise-500/30'
                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-turquoise-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-navy-800">
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-navy-850 text-turquoise-400 border border-navy-700"
            >
              <Lock className="w-4 h-4" />
              <span>ورود به پنل مدیریت</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
