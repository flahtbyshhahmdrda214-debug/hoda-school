import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Trophy, 
  GraduationCap, 
  Phone, 
  MapPin, 
  Mail, 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Calendar,
  Send
} from 'lucide-react';
import { schoolsData } from '../data/schoolsData';

export default function SchoolPanelModal({ school, onClose, onSelectSchool }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'teachers' | 'honors'

  if (!school) return null;

  const tabs = [
    { id: 'overview', label: 'معرفی مجموعه و امکانات', icon: Building2 },
    { id: 'teachers', label: `معرفی کادر و معلمان (${school.teachers.length})`, icon: Users },
    { id: 'honors', label: `افتخارات و دستاوردها (${school.honors.length})`, icon: Trophy },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Modal Header */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${school.colorClasses.gradient} text-white relative flex-shrink-0 overflow-hidden`}>
          {/* Ambient luminous glow */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Row: Switch schools & Close button */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {/* Quick Switcher Between 4 Schools */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <span className="text-xs text-white/80 ml-2 hidden sm:inline">جابجایی بین مدارس:</span>
              {schoolsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSchool(s);
                    setActiveTab('overview');
                                      }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    s.id === school.id
                      ? 'bg-white text-navy-900 shadow-md scale-105'
                      : 'bg-white/15 text-white hover:bg-white/30'
                  }`}
                >
                  {s.shortName}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* School Titles & 3D Clay Icon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Free-Floating 3D Clay Icon */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
                <img
                  src={school.icon3d}
                  alt={school.shortName}
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transform hover:scale-110 transition-transform duration-300 pointer-events-none"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  پنل تخصصی {school.shortName}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                  {school.fullName}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed line-clamp-1">
                  {school.subtitle}
                </p>
              </div>
            </div>

            {/* Direct Phone badge */}
            <a
              href={`tel:${school.phone}`}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-navy-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform active:scale-95 self-start sm:self-center"
            >
              <Phone className="w-4 h-4 text-turquoise-600" />
              <span>تماس مستقیم: {school.phone}</span>
            </a>
          </div>

          {/* Quick Tabs Nav */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-navy-950 shadow-lg'
                      : 'bg-black/20 text-white hover:bg-black/30'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
          
          {/* TAB 1: OVERVIEW & FACILITIES */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Introduction Box */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-navy-950 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-turquoise-600" />
                  درباره و رسالت آموزشی {school.shortName}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {school.overview}
                </p>
              </div>

              {/* Quranic Educational Program */}
              <div className="bg-gradient-to-br from-turquoise-50 to-teal-50/50 rounded-2xl p-6 border border-turquoise-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-turquoise-600 text-white flex items-center justify-center shadow-md">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-turquoise-700 font-bold">برنامه اختصاصی قرآن و عترت</span>
                    <h4 className="text-base sm:text-lg font-black text-navy-950">
                      {school.quranicProgram.title}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {school.quranicProgram.features.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-turquoise-100 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-turquoise-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities Grid */}
              <div>
                <h3 className="text-lg font-black text-navy-950 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-turquoise-600" />
                  امکانات و فضاهای تخصصی
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {school.facilities.map((fac, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-turquoise-300 transition-colors">
                      <h4 className="text-sm font-bold text-navy-900 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-turquoise-500"></span>
                        {fac.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed pr-4">
                        {fac.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Contact Bar */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {school.address}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {school.email}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: TEACHERS & FACULTY */}
          {activeTab === 'teachers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-navy-950">
                    کادر آموزشی و معلمان منتخب {school.shortName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    اساتید نخبه با تخصص آکادمیک، سوابق درخشان و رویکرد تربیتی قرآنی
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-bold">
                  {school.teachers.length} استاد معرفی شده
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {school.teachers.map((teacher, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="flex gap-4">
                      {/* Teacher Avatar */}
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-black text-navy-950 truncate">
                          {teacher.name}
                        </h4>
                        <p className={`text-xs font-bold mt-0.5 ${school.colorClasses.accentText}`}>
                          {teacher.role}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {teacher.degree}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-2 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{teacher.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Highlight Pill */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                        <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{teacher.highlight}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HONORS & ACHIEVEMENTS */}
          {activeTab === 'honors' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-navy-950">
                    افتخارات، رتبه‌ها و دستاوردهای {school.shortName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    درخشش در مسابقات سراسری قرآن کریم، المپیادهای علمی و آزمون‌های شاخص
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {school.honors.map((honor, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          سال {honor.year}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-navy-950 mt-1">
                          {honor.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          توسط: <span className="text-slate-800 font-semibold">{honor.recipient}</span>
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          )}

          

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
          <span>کد واحد آموزشی: {school.slug}-hoda</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
}
