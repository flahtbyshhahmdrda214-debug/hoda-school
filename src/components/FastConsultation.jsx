import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, PhoneCall, HelpCircle, ShieldCheck } from 'lucide-react';
import { schoolsData } from '../data/schoolsData';

export default function FastConsultation() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    schoolId: '1',
    studentName: '',
    parentName: '',
    phone: '',
    grade: '',
    question: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="fast-consultation" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Decorative/Informational Column (4 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-turquoise-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                مشاوره و پیش‌ثبت‌نام
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                آینده درخشان فرزندتان از اینجا آغاز می‌شود
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                جهت دریافت وقت مصاحبه حضوری، سنجش استعدادیابی، یا بازدید از فضای آموزشی مدارس چهارگانه، فرم را تکمیل نمایید.
              </p>
            </div>

            <div className="my-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span>مشاوره کاملاً رایگان تحصیلی و روان‌شناختی</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span>بررسی شرایط بورسیه ویژه نخبگان قرآنی و علمی</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span>پاسخگویی سریع کارشناسان در کمتر از ۲۴ ساعت</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center gap-3 text-xs text-slate-300">
              <PhoneCall className="w-4 h-4 text-turquoise-400" />
              <span>پاسخگویی تلفنی فوری: ۰۲۱-۷۷۲۴۱۰۱۰</span>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-navy-950 mb-2">
                  درخواست شما با موفقیت ثبت شد!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  مشاوران ارشد پذیرش مجتمع هدی به زودی با شماره تماس اعلامی شما ارتباط برقرار خواهند کرد.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                >
                  ارسال فرم جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-xl font-black text-navy-950 mb-4">
                  ثبت نام و درخواست مشاوره اولیه
                </h4>

                {/* School Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    مدرسه مورد نظر را انتخاب کنید *
                  </label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({...formData, schoolId: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-turquoise-500 font-medium"
                  >
                    {schoolsData.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shortName}: {s.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student & Parent names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام و نام خانوادگی دانش‌آموز *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      placeholder="مثال: فاطمه احمدی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-turquoise-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام ولی دانش‌آموز *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      placeholder="مثال: آقای دکتر احمدی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                {/* Phone and Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      شماره تماس همراه *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="۰۹۱۲XXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-turquoise-500 text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      مقطع و پایه تحصیلی *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      placeholder="مثال: پایه هفتم متوسطه اول"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-turquoise-500"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    پرسش یا درخواست خاص شما
                  </label>
                  <textarea
                    rows="2"
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="اگر سوالی در مورد شرایط مصاحبه، آزمون یا شهریه دارید بنویسید..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-turquoise-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-turquoise-600 hover:bg-turquoise-700 text-white font-bold text-sm shadow-lg hover:shadow-turquoise-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ثبت و ارسال به واحد پذیرش مجتمع هدی</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
