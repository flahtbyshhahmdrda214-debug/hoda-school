import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { History } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiRequest('/users/audit-logs?limit=100').then((res) => {
      setLogs(res?.items || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-950">گزارش وقایع و لاگ‌های امنیتی (Audit Logs)</h2>
        <p className="text-xs text-slate-500 mt-1">ثبت زمان‌دار تمامی عملیات ورود، تغییر و حذف داده‌ها</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">عملیات</th>
              <th className="p-4">موجودیت</th>
              <th className="p-4">کاربر مجری</th>
              <th className="p-4">IP کاربر</th>
              <th className="p-4">زمان ثبت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                <td className="p-4 font-bold text-navy-950">{log.action}</td>
                <td className="p-4 text-slate-600">{log.entity}</td>
                <td className="p-4 text-slate-700 font-sans font-medium">{log.user?.fullName || log.user?.username || 'سیستم'}</td>
                <td className="p-4 text-slate-400">{log.ipAddress || '—'}</td>
                <td className="p-4 text-slate-500">{new Date(log.createdAt).toLocaleString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
