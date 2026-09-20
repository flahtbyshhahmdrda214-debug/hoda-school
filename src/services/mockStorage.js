// Mock / LocalStorage Client-Side Database
// Provides offline and static hosting (e.g. Cloudflare Workers / Pages) data persistence

import { schoolsData } from '../data/schoolsData.js';
import { newsData } from '../data/newsData.js';
import { credentialsData } from '../data/credentialsData.js';
import { membersData } from '../data/membersData.js';

export const STORAGE_KEYS = {
  SCHOOLS: 'hoda_schools_db',
  NEWS: 'hoda_news_db',
  TEACHERS: 'hoda_teachers_db',
  FACILITIES: 'hoda_facilities_db',
  DOCUMENTS: 'hoda_documents_db',
  SETTINGS: 'hoda_settings_db',
  MEDIA: 'hoda_media_db',
  AUDIT_LOGS: 'hoda_audit_logs_db',
  ACHIEVEMENTS: 'hoda_achievements_db',
  MEMBERS: 'hoda_members_db',
};

export const DEFAULT_SETTINGS = {
  general: {
    siteName: 'مجتمع آموزشی قرآنی هدی',
    establishedYear: '۱۳۸۵',
    siteSubtitle: 'محیطی شاداب، پویا و امن؛ پیوند تربیت اصیل قرآنی با یادگیری خلاق',
  },
  typography: {
    fontFamily: 'vazirmatn',
    fontName: 'وزیرمتن',
  },
  site_font: 'vazirmatn',
  contact: {
    centralOfficePhone: '۰۲۱-۷۷۲۴۱۰۰۰',
    centralOfficeEmail: 'info@hoda-complex.ir',
    centralOfficeAddress: 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی',
    workingHours: 'شنبه تا چهارشنبه ۷:۰۰ الی ۱۶:۰۰ | پنج‌شنبه‌ها ۷:۰۰ الی ۱۳:۰۰',
  },
  socials: {
    eitaa: 'https://eitaa.com/hodaschool',
    bale: 'https://ble.ir/hodaschool',
    shad: 'https://shad.ir/hodaschool',
    aparat: 'https://aparat.com/hodaschool',
  },
  site_name: 'مجتمع آموزشی قرآنی هدی',
  site_subtitle: 'محیطی شاداب، پویا و امن؛ پیوند تربیت اصیل قرآنی با یادگیری خلاق',
  phone_boys_elem: '۰۲۱-۷۷۲۴۱۰۱۱',
  phone_boys_high: '۰۲۱-۷۷۲۴۱۰۱۲',
  phone_girls_elem: '۰۲۱-۷۷۲۴۱۰۱۳',
  phone_girls_high: '۰۲۱-۷۷۲۴۱۰۱۴',
  central_phone: '۰۲۱-۷۷۲۴۱۰۰۰',
  central_email: 'info@hoda-complex.ir',
  central_address: 'تهران، خیابان پاسداران، بوستان پنجم، مجتمع مرکزی هدی',
  working_hours: 'شنبه تا چهارشنبه ۷:۰۰ الی ۱۶:۰۰ | پنج‌شنبه‌ها ۷:۰۰ الی ۱۳:۰۰',
  social_eitaa: 'https://eitaa.com/hodaschool',
  social_bale: 'https://ble.ir/hodaschool',
  social_shad: 'https://shad.ir/hodaschool',
  social_aparat: 'https://aparat.com/hodaschool',
};

export const INITIAL_MEDIA = [
  {
    id: 'media-1',
    filename: 'hoda-3d-logo-4k.png',
    originalName: 'نشان سه‌بعدی رسمی مجتمع هدی',
    mimeType: 'image/png',
    url: '/assets/hoda-3d-logo-4k.png',
    thumbnailUrl: '/assets/hoda-3d-logo-4k.png',
    sizeBytes: 124000,
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'media-2',
    filename: 'hero-bg.png',
    originalName: 'تصویر سراسرنمای پردیس مجتمع هدی',
    mimeType: 'image/png',
    url: '/assets/hero-bg.png',
    thumbnailUrl: '/assets/hero-bg.png',
    sizeBytes: 285000,
    createdAt: '2026-09-02T10:30:00.000Z'
  },
  {
    id: 'media-3',
    filename: 'director-avatar.png',
    originalName: 'تصویر پرتره ریاست مجتمع آموزشی',
    mimeType: 'image/png',
    url: '/assets/director-avatar.png',
    thumbnailUrl: '/assets/director-avatar.png',
    sizeBytes: 92000,
    createdAt: '2026-09-03T11:15:00.000Z'
  },
  {
    id: 'media-4',
    filename: 'icon-school1.png',
    originalName: 'نشان دبستان پسرانه هدی',
    mimeType: 'image/png',
    url: '/assets/icon-school1.png',
    thumbnailUrl: '/assets/icon-school1.png',
    sizeBytes: 68000,
    createdAt: '2026-09-04T09:20:00.000Z'
  },
  {
    id: 'media-5',
    filename: 'icon-school2-board.png',
    originalName: 'نشان دبیرستان پسرانه هدی',
    mimeType: 'image/png',
    url: '/assets/icon-school2-board.png',
    thumbnailUrl: '/assets/icon-school2-board.png',
    sizeBytes: 74000,
    createdAt: '2026-09-05T14:45:00.000Z'
  },
  {
    id: 'media-6',
    filename: 'icon-school3-books.png',
    originalName: 'نشان دبستان دخترانه هدی',
    mimeType: 'image/png',
    url: '/assets/icon-school3-books.png',
    thumbnailUrl: '/assets/icon-school3-books.png',
    sizeBytes: 71000,
    createdAt: '2026-09-06T12:10:00.000Z'
  },
  {
    id: 'media-7',
    filename: 'icon-school4-cap.png',
    originalName: 'نشان دبیرستان دخترانه هدی',
    mimeType: 'image/png',
    url: '/assets/icon-school4-cap.png',
    thumbnailUrl: '/assets/icon-school4-cap.png',
    sizeBytes: 69000,
    createdAt: '2026-09-07T16:00:00.000Z'
  }
];

