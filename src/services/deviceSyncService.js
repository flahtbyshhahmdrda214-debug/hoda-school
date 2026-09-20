// Device Sync Service for Hoda Educational Complex
// Enables 100% reliable, zero-latency sync between PC, Phone, and other devices
// via Native Compressed Streams, QR Codes, Direct Links, and Backup Files.

import { STORAGE_KEYS, getItem, setItem } from './mockStorage';

/**
 * Gathers all data stored in the local CMS database
 */
export function exportAllData() {
  const exported = {
    meta: {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'Hoda Educational Complex CMS',
    },
    schools: getItem(STORAGE_KEYS.SCHOOLS, []),
    news: getItem(STORAGE_KEYS.NEWS, []),
    achievements: getItem(STORAGE_KEYS.ACHIEVEMENTS, []),
    documents: getItem(STORAGE_KEYS.DOCUMENTS, []),
    members: getItem(STORAGE_KEYS.MEMBERS, null),
    teachers: getItem(STORAGE_KEYS.TEACHERS, []),
    facilities: getItem(STORAGE_KEYS.FACILITIES, []),
    settings: getItem(STORAGE_KEYS.SETTINGS, {}),
    media: getItem(STORAGE_KEYS.MEDIA, []),
    siteFont: localStorage.getItem('hoda_site_font') || 'vazirmatn',
  };

  return exported;
}

/**
 * Writes imported data into local storage and notifies all active components
 */
export function importAllData(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('داده‌های ارائه‌شده نامعتبر است.');
  }

  const keysUpdated = [];

  if (payload.schools && Array.isArray(payload.schools) && payload.schools.length > 0) {
    setItem(STORAGE_KEYS.SCHOOLS, payload.schools);
    keysUpdated.push('مدارس چهارگانه');
  }

  if (payload.news && Array.isArray(payload.news) && payload.news.length > 0) {
    setItem(STORAGE_KEYS.NEWS, payload.news);
    keysUpdated.push('اخبار و اطلاعیه‌ها');
  }

  if (payload.achievements && Array.isArray(payload.achievements) && payload.achievements.length > 0) {
    setItem(STORAGE_KEYS.ACHIEVEMENTS, payload.achievements);
    keysUpdated.push('تالار افتخارات');
  }

  if (payload.documents && Array.isArray(payload.documents) && payload.documents.length > 0) {
    setItem(STORAGE_KEYS.DOCUMENTS, payload.documents);
    keysUpdated.push('اسناد و مجوزها');
  }

  if (payload.members && typeof payload.members === 'object') {
    setItem(STORAGE_KEYS.MEMBERS, payload.members);
    keysUpdated.push('ارکان و مدیران مجتمع');
  }

  if (payload.teachers && Array.isArray(payload.teachers) && payload.teachers.length > 0) {
    setItem(STORAGE_KEYS.TEACHERS, payload.teachers);
    keysUpdated.push('اساتید و معلمان');
  }

  if (payload.facilities && Array.isArray(payload.facilities) && payload.facilities.length > 0) {
    setItem(STORAGE_KEYS.FACILITIES, payload.facilities);
    keysUpdated.push('امکانات آموزشی');
  }

  if (payload.settings && typeof payload.settings === 'object') {
    setItem(STORAGE_KEYS.SETTINGS, payload.settings);
    keysUpdated.push('تنظیمات عمومی');
  }

  if (payload.media && Array.isArray(payload.media) && payload.media.length > 0) {
    setItem(STORAGE_KEYS.MEDIA, payload.media);
    keysUpdated.push('رسانه‌ها');
  }

  if (payload.siteFont) {
    localStorage.setItem('hoda_site_font', payload.siteFont);
    document.documentElement.setAttribute('data-font', payload.siteFont);
    keysUpdated.push('فونت سایت');
  }

  // Set last sync timestamp
  const now = new Date().toISOString();
  localStorage.setItem('hoda_last_device_sync', now);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hoda_data_changed', { detail: { sync: true, keys: keysUpdated } }));
  }

  return { success: true, keysUpdated, timestamp: now };
}

/**
 * Compresses a string or JSON into a URL-safe Base64 string
 */
export async function compressData(jsonObj) {
  const jsonStr = typeof jsonObj === 'string' ? jsonObj : JSON.stringify(jsonObj);

  if (typeof window !== 'undefined' && 'CompressionStream' in window) {
    try {
      const byteArray = new TextEncoder().encode(jsonStr);
      const stream = new Response(byteArray).body.pipeThrough(new window.CompressionStream('deflate'));
      const buffer = await new Response(stream).arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      
      let binary = '';
      for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (err) {
      console.warn('CompressionStream failed, using URI encode fallback:', err);
    }
  }

  // Fallback
  return encodeURIComponent(jsonStr);
}

/**
 * Decompresses a Base64-url string back into JSON
 */
export async function decompressData(encodedStr) {
  if (!encodedStr) throw new Error('رشته داده همگام‌سازی خالی است');

  // Try CompressionStream deflate first
  if (typeof window !== 'undefined' && 'DecompressionStream' in window) {
    try {
      let b64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const stream = new Response(bytes).body.pipeThrough(new window.DecompressionStream('deflate'));
      const text = await new Response(stream).text();
      return JSON.parse(text);
    } catch {
      // Might be URI encoded fallback
    }
  }

  // Fallback
  try {
    const decoded = decodeURIComponent(encodedStr);
    return JSON.parse(decoded);
  } catch (err) {
    throw new Error('قالب داده همگام‌سازی معتبر نیست: ' + err.message);
  }
}

/**
 * Generates direct sync link with compressed state
 */
export async function generateSyncUrl() {
  const fullData = exportAllData();
  const compressed = await compressData(fullData);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://hoda-school.flahtbyshhahmdrda214.workers.dev';
  return `${base}/sync?d=${compressed}`;
}

/**
 * Downloads a complete JSON snapshot file
 */
export function downloadBackupFile() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');
  a.download = `hoda-school-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Restores data from a user-uploaded JSON file
 */
export async function restoreFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('هیچ فایلی انتخاب نشده است'));
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const result = importAllData(json);
        resolve(result);
      } catch (err) {
        reject(new Error('فایل پشتیبان معتبر نیست یا محتوای آن آسیب دیده است: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsText(file);
  });
}
