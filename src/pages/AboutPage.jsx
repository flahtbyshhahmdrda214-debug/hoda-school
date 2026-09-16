import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Target, Eye, Heart, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 to-navy-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30 rounded-full text-xs font-semibold">
            هویت، فلسفه و تاریخچه
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            درباره مجتمع آموزشی قرآنی هدی
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            بیش از یک دهه پیشگامی در تلفیق عمیق تربیت قرآنی با سرآمدی نخبگانی علوم روز
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        {/* Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-2xl font-bold text-navy-950 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-turquoise-600" />
            <span>روایت تأسیس و فلسفه وجودی</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-loose">
            «مجتمع آموزشی قرآنی هدی» با هدف ایجاد الگویی نوین در نظام آموزش و پرورش کشور، بر پایه پیوند اصیل معارف انسان‌ساز قرآن کریم و علوم روز بین‌المللی پایه‌گذاری گردید. باور بنیادین ما این است که علم‌آموزی حقیقی، بال پرواز انسانیت است و زمانی ثمره‌بخش خواهد بود که با تهذیب نفس، کرامت اخلاقی و محبت به اهل‌بیت عصمت و طهارت (ع) آمیخته گردد.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl w-fit">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">چشم‌انداز (Vision)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تبدیل شدن به معتبرترین مجتمع آموزشی قرآنی خاورمیانه در پرورش دانشمندان مؤمن، اخلاق‌مدار، خلاق و تحول‌آفرین در تراز تمدن نوین اسلامی.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-3">
            <div className="p-3 bg-turquoise-50 text-turquoise-700 rounded-2xl w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">مأموریت (Mission)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ارائه برترین آموزش‌های شناختی، هوش محاسباتی، زبان‌های خارجی و المپیاد همراه با برنامه‌های تدریجی، شیرین و کاربردی انس با قرآن مجید.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-3">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl w-fit">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">ارزش‌های بنیادین</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              کرامت کودک و نوجوان، حقیقت‌جویی علمی، صداقت سازمانی، عدالت آموزشی و مسئولیت‌پذیری در قبال خانواده و جامعه.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
