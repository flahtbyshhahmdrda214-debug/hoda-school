import React, { useState } from 'react';
import { membersData } from '../data/membersData';
import { 
  Users, Crown, GraduationCap, Building, Award, CheckCircle2, 
  Phone, Mail, ArrowLeft, ExternalLink, X, Quote, Sparkles, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MembersSection() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'director', 'trustees', 'principals'
  const [selectedMember, setSelectedMember] = useState(null);

  const { director, trustees, principals } = membersData;

  const showDirector = activeTab === 'all' || activeTab === 'director';
  const showTrustees = activeTab === 'all' || activeTab === 'trustees';
  const showPrincipals = activeTab === 'all' || activeTab === 'principals';

  return (
    <section id="members" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden scroll-mt-20">
      
      {/* Background Subtle Decors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-50 text-navy-800 border border-navy-200 text-xs font-bold tracking-wide">
            <Users className="w-4 h-4 text-turquoise-600" />
            <span>ارکان راهبری و سرمایه انسانی مجتمع</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight">
            معرفی ارکان و مسئولان مجتمع هدی
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            مدیریت کلان، اعضای محترم هیئت امنا و مدیران متخصص مدارس چهارگانه؛ پیشگامان تعلیم و تربیت قرآنی و بالندگی علمی
          </p>

          {/* Filter Tab Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              همه ارکان مجتمع
            </button>
            <button
              onClick={() => setActiveTab('director')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'director'
                  ? 'bg-turquoise-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>مدیر مجتمع</span>
            </button>
            <button
              onClick={() => setActiveTab('trustees')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'trustees'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>اعضای هیئت امنا</span>
            </button>
            <button
              onClick={() => setActiveTab('principals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'principals'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>مدیران مدارس چهارگانه</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LEVEL 1: مدیر مجتمع (Complex Director)                                   */}
        {/* ========================================================================= */}
        {showDirector && (
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-2 mb-6 text-xs font-bold text-turquoise-700 bg-turquoise-50 px-3 py-1.5 rounded-full w-fit border border-turquoise-200">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>ریاست و هدایت راهبردی مجتمع</span>
            </div>

            <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-navy-800 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">
                
                {/* Director Avatar & Quick Meta */}
                <div className="flex flex-col items-center flex-shrink-0 text-center">
                  <div className="relative group">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-turquoise-500/30 shadow-2xl bg-navy-850 p-1">
                      <img 
                        src={director.avatar} 
                        alt={director.name} 
                        className="w-full h-full object-cover object-top rounded-2xl group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-navy-950 text-[11px] font-black px-3.5 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap">
                      <Crown className="w-3 h-3 text-navy-950" />
                      مدیریت کل مجتمع
                    </span>
                  </div>

                  <div className="mt-6 space-y-1 text-slate-300 text-xs">
                    <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-turquoise-400" />
                      <span>{director.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-turquoise-400" />
                      <span>{director.email}</span>
                    </div>
                  </div>
                </div>

                {/* Director Detailed Info */}
                <div className="flex-1 text-right space-y-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-turquoise-500/20 text-turquoise-300 text-xs font-bold rounded-lg border border-turquoise-500/30 mb-2">
                      {director.title}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {director.name}
                    </h3>
                    <p className="text-sm text-turquoise-200 font-semibold mt-1">
                      {director.degree}
                    </p>
                  </div>

                  {/* Slogan Quote */}
                  <div className="bg-navy-900/80 border-r-4 border-amber-400 rounded-2xl p-4 text-slate-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-inner">
                    <Quote className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="font-semibold italic text-amber-100">
                      {director.slogan}
                    </p>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {director.bio}
                  </p>

                  {/* Responsibilities Grid */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-turquoise-300 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>محورهای راهبری و نظارت عالیه:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {director.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-turquoise-400 flex-shrink-0" />
                          <span className="leading-normal">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedMember(director)}
                      className="px-5 py-2.5 bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>مشاهده رزومه و پیام ریاست</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEVEL 2: اعضای هیئت امنا (Board of Trustees)                             */}
        {/* ========================================================================= */}
        {showTrustees && (
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-800 bg-navy-50 px-3 py-1.5 rounded-full border border-navy-200">
                <GraduationCap className="w-4 h-4 text-navy-700" />
                <span>اعضای محترم هیئت امنا و شورای سیاست‌گذاری</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">۴ عضو شورای راهبردی</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustees.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-turquoise-400 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="relative mx-auto w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-turquoise-400 transition-colors bg-slate-50">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute bottom-1.5 right-1.5 bg-navy-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        هیئت امنا
                      </span>
                    </div>

                    {/* Names & Position */}
                    <div className="text-center space-y-1">
                      <h3 className="text-base font-bold text-navy-950 group-hover:text-turquoise-700 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-turquoise-700">
                        {member.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {member.degree}
                      </p>
                    </div>

                    {/* Highlight Pill */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-relaxed text-right">
                      <span className="font-bold text-navy-900 block mb-0.5">مسئولیت راهبردی:</span>
                      <span>{member.highlight}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-turquoise-600 group-hover:text-turquoise-700">
                    <span>مشاهده سوابق و بیوگرافی</span>
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEVEL 3: مدیران مدارس چهارگانه (School Principals)                        */}
        {/* ========================================================================= */}
        {showPrincipals && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                <Building className="w-4 h-4 text-blue-600" />
                <span>مدیران متعهد و متخصص مدارس چهارگانه هدی</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">۴ شعبه آموزشی پیشرو</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principals.map((principal) => (
                <div
                  key={principal.id}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-turquoise-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* School Header Badge with 3D Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${principal.badgeClass}`}>
                        {principal.schoolName}
                      </span>
                      <img 
                        src={principal.icon3d} 
                        alt={principal.schoolName} 
                        className="w-8 h-8 object-contain drop-shadow-sm group-hover:rotate-6 transition-transform" 
                      />
                    </div>

                    {/* Principal Avatar */}
                    <div className="relative mx-auto w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-turquoise-400 transition-colors bg-slate-50">
                      <img 
                        src={principal.avatar} 
                        alt={principal.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    {/* Name and School Position */}
                    <div className="text-center space-y-1">
                      <h3 className="text-base font-bold text-navy-950 group-hover:text-turquoise-700 transition-colors">
                        {principal.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-700">
                        {principal.title}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {principal.degree}
                      </p>
                    </div>

                    {/* School Level & Phone */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-right text-xs">
                      <div className="text-[11px] text-slate-600 leading-snug">
                        <span className="font-bold text-navy-900 block mb-0.5">مقطع آموزشی:</span>
                        <span>{principal.schoolLevel}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>تماس مستقیم:</span>
                        <span className="font-bold text-slate-700">{principal.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Bio Modal & View School */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMember(principal)}
                      className="text-xs font-bold text-slate-600 hover:text-turquoise-700 transition-colors cursor-pointer"
                    >
                      سوابق مدیر
                    </button>
                    <Link
                      to={`/schools/${principal.schoolSlug}`}
                      className="px-3 py-1.5 bg-turquoise-50 hover:bg-turquoise-600 text-turquoise-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>صفحه مدرسه</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MEMBER DETAIL MODAL                                                       */}
      {/* ========================================================================= */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute left-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Profile */}
            <div className="flex items-center gap-4 text-right">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-turquoise-500/30 flex-shrink-0 bg-slate-100 shadow-md">
                <img 
                  src={selectedMember.avatar} 
                  alt={selectedMember.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-turquoise-50 text-turquoise-700 border border-turquoise-200">
                  {selectedMember.roleLabel}
                </span>
                <h3 className="text-xl font-black text-navy-950">
                  {selectedMember.name}
                </h3>
                <p className="text-xs font-bold text-turquoise-700">
                  {selectedMember.title}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedMember.degree}
                </p>
              </div>
            </div>

            {/* Slogan if available */}
            {selectedMember.slogan && (
              <div className="bg-amber-50 border-r-4 border-amber-500 p-3.5 rounded-xl text-amber-900 text-xs italic font-medium leading-relaxed">
                {selectedMember.slogan}
              </div>
            )}

            {/* Bio */}
            <div className="space-y-2 text-right">
              <h4 className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-turquoise-600" />
                <span>شرح سوابق و تجربیات:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedMember.bio}
              </p>
            </div>

            {/* Experience & Responsibilities */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-right text-xs">
              <div className="font-bold text-navy-900">
                سابقه خدمت و تخصص:
              </div>
              <p className="text-slate-600">
                {selectedMember.experience}
              </p>
              {selectedMember.responsibilities && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <div className="font-bold text-navy-900">شرح وظایف و اختیارات:</div>
                  {selectedMember.responsibilities.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-turquoise-600 flex-shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact / Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="text-slate-500 font-mono text-[11px]">
                {selectedMember.phone && <span>تماس: {selectedMember.phone}</span>}
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
