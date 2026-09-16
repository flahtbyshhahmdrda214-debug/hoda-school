import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CertificateModal from '../components/CertificateModal';
import { fetchDocuments } from '../services/documentsService';
import { ShieldCheck, Award, BookOpen, CheckCircle2, Trophy, Sparkles, Laptop, FileText } from 'lucide-react';

const ICON_MAP = {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  Trophy,
  Sparkles,
  Laptop,
};

export default function CredentialsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDocuments()
      .then((items) => setDocuments(items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 to-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30 rounded-full text-xs font-semibold">
            اعتبارسنجی و صلاحیت سازمانی
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            مجوزهای رسمی، اسناد اعتبار و استانداردها
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            تمامی فعالیت‌های آموزشی و پرورشی مدارس چهارگانه مجتمع هدی تحت نظارت رسمی و استانداردهای بین‌المللی است.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-turquoise-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">در حال بارگذاری مدارک...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, idx) => {
              const Icon = ICON_MAP[doc.iconName || doc.icon] || ShieldCheck;
              return (
                <div
                  key={doc.id || idx}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-turquoise-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-navy-50 text-navy-900 rounded-2xl group-hover:bg-turquoise-50 group-hover:text-turquoise-700 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      {doc.documentNumber && (
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                          {doc.documentNumber}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-navy-950 group-hover:text-turquoise-700 transition-colors">
                      {doc.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>مرجع: {doc.issuer}</span>
                    <span className="text-turquoise-600 font-bold group-hover:underline">مشاهده جزئیات</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedDoc && (
        <CertificateModal item={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}

      <Footer />
    </div>
  );
}
