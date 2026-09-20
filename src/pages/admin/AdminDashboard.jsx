import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { School, Newspaper, Users, Image, ArrowUpRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    schoolsCount: 4,
    newsCount: 0,
    teachersCount: 0,
    mediaCount: 0,
    achievementsCount: 0,
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiRequest('/schools'),
      apiRequest('/news'),
      apiRequest('/teachers'),
      apiRequest('/media'),
      apiRequest('/achievements'),
      apiRequest('/users/audit-logs?limit=5')
    ]).then(([schoolsRes, newsRes, teachersRes, mediaRes, achsRes, logsRes]) => {
      setStats({
        schoolsCount: schoolsRes.value?.length || 4,
        newsCount: newsRes.value?.pagination?.total || newsRes.value?.items?.length || 4,
        teachersCount: teachersRes.value?.length || 7,
        mediaCount: mediaRes.value?.pagination?.total || 0,
        achievementsCount: Array.isArray(achsRes.value) ? achsRes.value.length : 10,
      });
      if (logsRes.value?.items) {
        setAuditLogs(logsRes.value.items);
      }
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'مدارس فعال زیرمجموعه', count: stats.schoolsCount, icon: School, color: 'text-blue-600', bg: 'bg-blue-50', to: '/admin/schools' },
    { label: 'افتخارات و دستاوردها', count: stats.achievementsCount, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', to: '/admin/achievements' },
    { label: 'اخبار و اطلاعیه‌ها', count: stats.newsCount, icon: Newspaper, color: 'text-turquoise-600', bg: 'bg-turquoise-50', to: '/admin/news' },
    { label: 'معلمان و اساتید', count: stats.teachersCount, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', to: '/admin/teachers' },
    { label: 'فایل‌ها و رسانه‌ها', count: stats.mediaCount, icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/admin/media' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-navy-950">پیشخوان مدیریت هدی</h2>
        <p className="text-slate-500 text-xs mt-1">خلاصه وضعیت پایگاه اینترنتی و دسترسی‌های سریع</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.to}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${c.bg} ${c.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-navy-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-navy-950 font-mono">
                  {loading ? '...' : c.count}
                </div>
                <div className="text-xs text-slate-500 mt-1">{c.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-navy-950">اقدامات سریع</h3>
          <div className="space-y-2">
            <Link
              to="/admin/achievements"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>+ ثبت افتخار یا مدال جدید</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </Link>
            <Link
              to="/admin/news"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-turquoise-50 hover:text-turquoise-700 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>+ انتشار خبر یا اطلاعیه جدید</span>
              <Newspaper className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/teachers"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-turquoise-50 hover:text-turquoise-700 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>+ افزودن معلم یا استاد جدید</span>
              <Users className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/media"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-turquoise-50 hover:text-turquoise-700 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>+ آپلود عکس یا فایل سند PDF</span>
              <Image className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-navy-950">آخرین وقایع ثبت‌شده در سیستم (Audit Log)</h3>
          {auditLogs.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-700 font-medium">
                      توسط {log.user?.fullName || log.user?.username || 'مدیر'} ({log.entity})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString('fa-IR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">هنوز وقایعی ثبت نشده است.</p>
          )}
        </div>

      </div>
    </div>
  );
}