export function getItem(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function setItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hoda_data_changed', { detail: { key, val } }));
    }
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Helper to merge live teachers, facilities and achievements into school objects
function enrichSchool(school, allTeachers = [], allFacilities = [], allAchievements = []) {
  if (!school) return school;
  const sId = String(school.id);
  const sSlug = school.slug;
  const sName = school.shortName;

  const teachers = allTeachers.filter(t => 
    String(t.schoolId) === sId || 
    t.schoolSlug === sSlug || 
    t.schoolName === sName ||
    (t.school && (String(t.school.id) === sId || t.school.shortName === sName))
  );

  const facilities = allFacilities.filter(f => 
    String(f.schoolId) === sId || 
    f.schoolSlug === sSlug || 
    f.schoolName === sName ||
    (f.school && (String(f.school.id) === sId || f.school.shortName === sName))
  );

  const achievements = allAchievements.filter(a => 
    String(a.schoolId) === sId || 
    a.schoolSlug === sSlug || 
    a.schoolName === sName ||
    (a.school && (String(a.school.id) === sId || a.school.shortName === sName))
  );

  return {
    ...school,
    teachers: teachers.length > 0 ? teachers : (school.teachers || []),
    facilities: facilities.length > 0 ? facilities : (school.facilities || []),
    achievements: achievements.length > 0 ? achievements : (school.honors || school.achievements || []),
    honors: achievements.length > 0 ? achievements : (school.honors || school.achievements || []),
  };
}

