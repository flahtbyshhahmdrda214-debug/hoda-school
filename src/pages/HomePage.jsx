import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CredentialsTicker from '../components/CredentialsTicker';
import NewsSection from '../components/NewsSection';
import HonorsSection from '../components/HonorsSection';
import IdentitySection from '../components/IdentitySection';
import Footer from '../components/Footer';
import SchoolPanelModal from '../components/SchoolPanelModal';
import CertificateModal from '../components/CertificateModal';
import NewsModal from '../components/NewsModal';

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

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
      <Navbar />

      <Hero
        onSelectSchool={setSelectedSchool}
        onScrollToNews={handleScrollToNews}
        onScrollToIdentity={handleScrollToIdentity}
      />

      <CredentialsTicker onSelectCredential={setSelectedCredential} />

      {/* Hall of Fame / Honors & Achievements */}
      <HonorsSection />

      <NewsSection onSelectNews={setSelectedNews} />

      <IdentitySection />

      <Footer onSelectSchool={setSelectedSchool} />

      {selectedSchool && (
        <SchoolPanelModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onSelectSchool={setSelectedSchool}
        />
      )}

      {selectedCredential && (
        <CertificateModal
          item={selectedCredential}
          onClose={() => setSelectedCredential(null)}
        />
      )}

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
}
