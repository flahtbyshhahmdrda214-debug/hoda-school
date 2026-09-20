import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import SchoolDetailPage from './pages/SchoolDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CredentialsPage from './pages/CredentialsPage';
import AboutPage from './pages/AboutPage';
import SyncPage from './pages/SyncPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchools from './pages/admin/AdminSchools';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminNews from './pages/admin/AdminNews';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminMedia from './pages/admin/AdminMedia';
import AdminMembers from './pages/admin/AdminMembers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTypography from './pages/admin/AdminTypography';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import ProtectedRoute from './components/ProtectedRoute';
import { initSiteFont } from './services/fontService';
import { initAutoCloudSync } from './services/cloudSyncService';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    const fontCleanup = initSiteFont();
    const cloudCleanup = initAutoCloudSync();
    return () => {
      if (typeof fontCleanup === 'function') fontCleanup();
      if (typeof cloudCleanup === 'function') cloudCleanup();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Visitor Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/schools/:slug" element={<SchoolDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sync" element={<SyncPage />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin CMS Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="schools" element={<AdminSchools />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="typography" element={<AdminTypography />} />
            <Route path="fonts" element={<AdminTypography />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Route>

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
