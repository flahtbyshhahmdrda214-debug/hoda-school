// Mock / LocalStorage Client-Side Database
// Provides offline and static hosting (e.g. Cloudflare Workers / Pages) data persistence

import { schoolsData } from '../data/schoolsData.js';
import { newsData } from '../data/newsData.js';
import { credentialsData } from '../data/credentialsData.js';

const STORAGE_KEYS = {
  SCHOOLS: 'hoda_schools_db',
  NEWS: 'hoda_news_db',
  TEACHERS: 'hoda_teachers_db',
  FACILITIES: 'hoda_facilities_db',
  DOCUMENTS: 'hoda_documents_db',
  SETTINGS: 'hoda_settings_db',
  MEDIA: 'hoda_media_db',
  AUDIT_LOGS: 'hoda_audit_logs_db',
};

function getItem(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Initializer
export function initMockStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
    setItem(STORAGE_KEYS.SCHOOLS, schoolsData.map(s => ({
      ...s,
      icon3dUrl: s.icon3d || s.icon3dUrl,
      teachers: s.teachers || [],
      facilities: s.facilities || [],
    })));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    setItem(STORAGE_KEYS.NEWS, newsData.map(n => ({
      ...n,
      slug: n.slug || `news-${n.id}`,
      contentHtml: n.content,
      coverImageUrl: n.thumbnail,
      isPublished: true,
      publishedAt: new Date().toISOString()
    })));
  }

  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    setItem(STORAGE_KEYS.DOCUMENTS, credentialsData.map(d => ({
      ...d,
      fileUrl: `/uploads/docs/${d.code || d.id}.pdf`,
      isPublished: true
    })));
  }

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
            roleTitle: t.role || '',
            educationDegree: t.degree || '',
            teachingExperience: t.experience || '',
            avatarUrl: t.avatar || '',
            sortOrder: 1,
            school: { id: sc.id, shortName: sc.shortName }
          });
        }
      }
    }
    setItem(STORAGE_KEYS.TEACHERS, allTeachers);
  }

  if (!localStorage.getItem(STORAGE_KEYS.FACILITIES)) {
    const allFacs = [];
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    for (const sc of schools) {
      if (Array.isArray(sc.facilities)) {
        for (const f of sc.facilities) {
          allFacs.push({
            id: `fac-${Math.random().toString(36).substring(2, 9)}`,
            schoolId: sc.id,
            title: f.title,
            description: f.desc || f.description || '',
            school: { id: sc.id, shortName: sc.shortName }
          });
        }
      }
    }
    setItem(STORAGE_KEYS.FACILITIES, allFacs);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, {
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
    });
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    setItem(STORAGE_KEYS.MEDIA, [
      { id: 'm1', filename: 'campus-1.webp', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', sizeBytes: 124500, createdAt: new Date().toISOString() },
      { id: 'm2', filename: 'quran-trophy.webp', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80', sizeBytes: 98000, createdAt: new Date().toISOString() },
      { id: 'm3', filename: 'robotics-lab.webp', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', sizeBytes: 154000, createdAt: new Date().toISOString() }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setItem(STORAGE_KEYS.AUDIT_LOGS, [
      { id: 'l1', action: 'SYSTEM_BOOT', entity: 'System', createdAt: new Date().toISOString(), ipAddress: '127.0.0.1', user: { fullName: 'مدیر کل سامانه', username: 'superadmin' } }
    ]);
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
    return schools;
  }
  if (cleanEndpoint.startsWith('/schools/')) {
    const slugOrId = cleanEndpoint.replace('/schools/', '');
    const schools = getItem(STORAGE_KEYS.SCHOOLS, schoolsData);
    const index = schools.findIndex(s => String(s.id) === slugOrId || s.slug === slugOrId);

    if (method === 'GET') {
      const sc = schools[index] || schools.find(s => s.slug === slugOrId);
      if (sc) return sc;
      throw new Error('مدرسه مورد نظر یافت نشد');
    }

    if (method === 'PUT') {
      if (index !== -1) {
        schools[index] = { ...schools[index], ...body };
        setItem(STORAGE_KEYS.SCHOOLS, schools);
        logAudit('UPDATE_SCHOOL', 'School', slugOrId);
        return schools[index];
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
        contentHtml: body.contentHtml || body.content || '',
        category: body.category || 'عمومی',
        coverImageUrl: body.coverImageUrl || body.thumbnail || '',
        publishedAt: new Date().toISOString(),
        isPublished: true,
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
      const newTeacher = {
        id: `teacher-${Date.now()}`,
        schoolId: body.schoolId,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        roleTitle: body.roleTitle || body.role || '',
        educationDegree: body.educationDegree || body.degree || '',
        teachingExperience: body.teachingExperience || body.experience || '',
        avatarUrl: body.avatarUrl || '',
        sortOrder: Number(body.sortOrder) || 1,
        school: { id: body.schoolId, shortName: 'مدرسه' }
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
      const newFac = {
        id: `fac-${Date.now()}`,
        schoolId: body.schoolId,
        title: body.title,
        description: body.description || '',
        school: { id: body.schoolId, shortName: 'مدرسه' }
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
        title: body.title,
        description: body.description || '',
        issuer: body.issuer || 'مجتمع آموزشی قرآنی هدی',
        fileUrl: body.fileUrl || '/uploads/doc.pdf',
        icon: body.iconName || 'ShieldCheck',
        badgeColor: 'blue'
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
      const filtered = docs.filter(d => String(d.id) !== id);
      setItem(STORAGE_KEYS.DOCUMENTS, filtered);
      logAudit('DELETE_DOCUMENT', 'Document', id);
      return { success: true };
    }
  }

  // 6. Settings
  if (cleanEndpoint === '/settings') {
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    if (method === 'GET') return settings;
    if (method === 'PUT') {
      const updated = { ...settings, ...body };
      setItem(STORAGE_KEYS.SETTINGS, updated);
      logAudit('UPDATE_SETTINGS', 'SiteSetting', 'all');
      return updated;
    }
  }
  if (cleanEndpoint.startsWith('/settings/')) {
    const key = cleanEndpoint.replace('/settings/', '');
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    if (method === 'PUT') {
      settings[key] = body.value !== undefined ? body.value : body;
      setItem(STORAGE_KEYS.SETTINGS, settings);
      logAudit('UPDATE_SETTING', 'SiteSetting', key);
      return { key, value: settings[key] };
    }
  }

  // 7. Media
  if (cleanEndpoint === '/media') {
    const media = getItem(STORAGE_KEYS.MEDIA, []);
    return { items: media, pagination: { page: 1, limit: 60, total: media.length } };
  }
  if (cleanEndpoint === '/media/upload') {
    const media = getItem(STORAGE_KEYS.MEDIA, []);
    const newMedia = {
      id: `media-${Date.now()}`,
      filename: `upload-${Date.now()}.webp`,
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
      sizeBytes: 85000,
      createdAt: new Date().toISOString()
    };
    media.unshift(newMedia);
    setItem(STORAGE_KEYS.MEDIA, media);
    logAudit('UPLOAD_MEDIA', 'Media', newMedia.id);
    return newMedia;
  }
  if (cleanEndpoint.startsWith('/media/')) {
    const id = cleanEndpoint.replace('/media/', '');
    const media = getItem(STORAGE_KEYS.MEDIA, []);
    if (method === 'DELETE') {
      const filtered = media.filter(m => String(m.id) !== id);
      setItem(STORAGE_KEYS.MEDIA, filtered);
      return { success: true };
    }
  }

  // 8. Users & Audit Logs
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

  // Default fallback
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
      user: { fullName: 'مدیر سامانه (Cloudflare Session)', username: 'superadmin' }
    });
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  } catch {}
}
