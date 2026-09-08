import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import CredentialsTicker from './components/CredentialsTicker';
import NewsSection from './components/NewsSection';
import SchoolsShowcase from './components/SchoolsShowcase';
import IdentitySection from './components/IdentitySection';
import FastConsultation from './components/FastConsultation';
import Footer from './components/Footer';
import SchoolPanelModal from './components/SchoolPanelModal';
import CertificateModal from './components/CertificateModal';
import NewsModal from './components/NewsModal';

function App() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedSchool(null);
        setSelectedCredential(null);
        setSelectedNews(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    if (selectedSchool || selectedCredential || selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedSchool, selectedCredential, selectedNews]);

  const handleScrollToNews = () => {
    const el = document.getElementById('news');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToIdentity = () => {
    const el = document.getElementById('identity');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-turquoise-500 selection:text-white">
      {/* 1. Hero Section (Matched with user's uploaded photo: 4 cards at top, center logo and title) */}
      <Hero
        onSelectSchool={setSelectedSchool}
        onScrollToNews={handleScrollToNews}
        onScrollToIdentity={handleScrollToIdentity}
      />

      {/* 2. Running Ticker of Credentials, Licenses and Accreditations (Requested: نوار روان مدارک و اسناد معتبر) */}
      <CredentialsTicker
        onSelectCredential={setSelectedCredential}
      />

      {/* 3. Important News & Announcements (Requested: بخش اخبار مهم در صفحه اول) */}
      <NewsSection
        onSelectNews={setSelectedNews}
      />

      {/* 4. Showcase of the 4 Sub-schools */}
      <SchoolsShowcase
        onSelectSchool={setSelectedSchool}
      />

      {/* 5. Brand Identity, Quranic Mission & Statistics (Requested: هویت این مجموعه رو تعریف کنه و تبلیغاتی باشه) */}
      <IdentitySection />

      {/* 6. Fast Consultation & Pre-registration Form */}
      <FastConsultation />

      {/* 7. Comprehensive Footer (Requested: ته این سایت ها شماره تماس ایمیل و اطلاعات) */}
      <Footer
        onSelectSchool={setSelectedSchool}
      />

      {/* Modals */}
      {/* School Dedicated Panel (Requested: پنل هر مدرسه معرفی معلم ها و افتخارات و معرفی هر مجموعه) */}
      {selectedSchool && (
        <SchoolPanelModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onSelectSchool={setSelectedSchool}
        />
      )}

      {/* Certificate / Accreditation Detailed Verification Modal */}
      {selectedCredential && (
        <CertificateModal
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
        />
      )}

      {/* News Article Full View Modal */}
      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
}

export default App;
