import React from 'react';
import { 
  HeartHandshake, 
  BookOpen, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Quote, 
  GraduationCap, 
  Compass, 
  Smile, 
  Lightbulb 
} from 'lucide-react';

export default function IdentitySection() {
  const pillars = [
    {
      icon: BookOpen,
      title: 'تربیت قرآنی و سبک زندگی مومنانه',
      desc: 'نگاه ما به قرآن فراتر از حفظ صِرف است؛ آموزش تدبر در آیات، نهادینه‌سازی اخلاق علوی و انس دلنشین دانش‌آموز با کلام وحی در تمام ساعات حضور.',
      accent: 'text-turquoise-600',
      bg: 'bg-turquoise-50',
      border: 'border-turquoise-200'
    },
    {
      icon: Target,
      title: 'سرآمدی علمی، المپیاد و کنکور',
      desc: 'بهره‌گیری از زبده‌ترین اساتید طراح آزمون، برنامه‌ریزی شخصی‌سازی‌شده مطالعاتی، پانسیون‌های VIP و دست‌یابی مداوم به رتبه‌های تک‌رقمی کشور.',
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      icon: Lightbulb,
      title: 'مهارت‌آموزی نوین و فناوری آینده',
      desc: 'لابراتوار هوش مصنوعی، آموزش کدنویسی و رباتیک، تقویت استدلال منطقی و فن بیان تا فارغ‌التحصیلان هدی رهبران فردا باشند.',
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      icon: Smile,
      title: 'محیط شاداب، امن و سلامت روان',
      desc: 'سالن‌های ورزشی استاندارد، مشاوران مقیم روان‌شناختی، اردوهای هدفمند زیارتی-علمی و فضایی که یادگیری را به خاطره‌ای شیرین بدل می‌سازد.',
      accent: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  ];

  const stats = [
    { value: '۴', label: 'مدرسه تخصصی زیرمجموعه' },
    { value: '۱۱۵۰+', label: 'دانش‌آموز پویا و موفق' },
    { value: '۴۸۰+', label: 'حافظ قرآن در سطوح مختلف' },
    { value: '۱۱۰+', label: 'عضو هیئت علمی و معلم نخبه' },
    { value: '۹۸٪', label: 'قبولی رشته‌های برتر دانشگاهی' },
  ];

  return (
    <section id="identity" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-turquoise-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-turquoise-500/10 text-turquoise-300 text-xs font-bold mb-3 border border-turquoise-500/20">
            <Compass className="w-4 h-4 text-turquoise-400" />
            هویت، فلسفه و رسالت مجتمع هدی
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-vazir text-white">
            چرا مجتمع آموزشی قرآنی هدی انتخاب اول اولیاست؟
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            ما در مجتمع هدی با تلفیق اصالت ایمانی و علم‌آموزی مدرن، محیطی خلق کرده‌ایم که فرزندانمان هم در علم پیشتاز باشند و هم قلبی آرام و منور به نور کلام وحی داشته باشند.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 hover:border-turquoise-500/60 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.accent} flex items-center justify-center mb-5 shadow-inner`}>
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Numbers & Statistics Counter Strip */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-slate-800 to-navy-950 p-8 border border-slate-700 shadow-2xl mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-turquoise-400 font-mono">
                  {st.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Complex Director Vision Box */}
        <div className="rounded-3xl bg-slate-800/60 border border-slate-700 p-8 sm:p-10 relative overflow-hidden">
          <Quote className="absolute -bottom-6 -left-6 w-36 h-36 text-slate-700/30 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            <div className="w-24 h-24 rounded-full border-2 border-turquoise-400 p-1 flex-shrink-0">
              <img
                src="/assets/director-avatar.png"
                alt="ریاست مجتمع آموزشی هدی"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-xs text-turquoise-400 font-bold block mb-1">
                سخن مدیریت مجتمع آموزشی قرآنی هدی
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                «فرزندان ما امانت‌های الهی هستند. باور بنیادین ما در مجتمع هدی این است که تعالی اخلاقی و انس با کلام وحی، بزرگ‌ترین پیشران نبوغ علمی و خودباوری دانش‌آموز است. ما متعهدیم راهی بسازیم که در آن، اخلاق و علم همگام با هم به اوج برسند.»
              </p>
              <div className="mt-3 text-xs text-slate-400 font-medium">
                دکتر علیرضا میرصادقی • ریاست شورای راهبری مجتمع آموزشی قرآنی هدی
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
