import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create SuperAdmin User
  const adminPasswordHash = await argon2.hash('AdminHoda2026!#', {
    type: argon2.argon2id,
  });

  const superAdmin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPasswordHash,
      fullName: 'مدیر ارشد مجتمع هدی',
      email: 'admin@hodaschool.ir',
      role: 'SUPERADMIN',
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'admin@hodaschool.ir',
      passwordHash: adminPasswordHash,
      fullName: 'مدیر ارشد مجتمع هدی',
      role: 'SUPERADMIN',
      isActive: true,
    },
  });

  console.log(`✅ SuperAdmin user seeded: ${superAdmin.username} (${superAdmin.email})`);

  // 2. Schools Data
  const schools = [
    {
      slug: 'boys-elementary',
      shortName: 'دبستان پسرانه',
      fullName: 'دبستان پسرانه قرآنی هدی (پیش‌دبستان و دوره اول و دوم ابتدایی)',
      subtitle: 'محیطی شاداب، پویا و امن؛ پیوند تربیت اصیل قرآنی با یادگیری خلاق، مهارت‌محور و دست‌ورزی',
      themeColor: 'blue',
      tag: 'پیش‌دبستان و پایه‌های ۱ تا ۶',
      icon3dUrl: '/assets/icon-school1.png',
      phone: '۰۲۱-۷۷۲۴۱۰۱۱',
      email: 'boys-elementary@hoda-complex.ir',
      address: 'تهران، خیابان پاسداران، بوستان پنجم، پلاک ۲۸',
      sortOrder: 1,
      overview: 'دبستان پسرانه هدی بستری پرنشاط، امن و مبتنی بر روان‌شناسی کودک فراهم آورده است تا دانش‌آموزان در آغازین گام‌های تحصیل، با زبان مهر و بازی با قرآن کریم مأنوس شوند. رویکرد ما در این دوره، یادگیری فعال از طریق بازی، کشف، دست‌ورزی و تقویت مهارت‌های زیستی، آداب اجتماعی و الفبای قرآنی است.',
      quranicProgramTitle: 'طرح رویش نور (انس کودک با قرآن)',
      quranicProgramFeatures: JSON.stringify([
        'آموزش حفظ سوره‌های کوچک همراه با قصه‌های تمثیلی و انیمیشن',
        'تثبیت تجوید مقدماتی و روان‌خوانی با نوای شعر و همخوانی گروهی',
        'پرورش مهارت‌های اخلاقی با الهام از آیات سبک زندگی اسلامی',
        'جشن باشکوه تکلیف و محافل هفتگی انس با کلام وحی'
      ]),
      stats: JSON.stringify([
        { label: 'دانش‌آموز پویا و شاداب', value: '۲۸۰+' },
        { label: 'آموزگار و مربی متخصص', value: '۲۴' },
        { label: 'حافظ جزء ۳۰ و سوره‌های منتخب', value: '۱۹۰' },
        { label: 'کارگاه خلاقیت، رباتیک و بازی', value: '۶' }
      ]),
      facilities: [
        { title: 'اتاق بازی و لگوی خلاق', description: 'تجهیز شده با بازی‌های فکری جهت تقویت هوش هیجانی، فضایی و ریاضی' },
        { title: 'کارگاه دست‌ورزی و هنر', description: 'پرورش خلاقیت، خط، نقاشی و هنرهای تجسمی متناسب با سن کودک' },
        { title: 'سالن چندمنظوره ورزشی و نشاط', description: 'کفپوش استاندارد آنتی‌شوک برای تحرک، ژیمناستیک و تربیت بدنی ایمن' },
        { title: 'کتابخانه تخصصی کودک', description: 'بیش از ۱۵۰۰ جلد کتاب داستان قرآنی، علمی و ادبیات کودک' },
        { title: 'دارالقرآن تخصصی نور', description: 'فضاسازی محرابی شاد و مجهز به تجهیزات هوشمند صوتی و تصویری' }
      ],
      teachers: [
        {
          firstName: 'علیرضا',
          lastName: 'طاهری',
          roleTitle: 'مدیر آموزشی و مربی لحن و قرائت قرآن',
          degree: 'کارشناسی علوم تربیتی و دارنده مدرک درجه ۲ حفظ قرآن',
          experience: '۱۲ سال سابقه تخصصی در مدارس برتر قرآنی',
          highlight: 'طراح شیوه آموزش نوین روخوانی تجسمی کودک',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        },
        {
          firstName: 'محمدرضا',
          lastName: 'صادقی',
          roleTitle: 'سرگروه پایه سوم و مدرس مهارت‌های ریاضی',
          degree: 'کارشناسی ارشد تکنولوژی آموزشی از دانشگاه تهران',
          experience: '۱۱ سال سابقه تدریس تخصصی دبستان',
          highlight: 'مدرس کشوری بازی‌وارسازی آموزش علوم پایه',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
        },
        {
          firstName: 'مهدی',
          lastName: 'کاظمی',
          roleTitle: 'مربی تخصصی رباتیک و هوش محاسباتی',
          degree: 'کارشناسی ارشد مهندسی نرم‌افزار دانشگاه صنعتی شریف',
          experience: '۸ سال سابقه مربیگری تیم‌های رباتیک دانش‌آموزی',
          highlight: 'مقام اول مسابقات کشوری رباتیک دانش‌آموزی ۱۴۰۲',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
        }
      ],
      achievements: [
        { year: '۱۴۰۳', title: 'کسب رتبه اول مسابقات همخوانی و اذان مدارس منطقه', recipient: 'گروه سرود و تواشیح نغمه نور', category: 'قرآنی' },
        { year: '۱۴۰۳', title: 'مقام نخست جشنواره جابربن‌حیان در محور طراحی و آزمایش', recipient: 'تیم پژوهشی پایه پنجم', category: 'علمی' },
        { year: '۱۴۰۲', title: 'مدال طلای مسابقات بین‌المللی لیگ ریاضی و تفکر خلاق', recipient: 'سیدمحمدمهدی حسینی', category: 'علمی' }
      ]
    },
    {
      slug: 'boys-highschool',
      shortName: 'دبیرستان پسرانه',
      fullName: 'دبیرستان پسرانه قرآنی هدی (متوسطه اول، متوسطه دوم و کنکور)',
      subtitle: 'سرآمدی علمی، المپیادها و رتبه‌های تک‌رقمی کنکور در پرتو تهذیب نفس و معارف ثقلین',
      themeColor: 'navy',
      tag: 'پایه‌های ۷ تا ۱۲ (متوسطه و کنکور)',
      icon3dUrl: '/assets/icon-school1.png',
      phone: '۰۲۱-۷۷۲۴۱۰۲۲',
      email: 'boys-highschool@hoda-complex.ir',
      address: 'تهران، خیابان پاسداران، بوستان ششم، پلاک ۳۴',
      sortOrder: 2,
      overview: 'دبیرستان پسرانه هدی کانون تربیت جوانان مؤمن، فکور، انقلابی و سرآمد علمی است. این مجموعه با بهره‌گیری از اساتید صاحب‌نام کنکور و المپیاد، بستری حرفه‌ای جهت رسیدن به مدارج عالی دانشگاهی همراه با درک عمیق معارف اهل‌بیت (ع) مهیا ساخته است.',
      quranicProgramTitle: 'طرح برهان (پژوهش تفسیری و عقیدتی جوان)',
      quranicProgramFeatures: JSON.stringify([
        'کرسی‌های آزاداندیشی و پاسخ تخصصی به شبهات اعتقادی و کلامی نوجوان',
        'حفظ موضوعی آیات کاربردی پیرامون هویت، هدفمندی و آینده‌پژوهی',
        'کارگاه‌های تخصصی فن خطابه، مناظره علمی و تدبر در نهج‌البلاغه',
        'اردوهای سالانه معنوی-زیارتی مشهد مقدس و اعتکاف رمضانیه'
      ]),
      stats: JSON.stringify([
        { label: 'دانش‌آموز دبیرستانی نخبه', value: '۳۵۰+' },
        { label: 'استاد تراز اول کنکور و المپیاد', value: '۳۸' },
        { label: 'رتبه زیر ۱۰۰۰ کنکور سراسری', value: '۴۲' },
        { label: 'مدال المپیادهای ملی و منطقه‌ای', value: '۱۷' }
      ]),
      facilities: [
        { title: 'آزمایشگاه جامع شیمی، فیزیک و نانو', description: 'دارای استانداردهای بین‌المللی ایمنی و تجهیزات ابزار دقیق سنجش' },
        { title: 'پایگاه محاسبات هوش مصنوعی و رباتیک', description: 'سرورهای اختصاصی پردازش گرافیکی، پرینتر ۳بعدی و شبیه‌سازها' },
        { title: 'سالن مطالعه VIP کنکور (پانسیون اختصاصی)', description: 'کابین‌های فردی آکوستیک، کمد اختصاصی و سیستم تهویه هوای مطبوع' },
        { title: 'مجموعه ورزشی چندمنظوره شهید طهرانی‌مقدم', description: 'زمین فوتسال و بسکتبال با کفپوش تارکت، سالن بدن‌سازی و تنیس' }
      ],
      teachers: [
        {
          firstName: 'دکتر حمیدرضا',
          lastName: 'کیانی',
          roleTitle: 'مدیر آموزشی متوسطه دوم و مدرس کنکور دیفرانسیل',
          degree: 'دکترای ریاضی کاربردی از دانشگاه صنعتی امیرکبیر',
          experience: '۱۶ سال تدریس در مدارس تیزهوشان و طراح آزمون‌های آزمایشی',
          highlight: 'مؤلف ۳ جلد کتاب پرفروش حسابان و هندسه تحلیلی',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        },
        {
          firstName: 'استاد حسین',
          lastName: 'میرزایی',
          roleTitle: 'سرگروه فیزیک و المپیاد نجوم',
          degree: 'کارشناسی ارشد فیزیک ذرات بنیادی از دانشگاه تهران',
          experience: '۱۴ سال سابقه آموزش و داوری المپیادهای فیزیک',
          highlight: 'پرورش ۳ دارنده مدال نقره و برنز المپیاد جهانی فیزیک',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
        }
      ],
      achievements: [
        { year: '۱۴۰۳', title: 'کسب مدال نقره المپیاد ملی کامپیوتر و هوش مصنوعی', recipient: 'امیرعلی رضوی', category: 'المپیاد' },
        { year: '۱۴۰۳', title: 'کسب ۶ رتبه زیر ۱۰۰ در کنکور سراسری ریاضی و تجربی', recipient: 'دانش‌آموزان پایه دوازدهم', category: 'کنکور' }
      ]
    },
    {
      slug: 'girls-elementary',
      shortName: 'دبستان دخترانه',
      fullName: 'دبستان دخترانه قرآنی هدی (پیش‌دبستان و دبستان دوره اول و دوم)',
      subtitle: 'شکوفایی عواطف، هوش هیجانی و معنویت کودکانه در محیطی آرامش‌بخش، شاد و الهام‌بخش',
      themeColor: 'pink',
      tag: 'پیش‌دبستان و پایه‌های ۱ تا ۶',
      icon3dUrl: '/assets/icon-school1.png',
      phone: '۰۲۱-۷۷۲۴۱۰۳۳',
      email: 'girls-elementary@hoda-complex.ir',
      address: 'تهران، خیابان شریعتی، بالاتر از پل رومی، بن‌بست هدی، پلاک ۱۲',
      sortOrder: 3,
      overview: 'دبستان دخترانه هدی گلستانی آراسته به فضایل فاطمی و لبریز از شوق کودکانه است. در این مرکز، با تکیه بر متدهای روان‌شناسی مثبت‌گرا، دختران نازنین در بستری پر از مهر، رنگ و هنر، ضمن فراگیری علوم روز با آیات نورانی کلام‌الله مجید مأنوس می‌گردند.',
      quranicProgramTitle: 'طرح شکوفه‌های بهشتی (تربیت زهرایی کودک)',
      quranicProgramFeatures: JSON.stringify([
        'حفظ سوره‌های جزء ۳۰ همراه با نقاشی، کاردستی و نمایش خلاق',
        'کارگاه‌های شعرخوانی، قصه‌گویی تمثیلی و انس دلنشین با احادیث اخلاقی',
        'طرح اختصاصی فرشتگان محراب جهت ترغیب شوقمندانه به نماز و نیایش',
        'آموزش روخوانی و روان‌خوانی با نرم‌افزارهای چندرسانه‌ای تعاملی'
      ]),
      stats: JSON.stringify([
        { label: 'دانش‌آموز پرنشاط و پرتلاش', value: '۳۱۰+' },
        { label: 'معلم و مربی باتجربه و دلسوز', value: '۲۶' },
        { label: 'حافظ جزء ۳۰ و سور منتخب', value: '۲۱۵' },
        { label: 'کارگاه هنر، خلاقیت و دست‌ورزی', value: '۷' }
      ]),
      facilities: [
        { title: 'آتلیه تخصصی نقاشی، خوشنویسی و صنایع دستی', description: 'فضایی آکنده از رنگ جهت تقویت خلاقیت بصری و ذوق هنری دختران' },
        { title: 'سالن ژیمناستیک و بازی‌های تعادلی و ریتمیک', description: 'ایمن‌سازی کامل دیوارها و کفپوش‌های آنتی‌باکتریال کودکانه' },
        { title: 'اتاق علوم تجربی، زیست‌شناسی و کاوشگری', description: 'ابزارهای ذره‌بین، میکروسکوپ و ماکت‌های تشریح جهت یادگیری عینی' },
        { title: 'باغچه گیاه‌شناسی و آموزش محیط زیست', description: 'فضای سبز حیاط جهت کاشت گل و گیاه و آشنایی با آفرینش پروردگار' }
      ],
      teachers: [
        {
          firstName: 'سرکار خانم مریم',
          lastName: 'حسینی',
          roleTitle: 'مدیر دبستان و کارشناس ارشد روان‌شناسی بالینی کودک',
          degree: 'کارشناسی ارشد روان‌شناسی از دانشگاه علامه طباطبایی',
          experience: '۱۵ سال مدیریت و مشاوره در مدارس دخترانه ممتاز تهران',
          highlight: 'مبتکر طرح تاب‌آوری عاطفی و تقویت عزت‌نفس دختران دبستان',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        },
        {
          firstName: 'سرکار خانم فاطمه',
          lastName: 'نیک‌روش',
          roleTitle: 'سرگروه پرورشی و مربی برجسته حفظ قرآن',
          degree: 'حافظ کل قرآن کریم و کارشناس علوم قرآن و حدیث',
          experience: '۱۰ سال تدریس تکنیک‌های حفظ تصویری به خردسالان',
          highlight: 'داور رسمی مسابقات استانی قرآن و اذان دانش‌آموزی',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
        }
      ],
      achievements: [
        { year: '۱۴۰۳', title: 'رتبه برتر استانی در مسابقات سرود همگانی و آواهای بومی', recipient: 'گروه سرود باران رحمت دبستان دخترانه', category: 'فرهنگی' },
        { year: '۱۴۰۲', title: 'مقام نخست المپیاد درون‌مدرسه‌ای بازی‌های فکری و ذهنی', recipient: 'حلما شمس و تینا فرهمند', category: 'علمی' }
      ]
    },
    {
      slug: 'girls-highschool',
      shortName: 'دبیرستان دخترانه',
      fullName: 'دبیرستان دخترانه قرآنی هدی (متوسطه اول، متوسطه دوم و آمادگی نخبگانی کنکور)',
      subtitle: 'تربیت بانوان فرهیخته، خودباور، دانشمند و طراز اول جامعه با تکیه بر الگوی زهرایی',
      themeColor: 'teal',
      tag: 'پایه‌های ۷ تا ۱۲ (متوسطه و کنکور)',
      icon3dUrl: '/assets/icon-school1.png',
      phone: '۰۲۱-۷۷۲۴۱۰۴۴',
      email: 'girls-highschool@hoda-complex.ir',
      address: 'تهران، خیابان شریعتی، بالاتر از پل رومی، خیابان شقایق، پلاک ۱۸',
      sortOrder: 4,
      overview: 'دبیرستان دخترانه هدی دانشگاه کوچکی است برای شکوفایی استعدادیابی همه‌جانبه دختران نوجوان در مسیر نخبگی علمی، متانت معنوی و مسئولیت‌پذیری اجتماعی. ما محیطی بالنده، پرامید و علمی فراهم ساخته‌ایم که در آن دختران برای فتح قله‌های کنکور و پژوهش‌های روز جهانی مجهز می‌شوند.',
      quranicProgramTitle: 'طرح ریحانه‌النبی (تدبر، معرفت و سبک زندگی)',
      quranicProgramFeatures: JSON.stringify([
        'دوره‌های آموزش تدبر در قرآن و ترجمه مفهومی با اساتید حوزه و دانشگاه',
        'سلسله نشست‌های بصیرت‌افزایی، پاسخ به پرسش‌های دختران نسل جدید',
        'کارگاه‌های تخصصی مهارت‌های ارتباطی، هوش هیجانی و سواد رسانه‌ای',
        'طرح هر دانش‌آموز یک مهارت زندگی اسلامی و سفیر ترویج نیکی‌ها'
      ]),
      stats: JSON.stringify([
        { label: 'دانش‌آموز دختر نخبه و پژوهشگر', value: '۳۳۰+' },
        { label: 'کادر اساتید و مشاوران برتر کنکور', value: '۳۵' },
        { label: 'قبولی در رشته‌های پزشکی و مهندسی', value: '۸۷٪' },
        { label: 'رتبه زیر ۵۰۰ کنکور سراسری', value: '۲۹' }
      ]),
      facilities: [
        { title: 'کتابخانه پژوهشی و سالن مطالعات فردی و گروهی', description: 'بیش از ۶۰۰۰ جلد منابع مرجع المپیاد، کنکور و کتب دانشگاهی' },
        { title: 'سایت تخصصی فناوری، کدنویسی و تولید محتوا', description: 'سیستم‌های به‌روز رایانه‌ای جهت آموزش طراحی وب، گرافیک و پایتون' },
        { title: 'کافه کتاب و فضای گفت‌وگو و استراحت تعاملی', description: 'محیطی صمیمی و آرام جهت مباحثات گروهی و تعامل با مشاوران' },
        { title: 'مجموعه ورزشی اختصاصی سرپوشیده (ایروبیک، بدمینتون و والیبال)', description: 'کفپوش حرفه‌ای و تهویه استاندارد جهت تندرستی و نشاط جسمانی' }
      ],
      teachers: [
        {
          firstName: 'دکتر زهره',
          lastName: 'سلیمانی',
          roleTitle: 'مدیر آموزشی متوسطه دوم و مشاور ارشد هدایت تحصیلی کنکور',
          degree: 'دکترای روان‌شناسی تربیتی از دانشگاه شهید بهشتی',
          experience: '۱۸ سال سابقه مشاوره رتبه‌های تک‌رقمی و دورقمی کنکور',
          highlight: 'طراح الگوی برنامه‌ریزی شخصی‌سازی‌شده و بدون استرس کنکور',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
        },
        {
          firstName: 'استاد سمیه',
          lastName: 'کریمی',
          roleTitle: 'سرگروه درس زیست‌شناسی و المپیاد پزشکی',
          degree: 'کارشناسی ارشد ژنتیک مولکولی از دانشگاه تهران',
          experience: '۱۲ سال سابقه تدریس تخصصی زیست کنکور تجربی',
          highlight: 'مدرس رتبه‌های برتر کشوری در کنکور علوم تجربی',
          avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80'
        }
      ],
      achievements: [
        { year: '۱۴۰۳', title: 'کسب مدال طلای المپیاد ادبی دانش‌آموزی کشور', recipient: 'فاطمه‌زهرا امینی', category: 'المپیاد' },
        { year: '۱۴۰۳', title: 'قبولی ۴ نفر از دانش‌آموزان در رشته پزشکی دانشگاه علوم پزشکی تهران', recipient: 'فارغ‌التحصیلان دوره ۱۴۰۳', category: 'کنکور' }
      ]
    }
  ];

  for (const s of schools) {
    const { facilities, teachers, achievements, ...schoolData } = s;

    const school = await prisma.school.upsert({
      where: { slug: schoolData.slug },
      update: schoolData,
      create: schoolData,
    });

    console.log(`🏫 Seeded school: ${school.shortName} (${school.slug})`);

    // Facilities
    if (facilities && facilities.length > 0) {
      await prisma.facility.deleteMany({ where: { schoolId: school.id } });
      for (let i = 0; i < facilities.length; i++) {
        await prisma.facility.create({
          data: {
            schoolId: school.id,
            title: facilities[i].title,
            description: facilities[i].description,
            sortOrder: i + 1,
            isPublished: true,
          }
        });
      }
    }

    // Teachers
    if (teachers && teachers.length > 0) {
      await prisma.teacher.deleteMany({ where: { schoolId: school.id } });
      for (let i = 0; i < teachers.length; i++) {
        await prisma.teacher.create({
          data: {
            schoolId: school.id,
            firstName: teachers[i].firstName,
            lastName: teachers[i].lastName,
            roleTitle: teachers[i].roleTitle,
            degree: teachers[i].degree,
            experience: teachers[i].experience,
            highlight: teachers[i].highlight,
            avatarUrl: teachers[i].avatarUrl,
            sortOrder: i + 1,
            isPublished: true,
          }
        });
      }
    }

    // Achievements
    if (achievements && achievements.length > 0) {
      await prisma.achievement.deleteMany({ where: { schoolId: school.id } });
      for (let i = 0; i < achievements.length; i++) {
        await prisma.achievement.create({
          data: {
            schoolId: school.id,
            year: achievements[i].year,
            title: achievements[i].title,
            recipient: achievements[i].recipient,
            category: achievements[i].category,
            sortOrder: i + 1,
            isPublished: true,
          }
        });
      }
    }
  }

  // 3. Seed News Articles
  const newsList = [
    {
      slug: 'pre-registration-new-academic-year',
      title: 'آغاز پیش‌ثبت‌نام سال تحصیلی جدید در مدارس چهارگانه مجتمع هدی',
      category: 'اطلاعیه مهم',
      summary: 'فرآیند ثبت‌نام اولیه، آزمون‌های ورودی تشخیصی و مصاحبه‌های استعدادیابی برای تمامی مقاطع تحصیلی از پیش‌دبستان تا دبیرستان دوره دوم رسماً آغاز شد.',
      contentHtml: '<p>به اطلاع اولیای گرامی و دانش‌آموزان کوشا می‌رساند، ثبت‌نام اولیه جهت گزینش در پایه‌های مختلف تحصیلی مجتمع آموزشی قرآنی هدی برای سال تحصیلی پیش‌رو آغاز گردید.</p><p>با توجه به محدودیت ظرفیت پذیرش و تعهد مجموعه به حفظ استانداردهای کیفی (حداکثر ۲۰ تا ۲۴ نفر در هر کلاس)، اولویت با متقاضیانی است که در موعد مقرر فرم ارزیابی اولیه را تکمیل نمایند.</p><p>مراحل ثبت‌نام شامل مصاحبه روان‌شناختی، سنجش خلاقیت و تست آمادگی هوش و ارزیابی انس با قرآن کریم خواهد بود.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      isPublished: true,
      authorId: superAdmin.id,
    },
    {
      slug: 'national-quran-competition-first-rank',
      title: 'کسب رتبه نخست مسابقات سراسری قرآن و عترت توسط گروه همخوانی و حفظ هدی',
      category: 'افتخارات قرآنی',
      summary: 'دانش‌آموزان مجتمع هدی در چهل‌ودومین دوره مسابقات استانی و کشوری قرآن کریم با کسب ۵ رتبه اول و ۲ تندیس اخلاق افتخار آفریدند.',
      contentHtml: '<p>در مراسم اختتامیه مسابقات بزرگ قرآن، عترت و نماز دانش‌آموزان کشور، نمایندگان افتخارآفرین مجتمع هدی در رشته‌های حفظ کل، حفظ ۲۰ جزء، قرائت تحقیق و مفاهیم صحیفه سجادیه حائز رتبه‌های برتر شدند.</p><p>هیئت داوران این دوره، شیوه درک و لحن شیوای دانش‌آموزان هدی را نتیجه رویکرد اصولی و تدریجی طرح حفظ موضوعی دانستند.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      isPublished: true,
      authorId: superAdmin.id,
    },
    {
      slug: 'ai-robotics-lab-inauguration',
      title: 'افتتاح آزمایشگاه هوش مصنوعی و رباتیک پیشرفته با حضور مدیران آموزش و پرورش',
      category: 'توسعه فناوری',
      summary: 'بزرگ‌ترین مرکز پژوهشی فناوری‌های نوین دانش‌آموزی با تجهیز به پردازشگرهای هوش مصنوعی و ایستگاه‌های شبیه‌سازی در دبیرستان دوره دوم هدی به بهره‌برداری رسید.',
      contentHtml: '<p>در راستای اجرای سند تحول بنیادین و پرورش نوجوانان در طراز گام دوم انقلاب، فاز جدید آزمایشگاه هوش مصنوعی و رباتیک مجتمع هدی افتتاح گردید.</p><p>در این فضا دانش‌آموزان از پایه هفتم با زبان‌های برنامه‌نویسی پایتون، بینایی ماشین، یادگیری عمیق و طراحی بردهای میکروکنترلر به صورت پروژه‌محور آشنا می‌شوند.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      isFeatured: false,
      isPublished: true,
      authorId: superAdmin.id,
    },
    {
      slug: 'effective-parenting-conference',
      title: 'برگزاری همایش بین‌المللی «تربیت موثر در پرتو کلام وحی» ویژه اولیای مجتمع',
      category: 'رویداد و آموزش خانواده',
      summary: 'نشست هم‌اندیشی با محوریت سبک فرزندپروری در عصر رسانه‌های دیجیتال و راه‌های نهادینه‌سازی عشق به قرآن در جان کودک و نوجوان برگزار شد.',
      contentHtml: '<p>این همایش که با استقبال گسترده والدین همراه بود، به بررسی شیوه‌های نوین برقراری ارتباط عاطفی با فرزندان، پیشگیری از چالش‌های بلوغ، و روش‌های تشویق موثر به حفظ و تلاوت قرآن کریم با حضور اساتید صاحب‌نام روان‌شناسی کودک و پژوهشگران قرآنی پرداخت.</p>',
      coverImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      isFeatured: false,
      isPublished: true,
      authorId: superAdmin.id,
    }
  ];

  for (const n of newsList) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }
  console.log(`📰 Seeded ${newsList.length} news articles`);

  // 4. Seed Official Documents & Credentials
  const documents = [
    {
      title: 'مجوز رسمی تاسیس و فعالیت',
      issuer: 'وزارت آموزش و پرورش جمهوری اسلامی ایران',
      documentNumber: 'LIC-3482-MEDU',
      issueDate: 'اردیبهشت ۱۳۸۸ (تمدید سالانه ۱۴۰۳)',
      description: 'تاییدیه رسمی صلاحیت سازمانی، فضا و تجهیزات منطبق با استانداردهای نوین آموزشی وزارت آموزش و پرورش.',
      iconName: 'ShieldCheck',
      fileUrl: '/documents/license-medu.pdf',
      sortOrder: 1,
    },
    {
      title: 'گواهینامه رتبه الف کیفیت آموزشی',
      issuer: 'شورای عالی ارزیابی و تضمین کیفیت مدارس',
      documentNumber: 'CERT-A-GRADE',
      issueDate: 'تیر ۱۴۰۲',
      description: 'کسب بالاترین رتبه کیفی در میان مجتمع‌های آموزشی با ارزیابی شاخص‌های تربیتی، علمی، قرآنی و مدیریتی.',
      iconName: 'Award',
      fileUrl: '/documents/cert-a-grade.pdf',
      sortOrder: 2,
    },
    {
      title: 'تندیس زرین مسابقات سراسری قرآن و عترت',
      issuer: 'معاونت پرورشی و فرهنگی وزارت آموزش و پرورش',
      documentNumber: 'QURAN-NAT-TROPHY',
      issueDate: 'اسفند ۱۴۰۲',
      description: 'تندیس مجتمع برتر و پیشتاز در پرورش بیش از ۳۰۰ حافظ و قاری نوجوان در چهل‌ویکمین دوره مسابقات سراسری.',
      iconName: 'BookOpen',
      fileUrl: '/documents/trophy-quran.pdf',
      sortOrder: 3,
    },
    {
      title: 'استاندارد بین‌المللی مدیریت سازمان‌های آموزشی (ISO 21001:2018)',
      issuer: 'سازمان بین‌المللی استانداردسازی (ISO)',
      documentNumber: 'ISO-21001-2018',
      issueDate: 'مهر ۱۴۰۱ (تمدید ممیزی ۱۴۰۳)',
      description: 'انطباق کامل فرآیندهای آموزشی، یادگیری و ایمنی با استاندارد جهانی ISO 21001 ویژه موسسات آموزشی.',
      iconName: 'CheckCircle2',
      fileUrl: '/documents/iso-21001.pdf',
      sortOrder: 4,
    },
    {
      title: 'تاییدیه همکاری با بنیاد ملی نخبگان',
      issuer: 'بنیاد ملی نخبگان و مرکز پژوهش‌های علمی',
      documentNumber: 'ELITE-FDN-APPRV',
      issueDate: 'دی ۱۴۰۲',
      description: 'تفاهم‌نامه رسمی شناسایی زودهنگام و پرورش استعدادهای درخشان در حوزه‌های هوش مصنوعی، رباتیک و نانوفناوری.',
      iconName: 'Sparkles',
      fileUrl: '/documents/elite-foundation.pdf',
      sortOrder: 5,
    },
    {
      title: 'نشان طلایی مدرسه تمام‌هوشمند کشوری',
      issuer: 'کارگروه توسعه فناوری اطلاعات و تحول دیجیتال مدارس',
      documentNumber: 'SMART-SCH-GOLD',
      issueDate: 'آبان ۱۴۰۲',
      description: 'تجهیز ۱۰۰٪ کلاس‌ها به نمایشگرهای لمسی تعاملی، سیستم مدیریت یادگیری و لابراتوارهای تخصصی.',
      iconName: 'Laptop',
      fileUrl: '/documents/smart-school-cert.pdf',
      sortOrder: 6,
    },
    {
      title: 'لوح زرین درخشش المپیادهای علمی کشور',
      issuer: 'باشگاه دانش‌پژوهان جوان',
      documentNumber: 'OLYMPIAD-HONOR',
      issueDate: 'خرداد ۱۴۰۳',
      description: 'تقدیر از کسب مدال‌های رنگارنگ طلا و نقره در المپیادهای ریاضی، شیمی، نانو و ادبیات توسط دانش‌آموزان مجتمع هدی.',
      iconName: 'Trophy',
      fileUrl: '/documents/olympiad-honor.pdf',
      sortOrder: 7,
    }
  ];

  await prisma.document.deleteMany({});
  for (const doc of documents) {
    await prisma.document.create({
      data: {
        ...doc,
        isPublished: true,
      }
    });
  }
  console.log(`📜 Seeded ${documents.length} official documents & credentials`);

  // 5. Seed Site Settings
  const settings = [
    {
      key: 'general',
      value: JSON.stringify({
        siteName: 'مجتمع آموزشی قرآنی هدی',
        siteTitle: 'مجتمع آموزشی قرآنی هدی | جلوه‌گاه تربیت قرآنی و سرآمدی علمی',
        metaDescription: 'پایگاه رسمی مجتمع آموزشی قرآنی هدی شامل چهار مدرسه تخصصی پسرانه و دخترانه از مقطع پیش‌دبستان تا دبیرستان کنکور در بستر تربیت زهرایی و علم‌آموزی نوین.',
        establishedYear: '۱۳۸۸',
        logoUrl: '/assets/hoda-logo.png',
      })
    },
    {
      key: 'contact',
      value: JSON.stringify({
        centralOfficePhone: '۰۲۱-۷۷۲۴۱۰۰۰',
        centralOfficeEmail: 'info@hoda-complex.ir',
        centralOfficeAddress: 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی',
        workingHours: 'شنبه تا چهارشنبه ۷:۰۰ الی ۱۶:۰۰ | پنج‌شنبه‌ها ۷:۰۰ الی ۱۳:۰۰',
      })
    },
    {
      key: 'socials',
      value: JSON.stringify({
        eitaa: 'https://eitaa.com/hodaschool',
        bale: 'https://ble.ir/hodaschool',
        shad: 'https://shad.ir/hodaschool',
        aparat: 'https://aparat.com/hodaschool',
      })
    }
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log(`⚙️ Seeded site settings`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