// Initializer
export function initMockStorage() {
  if (typeof window === 'undefined') return;

  // 1. Schools
  if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
    setItem(STORAGE_KEYS.SCHOOLS, schoolsData.map(s => ({
      ...s,
      icon3dUrl: s.icon3d || s.icon3dUrl,
      teachers: s.teachers || [],
      facilities: s.facilities || [],
    })));
  }

  // 2. News
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    setItem(STORAGE_KEYS.NEWS, newsData.map(n => ({
      ...n,
      slug: n.slug || `news-${n.id}`,
      summary: n.summary || '',
      content: n.content || '',
      contentHtml: n.content || '',
      thumbnail: n.thumbnail || '/assets/campus-1.webp',
      coverImageUrl: n.thumbnail || '/assets/campus-1.webp',
      category: n.category || 'اطلاعیه مهم',
      date: n.date || new Date().toLocaleDateString('fa-IR'),
      publishedAt: new Date().toISOString(),
      readTime: n.readTime || '۳ دقیقه',
      isImportant: Boolean(n.isImportant),
      isFeatured: Boolean(n.isImportant),
      isPublished: true,
      badgeClass: n.badgeClass || 'bg-blue-50 text-blue-800 border-blue-200'
    })));
  }

  // 3. Documents
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    setItem(STORAGE_KEYS.DOCUMENTS, credentialsData.map(d => ({
      ...d,
      code: d.code || `HOD-${d.id}`,
      documentNumber: d.code || `HOD-${d.id}`,
      issuer: d.issuer || 'سازمان آموزش و پرورش',
      date: d.date || '۱۴۰۳',
      type: d.type || 'تاییدیه رسمی',
      fileUrl: `/uploads/docs/${d.code || d.id}.pdf`,
      isPublished: true
    })));
  }

  // 4. Teachers
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    const allTeachers = [];
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    for (const sc of schools) {
      if (Array.isArray(sc.teachers)) {
        for (const t of sc.teachers) {
          allTeachers.push({
            id: `teacher-${Math.random().toString(36).substring(2, 9)}`,
            schoolId: sc.id,
            schoolName: sc.shortName,
            firstName: t.name ? t.name.split(' ')[0] : 'استاد',
            lastName: t.name ? t.name.split(' ').slice(1).join(' ') : 'محترم',
            name: t.name || 'استاد محترم',
            roleTitle: t.role || '',
            role: t.role || '',
            educationDegree: t.degree || '',
            degree: t.degree || '',
            teachingExperience: t.experience || '',
            experience: t.experience || '',
            highlight: t.highlight || '',
            avatarUrl: t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            avatar: t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            sortOrder: 1,
            school: { id: sc.id, shortName: sc.shortName }
          });
        }
      }
    }
    setItem(STORAGE_KEYS.TEACHERS, allTeachers);
  }

  // 5. Facilities
  if (!localStorage.getItem(STORAGE_KEYS.FACILITIES)) {
    const allFacs = [];
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    for (const sc of schools) {
      if (Array.isArray(sc.facilities)) {
        for (const f of sc.facilities) {
          allFacs.push({
            id: `fac-${Math.random().toString(36).substring(2, 9)}`,
            schoolId: sc.id,
            schoolName: sc.shortName,
            title: f.title,
            description: f.desc || f.description || '',
            desc: f.desc || f.description || '',
            school: { id: sc.id, shortName: sc.shortName }
          });
        }
      }
    }
    setItem(STORAGE_KEYS.FACILITIES, allFacs);
  }

  // 6. Settings
  const existingSettings = getItem(STORAGE_KEYS.SETTINGS, null);
  if (!existingSettings) {
    setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  } else {
    // Ensure section objects exist
    if (!existingSettings.contact || !existingSettings.socials || !existingSettings.general) {
      const merged = {
        ...DEFAULT_SETTINGS,
        ...existingSettings,
        general: { ...DEFAULT_SETTINGS.general, ...(existingSettings.general || {}) },
        contact: { ...DEFAULT_SETTINGS.contact, ...(existingSettings.contact || {}) },
        socials: { ...DEFAULT_SETTINGS.socials, ...(existingSettings.socials || {}) },
      };
      setItem(STORAGE_KEYS.SETTINGS, merged);
    }
  }

  // 7. Media
  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    setItem(STORAGE_KEYS.MEDIA, [
      { id: 'm1', filename: 'campus-1.webp', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', sizeBytes: 124500, createdAt: new Date().toISOString() },
      { id: 'm2', filename: 'quran-trophy.webp', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80', sizeBytes: 98000, createdAt: new Date().toISOString() },
      { id: 'm3', filename: 'robotics-lab.webp', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', sizeBytes: 154000, createdAt: new Date().toISOString() }
    ]);
  }

  // 8. Audit Logs
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setItem(STORAGE_KEYS.AUDIT_LOGS, [
      { id: 'l1', action: 'SYSTEM_BOOT', entity: 'System', createdAt: new Date().toISOString(), ipAddress: '127.0.0.1', user: { fullName: 'مدیر کل سامانه', username: 'superadmin' } }
    ]);
  }

  // 9. Achievements & Honors
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    const initialAchievements = [
      {
        id: 'ach-1',
        schoolId: '1',
        schoolSlug: 'boys-elementary',
        schoolName: 'دبستان پسرانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه اول مسابقات استانی همخوانی، اذان و تواشیح مدارس',
        recipient: 'گروه سرود و نغمه‌های قرآنی نور هدی',
        category: 'قرآنی',
        description: 'کسب عنوان برتر در میان ۶۴ گروه دانش‌آموزی با اجرای هماهنگ و تجوید استاندارد',
        imageUrl: '',
        sortOrder: 1,
        isPublished: true,
      },
      {
        id: 'ach-2',
        schoolId: '2',
        schoolSlug: 'boys-highschool',
        schoolName: 'دبیرستان پسرانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه ۹ کشوری در کنکور سراسری علوم تجربی',
        recipient: 'محمدصادق نوری',
        category: 'کنکور سراسری',
        description: 'درخشش در رشته پزشکی دانشگاه علوم پزشکی تهران بدون استفاده از سهمیه',
        imageUrl: '',
        sortOrder: 2,
        isPublished: true,
      },
      {
        id: 'ach-3',
        schoolId: '2',
        schoolSlug: 'boys-highschool',
        schoolName: 'دبیرستان پسرانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه ۱۷ کشوری در کنکور سراسری رشته ریاضی و فیزیک',
        recipient: 'امیرمهدی فیاض',
        category: 'کنکور سراسری',
        description: 'پذیرش در رشته مهندسی کامپیوتر دانشگاه صنعتی شریف',
        imageUrl: '',
        sortOrder: 3,
        isPublished: true,
      },
      {
        id: 'ach-4',
        schoolId: '4',
        schoolSlug: 'girls-highschool',
        schoolName: 'دبیرستان دخترانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه ۱۲ کشوری در کنکور سراسری علوم انسانی',
        recipient: 'زهرا میرزایی',
        category: 'کنکور سراسری',
        description: 'پذیرش در رشته حقوق دانشگاه تهران با درصد ۱۰۰ در دروس تخصصی',
        imageUrl: '',
        sortOrder: 4,
        isPublished: true,
      },
      {
        id: 'ach-5',
        schoolId: '4',
        schoolSlug: 'girls-highschool',
        schoolName: 'دبیرستان دخترانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه ۲۴ کشوری در کنکور سراسری علوم تجربی',
        recipient: 'فاطمه کاظمی',
        category: 'کنکور سراسری',
        description: 'پذیرش در رشته دندانپزشکی دانشگاه علوم پزشکی شهید بهشتی',
        imageUrl: '',
        sortOrder: 5,
        isPublished: true,
      },
      {
        id: 'ach-6',
        schoolId: '2',
        schoolSlug: 'boys-highschool',
        schoolName: 'دبیرستان پسرانه',
        year: '۱۴۰۲',
        title: 'مدال نقره المپیاد جهانی نانوفناوری و المپیاد کشوری کامپیوتر',
        recipient: 'سینا خلیلی',
        category: 'علمی و المپیاد',
        description: 'عضو تیم ملی المپیاد دانش‌آموزی با هدایت اساتید المپیاد هدی',
        imageUrl: '',
        sortOrder: 6,
        isPublished: true,
      },
      {
        id: 'ach-7',
        schoolId: '3',
        schoolSlug: 'girls-elementary',
        schoolName: 'دبستان دخترانه',
        year: '۱۴۰۳',
        title: 'کسب رتبه اول مسابقات استانی سرود و همخوانی قرآنی دختران',
        recipient: 'گروه ریحانه‌های بهشتی هدی',
        category: 'قرآنی',
        description: 'درخشش در مسابقات سرود و همخوانی قرآن کریم مرحله استانی با نمره کامل هیئت داوران',
        imageUrl: '',
        sortOrder: 7,
        isPublished: true,
      },
      {
        id: 'ach-8',
        schoolId: '1',
        schoolSlug: 'boys-elementary',
        schoolName: 'دبستان پسرانه',
        year: '۱۴۰۳',
        title: 'مقام نخست جشنواره جابربن‌حیان در محور طراحی و آزمایش',
        recipient: 'تیم پژوهشی پایه پنجم',
        category: 'علمی و المپیاد',
        description: 'طراحی دستگاه هوشمند تصفیه آب مبتنی بر انرژی خورشیدی',
        imageUrl: '',
        sortOrder: 8,
        isPublished: true,
      },
      {
        id: 'ach-9',
        schoolId: '3',
        schoolSlug: 'girls-elementary',
        schoolName: 'دبستان دخترانه',
        year: '۱۴۰۲',
        title: 'برگزیده اول مسابقات حفظ ۱۰ جزء و ترتیل مدارس شهر تهران',
        recipient: 'فاطمه‌سادات حسینی',
        category: 'قرآنی',
        description: 'حافظ مسلط کلام‌الله مجید با لحن و تجوید برجسته',
        imageUrl: '',
        sortOrder: 9,
        isPublished: true,
      },
      {
        id: 'ach-10',
        schoolId: '4',
        schoolSlug: 'girls-highschool',
        schoolName: 'دبیرستان دخترانه',
        year: '۱۴۰۲',
        title: 'مدال طلای المپیاد ادبی کشور و برگزیده بنیاد ملی نخبگان',
        recipient: 'سارا احمدی',
        category: 'علمی و المپیاد',
        description: 'کسب مدال طلای کشوری و عضویت رسمی در بنیاد ملی نخبگان',
        imageUrl: '',
        sortOrder: 10,
        isPublished: true,
      }
    ];
    setItem(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    setItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    setItem(STORAGE_KEYS.MEMBERS, membersData);
  }
}

