import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchSchoolBySlug } from '../services/schoolsService';
import { onDataChanged } from '../services/dataEvents';
import { 
  Building2, BookOpen, Award, Users, MapPin, Phone, Mail, 
  ArrowRight, CheckCircle2, Sparkles, Trophy 
} from 'lucide-react';

export default function SchoolDetailPage() {
  const { slug } = useParams();
  const [school, setSchool] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = () => {
      fetchSchoolBySlug(slug)
        .then((data) => {
          setSchool(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    };
    load();
    const unsub = onDataChanged(() => {
      load();
    });
    return unsub;
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-turquoise-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 font-medium">در حال دریافت اطلاعات مدرسه...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
            <Building2 className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy-950 mb-2">مدرسه یافت نشد</h2>
            <p className="text-slate-600 text-sm mb-6">متأسفانه اطلاعات این مدرسه در دسترس نیست یا آدرس اشتباه است.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'معرفی و چشم‌انداز', icon: BookOpen },
    { id: 'teachers', label: 'کادر اساتید و معلمان', icon: Users },
    { id: 'facilities', label: 'امکانات و فضاها', icon: Building2 },
    { id: 'honors', label: 'افتخارات و رتبه‌ها', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className={`relative bg-gradient-to-b ${school.slug === 'boys-highschool' ? 'from-[#0b2246] via-[#143e74] to-navy-950' : 'from-navy-950 via-navy-900 to-navy-800'} text-white py-16 sm:py-24 overflow-hidden border-b border-navy-800`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#13B5DE_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Link to="/#schools" className="inline-flex items-center gap-2 text-sm text-turquoise-400 hover:text-turquoise-300 mb-6 group transition-colors">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>بازگشت به معرفی مدارس چهارگانه</span>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {school.icon3dUrl && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
                  <img src={school.icon3dUrl} alt={school.shortName} className="w-full h-full object-contain drop-shadow-xl" />
                </div>
              )}
              <div>
                <span className="inline-block px-3 py-1 bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30 rounded-full text-xs font-semibold mb-2">
                  {school.tag || school.shortName}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  {school.fullName || school.shortName}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {school.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Contact Badge */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl space-y-2 text-xs text-slate-300 w-full md:w-auto">
              {school.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-turquoise-400" />
                  <span>تلفن تماس: {school.phone}</span>
                </div>
              )}
              {school.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-turquoise-400" />
                  <span>ایمیل: {school.email}</span>
                </div>
              )}
              {school.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-turquoise-400" />
                  <span>نشانی: {school.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          {Array.isArray(school.stats) && school.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
              {school.stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-turquoise-400 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Contents */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-turquoise-600" />
                <span>رسالت و رویکرد تربیتی</span>
              </h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {school.overview}
              </p>
            </div>

            {/* Quranic Program */}
            {school.quranicProgramTitle && (
              <div className="bg-gradient-to-br from-turquoise-50/70 to-blue-50/70 rounded-3xl p-6 sm:p-10 border border-turquoise-200/70 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-turquoise-600 text-white rounded-2xl shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-950">{school.quranicProgramTitle}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">محورهای ویژه انس با کلام وحی و سیره اهل‌بیت (ع)</p>
                  </div>
                </div>

                {Array.isArray(school.quranicProgramFeatures) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {school.quranicProgramFeatures.map((feat, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-turquoise-100 flex items-start gap-3 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-turquoise-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 text-sm font-medium leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Teachers Tab */}
        {activeTab === 'teachers' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy-950 mb-2">اساتید و آموزگاران برجسته</h2>
              <p className="text-slate-600 text-sm">منتخبی از اساتید فرهیخته، مؤلفان کتب و حافظان قرآن شاغل در این مجموعه</p>
            </div>

            {Array.isArray(school.teachers) && school.teachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {school.teachers.map((teacher, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-turquoise-400 transition-all flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={teacher.firstName ? `${teacher.firstName} ${teacher.lastName}` : teacher.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-turquoise-500/30"
                        />
                        <div>
                          <h3 className="text-base font-bold text-navy-950">
                            {teacher.firstName ? `${teacher.firstName} ${teacher.lastName}` : teacher.name}
                          </h3>
                          <span className="text-xs text-turquoise-700 font-medium block mt-0.5">
                            {teacher.roleTitle || teacher.role}
                          </span>
                        </div>
                      </div>

                      {teacher.degree && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          🎓 {teacher.degree}
                        </p>
                      )}

                      {teacher.highlight && (
                        <p className="text-xs text-navy-900 font-medium bg-turquoise-50/50 p-2.5 rounded-xl border border-turquoise-100">
                          ⭐ {teacher.highlight}
                        </p>
                      )}
                    </div>

                    {teacher.experience && (
                      <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
                        سابقه: {teacher.experience}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                اطلاعات آموزگاران به زودی تکمیل خواهد شد.
              </div>
            )}
          </div>
        )}

        {/* 3. Facilities Tab */}
        {activeTab === 'facilities' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy-950 mb-2">فضاها و امکانات استاندارد</h2>
              <p className="text-slate-600 text-sm">محیط فیزیکی ایمن، مدرن و مجهز به جدیدترین فناوری‌های آموزشی و کمک‌آموزشی</p>
            </div>

            {Array.isArray(school.facilities) && school.facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {school.facilities.map((fac, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-turquoise-400 transition-all flex items-start gap-4">
                    <div className="p-3 bg-navy-50 text-navy-900 rounded-2xl">
                      <Building2 className="w-6 h-6 text-turquoise-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy-950 mb-1">{fac.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {fac.description || fac.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                لیست امکانات به زودی منتشر خواهد شد.
              </div>
            )}
          </div>
        )}

        {/* 4. Honors Tab */}
        {activeTab === 'honors' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy-950 mb-2">افتخارات و رتبه‌های درخشان</h2>
              <p className="text-slate-600 text-sm">مدال‌های رنگارنگ، رتبه‌های المپیاد، مسابقات قرآنی و کنکور سراسری دانش‌آموزان</p>
            </div>

            {Array.isArray(school.achievements || school.honors) && (school.achievements || school.honors).length > 0 ? (
              <div className="space-y-4">
                {(school.achievements || school.honors).map((honor, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-400 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0 mt-0.5 sm:mt-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-navy-950">{honor.title}</h3>
                        {honor.recipient && (
                          <p className="text-xs text-slate-500 mt-0.5">دریافت‌کننده: {honor.recipient}</p>
                        )}
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                      سال {honor.year}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                افتخارات این مجموعه در حال تکمیل است.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
