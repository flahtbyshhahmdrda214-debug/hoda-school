import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await apiRequest('/users');
    setUsers(data || []);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-950">کاربران و سطوح دسترسی</h2>
        <p className="text-xs text-slate-500 mt-1">مدیریت حساب‌های مدیران ارشد، مدیران مدارس و دبیران</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">نام کامل</th>
              <th className="p-4">نام کاربری</th>
              <th className="p-4">ایمیل</th>
              <th className="p-4">نقش دسترسی</th>
              <th className="p-4">مدرسه متصل</th>
              <th className="p-4">آخرین ورود</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-navy-950">{u.fullName}</td>
                <td className="p-4 font-mono text-slate-600">{u.username}</td>
                <td className="p-4 font-mono text-slate-500">{u.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-navy-900 text-turquoise-400 rounded-lg text-[10px] font-mono font-bold">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{u.school?.shortName || 'تمامی مدارس'}</td>
                <td className="p-4 font-mono text-slate-400">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fa-IR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