// Request Handler for Client-Side Database
export function handleMockRequest(endpoint, options = {}) {
  initMockStorage();
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0].replace(/^\/api\/v1/, '').replace(/^\/public/, '');
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // 1. Schools
  if (cleanEndpoint === '/schools') {
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
    const facs = getItem(STORAGE_KEYS.FACILITIES, []);
    const achs = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
    return schools.map(s => enrichSchool(s, teachers, facs, achs));
  }

  if (cleanEndpoint.startsWith('/schools/')) {
    const slugOrId = cleanEndpoint.replace('/schools/', '');
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    const index = schools.findIndex(s => String(s.id) === String(slugOrId) || s.slug === slugOrId || (body.id && String(s.id) === String(body.id)) || (body.slug && s.slug === body.slug));

    if (method === 'GET') {
      const sc = (index !== -1 ? schools[index] : null) || schools.find(s => s.slug === slugOrId || String(s.id) === String(slugOrId));
      if (sc) {
        const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
        const facs = getItem(STORAGE_KEYS.FACILITIES, []);
        const achs = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
        return enrichSchool(sc, teachers, facs, achs);
      }
      throw new Error('مدرسه مورد نظر یافت نشد');
    }

    if (method === 'PUT') {
      if (index !== -1) {
        schools[index] = { ...schools[index], ...body };
        setItem(STORAGE_KEYS.SCHOOLS, schools);
        logAudit('UPDATE_SCHOOL', 'School', slugOrId);
        const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
        const facs = getItem(STORAGE_KEYS.FACILITIES, []);
        const achs = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
        return enrichSchool(schools[index], teachers, facs, achs);
      }
      return body;
    }
  }

  // 2. News
  if (cleanEndpoint === '/news') {
    const news = getItem(STORAGE_KEYS.NEWS, newsData);
    if (method === 'GET') {
      return { items: news, pagination: { page: 1, limit: 50, total: news.length, totalPages: 1 } };
    }
    if (method === 'POST') {
      const newItem = {
        id: `news-${Date.now()}`,
        slug: body.slug || `news-${Date.now()}`,
        title: body.title || 'خبر جدید',
        summary: body.summary || '',
        content: body.contentHtml || body.content || '',
        contentHtml: body.contentHtml || body.content || '',
        category: body.category || 'اطلاعیه مهم',
        thumbnail: body.coverImageUrl || body.thumbnail || '/assets/campus-1.webp',
        coverImageUrl: body.coverImageUrl || body.thumbnail || '/assets/campus-1.webp',
        publishedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('fa-IR'),
        readTime: body.readTime || '۳ دقیقه',
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        isFeatured: Boolean(body.isFeatured || body.isImportant),
        isImportant: Boolean(body.isFeatured || body.isImportant),
        badgeClass: body.badgeClass || 'bg-blue-50 text-blue-800 border-blue-200',
        school: null,
      };
      news.unshift(newItem);
      setItem(STORAGE_KEYS.NEWS, news);
      logAudit('CREATE_NEWS', 'News', newItem.id);
      return newItem;
    }
  }

  if (cleanEndpoint.startsWith('/news/')) {
    const id = cleanEndpoint.replace('/news/', '');
    const news = getItem(STORAGE_KEYS.NEWS, newsData);
    
    if (method === 'DELETE') {
      const filtered = news.filter(n => String(n.id) !== id && n.slug !== id);
      setItem(STORAGE_KEYS.NEWS, filtered);
      logAudit('DELETE_NEWS', 'News', id);
      return { success: true };
    }

    if (method === 'PUT') {
      const idx = news.findIndex(n => String(n.id) === id || n.slug === id);
      if (idx !== -1) {
        news[idx] = {
          ...news[idx],
          ...body,
          thumbnail: body.coverImageUrl || body.thumbnail || news[idx].thumbnail,
          coverImageUrl: body.coverImageUrl || body.thumbnail || news[idx].coverImageUrl,
          content: body.contentHtml || body.content || news[idx].content,
          contentHtml: body.contentHtml || body.content || news[idx].contentHtml,
          isImportant: body.isFeatured !== undefined ? Boolean(body.isFeatured) : (body.isImportant !== undefined ? Boolean(body.isImportant) : news[idx].isImportant),
          isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : (body.isImportant !== undefined ? Boolean(body.isImportant) : news[idx].isFeatured),
        };
        setItem(STORAGE_KEYS.NEWS, news);
        logAudit('UPDATE_NEWS', 'News', id);
        return news[idx];
      }
      return body;
    }

    if (method === 'GET') {
      const item = news.find(n => String(n.id) === id || n.slug === id);
      if (item) return item;
      throw new Error('خبر مورد نظر یافت نشد');
    }
  }

  // 3. Teachers
  if (cleanEndpoint === '/teachers') {
    const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
    if (method === 'GET') return teachers;
    if (method === 'POST') {
      const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
      const sc = schools.find(s => String(s.id) === String(body.schoolId)) || schools[0];
      const newTeacher = {
        id: `teacher-${Date.now()}`,
        schoolId: sc ? sc.id : body.schoolId,
        schoolName: sc ? sc.shortName : '',
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        name: `${body.firstName || ''} ${body.lastName || ''}`.trim(),
        roleTitle: body.roleTitle || body.role || '',
        role: body.roleTitle || body.role || '',
        educationDegree: body.educationDegree || body.degree || '',
        degree: body.educationDegree || body.degree || '',
        teachingExperience: body.teachingExperience || body.experience || '',
        experience: body.teachingExperience || body.experience || '',
        highlight: body.highlight || '',
        avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        avatar: body.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        sortOrder: Number(body.sortOrder) || 1,
        school: sc ? { id: sc.id, shortName: sc.shortName } : null
      };
      teachers.push(newTeacher);
      setItem(STORAGE_KEYS.TEACHERS, teachers);
      logAudit('CREATE_TEACHER', 'Teacher', newTeacher.id);
      return newTeacher;
    }
  }

  if (cleanEndpoint.startsWith('/teachers/')) {
    const id = cleanEndpoint.replace('/teachers/', '');
    const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
    if (method === 'DELETE') {
      const filtered = teachers.filter(t => String(t.id) !== id);
      setItem(STORAGE_KEYS.TEACHERS, filtered);
      logAudit('DELETE_TEACHER', 'Teacher', id);
      return { success: true };
    }
  }

  // 4. Facilities
  if (cleanEndpoint === '/facilities') {
    const facs = getItem(STORAGE_KEYS.FACILITIES, []);
    if (method === 'GET') return facs;
    if (method === 'POST') {
      const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
      const sc = schools.find(s => String(s.id) === String(body.schoolId)) || schools[0];
      const newFac = {
        id: `fac-${Date.now()}`,
        schoolId: sc ? sc.id : body.schoolId,
        schoolName: sc ? sc.shortName : '',
        title: body.title,
        description: body.description || body.desc || '',
        desc: body.description || body.desc || '',
        school: sc ? { id: sc.id, shortName: sc.shortName } : null
      };
      facs.push(newFac);
      setItem(STORAGE_KEYS.FACILITIES, facs);
      logAudit('CREATE_FACILITY', 'Facility', newFac.id);
      return newFac;
    }
  }

  if (cleanEndpoint.startsWith('/facilities/')) {
    const id = cleanEndpoint.replace('/facilities/', '');
    const facs = getItem(STORAGE_KEYS.FACILITIES, []);
    if (method === 'DELETE') {
      const filtered = facs.filter(f => String(f.id) !== id);
      setItem(STORAGE_KEYS.FACILITIES, filtered);
      logAudit('DELETE_FACILITY', 'Facility', id);
      return { success: true };
    }
  }

  // 5. Documents
  if (cleanEndpoint === '/documents') {
    const docs = getItem(STORAGE_KEYS.DOCUMENTS, credentialsData);
    if (method === 'GET') return docs;
    if (method === 'POST') {
      const newDoc = {
        id: `doc-${Date.now()}`,
        code: body.code || body.documentNumber || `HOD-${Date.now().toString().slice(-6)}`,
        documentNumber: body.code || body.documentNumber || `HOD-${Date.now().toString().slice(-6)}`,
        title: body.title,
        description: body.description || '',
        issuer: body.issuer || 'مجتمع آموزشی قرآنی هدی',
        date: body.date || new Date().toLocaleDateString('fa-IR'),
        type: body.type || 'تاییدیه رسمی',
        fileUrl: body.fileUrl || '/uploads/doc.pdf',
        icon: body.iconName || body.icon || 'ShieldCheck',
        badgeColor: body.badgeColor || 'blue',
        isPublished: true,
      };
      docs.unshift(newDoc);
      setItem(STORAGE_KEYS.DOCUMENTS, docs);
      logAudit('CREATE_DOCUMENT', 'Document', newDoc.id);
      return newDoc;
    }
  }

  if (cleanEndpoint.startsWith('/documents/')) {
    const id = cleanEndpoint.replace('/documents/', '');
    const docs = getItem(STORAGE_KEYS.DOCUMENTS, credentialsData);
    if (method === 'DELETE') {
      const filtered = docs.filter(d => String(d.id) !== id && String(d.code) !== id);
      setItem(STORAGE_KEYS.DOCUMENTS, filtered);
      logAudit('DELETE_DOCUMENT', 'Document', id);
      return { success: true };
    }
  }

  // 6. Achievements / Honors
  if (cleanEndpoint === '/achievements') {
    let achs = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
    if (method === 'GET') {
      const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
      const params = new URLSearchParams(queryString);
      const cat = params.get('category');
      const schoolSlug = params.get('schoolSlug');
      const schoolId = params.get('schoolId');

      if (cat && cat !== 'all' && cat !== 'همه') {
        achs = achs.filter(a => a.category === cat);
      }
      if (schoolSlug) {
        achs = achs.filter(a => a.schoolSlug === schoolSlug || a.school?.slug === schoolSlug);
      }
      if (schoolId) {
        achs = achs.filter(a => String(a.schoolId) === String(schoolId) || String(a.school?.id) === String(schoolId));
      }
      return achs;
    }

    if (method === 'POST') {
      const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
      const sc = schools.find(s => String(s.id) === String(body.schoolId) || s.slug === body.schoolSlug);
      const newAch = {
        id: `ach-${Date.now()}`,
        schoolId: sc ? String(sc.id) : (body.schoolId ? String(body.schoolId) : '1'),
        schoolSlug: sc ? sc.slug : (body.schoolSlug || 'boys-elementary'),
        schoolName: sc ? sc.shortName : (body.schoolName || 'دبستان پسرانه'),
        year: body.year || '۱۴۰۳',
        title: body.title || 'افتخار جدید',
        recipient: body.recipient || '',
        description: body.description || '',
        category: body.category || 'قرآنی',
        imageUrl: body.imageUrl || '',
        sortOrder: Number(body.sortOrder) || 1,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        createdAt: new Date().toISOString(),
        school: sc ? { id: sc.id, shortName: sc.shortName, slug: sc.slug } : null,
      };
      achs.unshift(newAch);
      setItem(STORAGE_KEYS.ACHIEVEMENTS, achs);
      logAudit('CREATE_ACHIEVEMENT', 'Achievement', newAch.id);
      return newAch;
    }
  }

  if (cleanEndpoint.startsWith('/achievements/')) {
    const id = cleanEndpoint.replace('/achievements/', '');
    const achs = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
    
    if (method === 'DELETE') {
      const filtered = achs.filter(a => String(a.id) !== id);
      setItem(STORAGE_KEYS.ACHIEVEMENTS, filtered);
      logAudit('DELETE_ACHIEVEMENT', 'Achievement', id);
      return { success: true };
    }

    if (method === 'PUT') {
      const idx = achs.findIndex(a => String(a.id) === id);
      if (idx !== -1) {
        const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
        const targetSchoolId = body.schoolId !== undefined ? body.schoolId : achs[idx].schoolId;
        const sc = schools.find(s => String(s.id) === String(targetSchoolId) || s.slug === body.schoolSlug) || achs[idx].school;
        achs[idx] = {
          ...achs[idx],
          ...body,
          schoolId: sc ? String(sc.id) : achs[idx].schoolId,
          schoolSlug: sc ? sc.slug : achs[idx].schoolSlug,
          schoolName: sc ? sc.shortName : achs[idx].schoolName,
          school: sc ? { id: sc.id, shortName: sc.shortName, slug: sc.slug } : achs[idx].school,
          updatedAt: new Date().toISOString(),
        };
        setItem(STORAGE_KEYS.ACHIEVEMENTS, achs);
        logAudit('UPDATE_ACHIEVEMENT', 'Achievement', id);
        return achs[idx];
      }
      return body;
    }

    if (method === 'GET') {
      const item = achs.find(a => String(a.id) === id);
      if (item) return item;
      throw new Error('افتخار مورد نظر یافت نشد');
    }
  }

  // 7. Settings
  if (cleanEndpoint === '/settings') {
    const settings = getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (method === 'GET') {
      return {
        ...DEFAULT_SETTINGS,
        ...settings,
        general: { ...DEFAULT_SETTINGS.general, ...(settings.general || {}) },
        contact: { ...DEFAULT_SETTINGS.contact, ...(settings.contact || {}) },
        socials: { ...DEFAULT_SETTINGS.socials, ...(settings.socials || {}) },
      };
    }
    if (method === 'PUT') {
      const current = getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      const updated = {
        ...current,
        ...body,
        general: { ...(current.general || {}), ...(body.general || {}) },
        contact: { ...(current.contact || {}), ...(body.contact || {}) },
        socials: { ...(current.socials || {}), ...(body.socials || {}) },
      };
      setItem(STORAGE_KEYS.SETTINGS, updated);
      logAudit('UPDATE_SETTINGS', 'SiteSetting', 'all');
      return updated;
    }
  }

  if (cleanEndpoint.startsWith('/settings/')) {
    const key = cleanEndpoint.replace('/settings/', '');
    const settings = getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (method === 'GET') {
      return settings[key] !== undefined ? settings[key] : (DEFAULT_SETTINGS[key] || null);
    }
    if (method === 'PUT') {
      const val = body.value !== undefined ? body.value : body;
      settings[key] = val;
      if (key === 'contact' && typeof val === 'object') {
        if (val.centralOfficePhone) settings.central_phone = val.centralOfficePhone;
        if (val.centralOfficeEmail) settings.central_email = val.centralOfficeEmail;
        if (val.centralOfficeAddress) settings.central_address = val.centralOfficeAddress;
        if (val.workingHours) settings.working_hours = val.workingHours;
      }
      if (key === 'socials' && typeof val === 'object') {
        if (val.eitaa) settings.social_eitaa = val.eitaa;
        if (val.bale) settings.social_bale = val.bale;
        if (val.shad) settings.social_shad = val.shad;
        if (val.aparat) settings.social_aparat = val.aparat;
      }
      setItem(STORAGE_KEYS.SETTINGS, settings);
      logAudit('UPDATE_SETTING', 'SiteSetting', key);
      return { key, value: settings[key] };
    }
  }

  // 7. Media
  if (cleanEndpoint === '/media') {
    const media = getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
    return { items: media, pagination: { page: 1, limit: 60, total: media.length } };
  }
  if (cleanEndpoint === '/media/upload') {
    const media = getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
    let newMedia = null;

    if (body && (body.dataUrl || body.url || body.filename || body.originalName)) {
      newMedia = {
        id: body.id || `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        filename: body.filename || body.originalName || `file-${Date.now()}`,
        originalName: body.originalName || body.filename || `فایل بارگذاری‌شده`,
        mimeType: body.mimeType || (body.dataUrl?.startsWith('data:image') ? 'image/jpeg' : 'application/octet-stream'),
        url: body.url || body.dataUrl,
        thumbnailUrl: body.thumbnailUrl || body.dataUrl || body.url,
        sizeBytes: body.sizeBytes || 85000,
        createdAt: new Date().toISOString()
      };
    } else {
      newMedia = {
        id: `media-${Date.now()}`,
        filename: `image-${Date.now()}.png`,
        originalName: `تصویر آپلود شده`,
        mimeType: 'image/png',
        url: '/assets/hoda-3d-logo-4k.png',
        thumbnailUrl: '/assets/hoda-3d-logo-4k.png',
        sizeBytes: 85000,
        createdAt: new Date().toISOString()
      };
    }

    media.unshift(newMedia);
    setItem(STORAGE_KEYS.MEDIA, media.slice(0, 80));
    logAudit('UPLOAD_MEDIA', 'Media', newMedia.id);
    return newMedia;
  }
  if (cleanEndpoint.startsWith('/media/')) {
    const id = cleanEndpoint.replace('/media/', '');
    const media = getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
    if (method === 'DELETE') {
      const filtered = media.filter(m => String(m.id) !== id);
      setItem(STORAGE_KEYS.MEDIA, filtered);
      logAudit('DELETE_MEDIA', 'Media', id);
      return { success: true };
    }
  }

  // 8. Members & Leadership
  if (cleanEndpoint === '/members') {
    const mems = getItem(STORAGE_KEYS.MEMBERS, membersData);
    if (method === 'GET') {
      return mems;
    }
    if (method === 'PUT') {
      const updated = {
        ...mems,
        ...body,
        director: body.director ? { ...(mems.director || {}), ...body.director } : (mems.director || {}),
        trustees: body.trustees || mems.trustees || [],
        principals: body.principals || mems.principals || []
      };
      setItem(STORAGE_KEYS.MEMBERS, updated);
      logAudit('UPDATE_MEMBERS', 'Member', 'all');
      return updated;
    }
  }

  if (cleanEndpoint === '/members/director' && method === 'PUT') {
    const mems = getItem(STORAGE_KEYS.MEMBERS, membersData);
    mems.director = { ...(mems.director || {}), ...body };
    setItem(STORAGE_KEYS.MEMBERS, mems);
    logAudit('UPDATE_DIRECTOR', 'Member', 'director');
    return mems.director;
  }

  if (cleanEndpoint === '/members/trustees') {
    const mems = getItem(STORAGE_KEYS.MEMBERS, membersData);
    if (method === 'POST') {
      const newTrustee = {
        id: `trustee-${Date.now()}`,
        name: body.name || 'عضو جدید هیئت امنا',
        title: body.title || 'عضو هیئت امنا',
        roleCategory: 'trustee',
        roleLabel: 'هیئت امنا',
        avatar: body.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        degree: body.degree || '',
        experience: body.experience || '',
        bio: body.bio || '',
        highlight: body.highlight || ''
      };
      mems.trustees = mems.trustees || [];
      mems.trustees.push(newTrustee);
      setItem(STORAGE_KEYS.MEMBERS, mems);
      logAudit('CREATE_TRUSTEE', 'Member', newTrustee.id);
      return newTrustee;
    }
  }

  if (cleanEndpoint.startsWith('/members/trustees/')) {
    const id = cleanEndpoint.replace('/members/trustees/', '');
    const mems = getItem(STORAGE_KEYS.MEMBERS, membersData);
    mems.trustees = mems.trustees || [];

    if (method === 'DELETE') {
      mems.trustees = mems.trustees.filter(t => String(t.id) !== id);
      setItem(STORAGE_KEYS.MEMBERS, mems);
      logAudit('DELETE_TRUSTEE', 'Member', id);
      return { success: true };
    }

    if (method === 'PUT') {
      const idx = mems.trustees.findIndex(t => String(t.id) === id);
      if (idx !== -1) {
        mems.trustees[idx] = { ...mems.trustees[idx], ...body };
        setItem(STORAGE_KEYS.MEMBERS, mems);
        logAudit('UPDATE_TRUSTEE', 'Member', id);
        return mems.trustees[idx];
      }
    }
  }

  if (cleanEndpoint.startsWith('/members/principals/')) {
    const id = cleanEndpoint.replace('/members/principals/', '');
    const mems = getItem(STORAGE_KEYS.MEMBERS, membersData);
    mems.principals = mems.principals || [];

    if (method === 'PUT') {
      const idx = mems.principals.findIndex(p => String(p.id) === id || String(p.schoolId) === id);
      if (idx !== -1) {
        mems.principals[idx] = { ...mems.principals[idx], ...body };
        setItem(STORAGE_KEYS.MEMBERS, mems);
        logAudit('UPDATE_PRINCIPAL', 'Member', id);
        return mems.principals[idx];
      }
    }
  }

  // 9. Users & Audit Logs
  if (cleanEndpoint === '/users') {
    return [
      { id: '1', username: 'superadmin', role: 'SUPERADMIN', fullName: 'مدیر کل سامانه', email: 'superadmin@hoda.ir', isActive: true },
      { id: '2', username: 'admin_boyselem', role: 'SCHOOL_ADMIN', fullName: 'مدیر دبستان پسرانه', email: 'boyselem@hoda.ir', isActive: true },
      { id: '3', username: 'editor_user', role: 'EDITOR', fullName: 'کارشناس تولید محتوا', email: 'editor@hoda.ir', isActive: true }
    ];
  }
  if (cleanEndpoint.startsWith('/users/audit-logs')) {
    return getItem(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  // 9. Auth Handlers
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    const rawId = (body.identifier || body.username || '').trim().toLowerCase();
    const rawPw = (body.password || '').trim();

    const isAdmin = rawId.includes('admin') || rawId === 'superadmin' || rawId.includes('hoda');
    const isPassValid = rawPw === 'Admin@Hoda2026!' || rawPw === 'AdminHoda2026!#' || rawPw === 'admin' || rawPw === 'Admin@Hoda2026' || rawPw.length >= 4;

    if (isAdmin && isPassValid) {
      const user = {
        id: 'admin-main',
        username: rawId.includes('boyselem') ? 'admin_boyselem' : 'superadmin',
        role: rawId.includes('boyselem') ? 'SCHOOL_ADMIN' : 'SUPERADMIN',
        fullName: rawId.includes('boyselem') ? 'مدیر دبستان پسرانه' : 'مدیر کل سامانه',
        email: `${rawId}@hodaschool.ir`
      };
      localStorage.setItem('hoda_admin_user', JSON.stringify(user));
      localStorage.setItem('hoda_admin_token', 'local_active_session_' + Date.now());
      logAudit('LOGIN_SUCCESS', 'User', user.id);
      return { user, token: 'local_active_session_' + Date.now() };
    }

    if (rawId.includes('editor')) {
      const user = {
        id: 'editor-1',
        username: 'editor_user',
        role: 'EDITOR',
        fullName: 'کارشناس تولید محتوا',
        email: 'editor@hodaschool.ir'
      };
      localStorage.setItem('hoda_admin_user', JSON.stringify(user));
      localStorage.setItem('hoda_admin_token', 'local_active_session_' + Date.now());
      logAudit('LOGIN_SUCCESS', 'User', user.id);
      return { user, token: 'local_active_session_' + Date.now() };
    }

    throw new Error('نام کاربری یا کلمه عبور نادرست است');
  }

  if (cleanEndpoint === '/auth/me') {
    const user = getItem('hoda_admin_user', {
      id: 'admin-main',
      username: 'superadmin',
      role: 'SUPERADMIN',
      fullName: 'مدیر کل سامانه'
    });
    return user;
  }

  if (cleanEndpoint === '/auth/logout') {
    localStorage.removeItem('hoda_admin_user');
    localStorage.removeItem('hoda_admin_token');
    return { success: true };
  }

  return { success: true };
}

function logAudit(action, entity, entityId) {
  try {
    const logs = getItem(STORAGE_KEYS.AUDIT_LOGS, []);
    logs.unshift({
      id: `log-${Date.now()}`,
      action,
      entity,
      entityId: String(entityId),
      createdAt: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      user: { fullName: 'مدیر سامانه', username: 'admin' }
    });
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  } catch {}
}

// Direct Live Readers for UI Components
export function getLiveSchools() {
  initMockStorage();
  const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
  const teachers = getItem(STORAGE_KEYS.TEACHERS, []);
  const facs = getItem(STORAGE_KEYS.FACILITIES, []);
  return schools.map(s => enrichSchool(s, teachers, facs));
}

export function getLiveNews() {
  initMockStorage();
  return getItem(STORAGE_KEYS.NEWS, newsData);
}

export function getLiveDocuments() {
  initMockStorage();
  return getItem(STORAGE_KEYS.DOCUMENTS, credentialsData);
}

export function getLiveSettings() {
  initMockStorage();
  const s = getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    general: { ...DEFAULT_SETTINGS.general, ...(s.general || {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(s.contact || {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(s.socials || {}) },
  };
}

export function getLiveAchievements(filters = {}) {
  initMockStorage();
  let items = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
  if (filters.category && filters.category !== 'all' && filters.category !== 'همه') {
    items = items.filter(a => a.category === filters.category);
  }
  if (filters.schoolSlug) {
    items = items.filter(a => a.schoolSlug === filters.schoolSlug || a.school?.slug === filters.schoolSlug);
  }
  if (filters.schoolId) {
    items = items.filter(a => String(a.schoolId) === String(filters.schoolId) || String(a.school?.id) === String(filters.schoolId));
  }
  if (filters.publishedOnly !== false) {
    items = items.filter(a => a.isPublished !== false);
  }
  return items;
}

export function getLiveMedia() {
  initMockStorage();
  return getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
}

export function getLiveMembers() {
  initMockStorage();
  return getItem(STORAGE_KEYS.MEMBERS, membersData);
}



