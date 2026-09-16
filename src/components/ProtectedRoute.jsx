import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

export default function ProtectedRoute({ allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const user = getCurrentUser();
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold text-rose-600 mb-2">عدم دسترسی</h2>
          <p className="text-slate-600 text-sm mb-4">شما مجوز مشاهده این صفحه را ندارید.</p>
          <a href="/admin" className="text-sm text-turquoise-600 font-bold hover:underline">بازگشت به داشبورد</a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
