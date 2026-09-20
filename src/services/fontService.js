// Font & Typography Service for Hoda Educational Complex
// Supports: Vazirmatn, Estedad, Peyda, Dana, Noto Naskh Arabic

import { apiRequest } from './apiClient.js';
import { getItem, setItem, STORAGE_KEYS } from './mockStorage.js';

export const FONT_STORAGE_KEY = 'hoda_site_font';

export const AVAILABLE_FONTS = [
  {
    id: 'vazirmatn',
    name: 'وزیرمتن',
    enName: 'Vazirmatn',
    description: 'ظاهر رسمی و امروزی، خوانایی بسیار خوب.',
    tagline: 'قلم رسمی، مدرن با وضوح و خوانایی استثنایی در تمامی نمایشگرها',
    badge: 'پیش‌فرض و استاندارد',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    family: "'Vazirmatn', system-ui, sans-serif",
    previewClass: 'font-vazirmatn',
    weights: ['۳۰۰', '۴۰۰', '۵۰۰', '۶۰۰', '۷۰۰', '۸۰۰', '۹۰۰'],
    sampleVerse: '«اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ» — پرورش ایمان، اخلاق و خلاقیت',
    sampleTitle: 'مجتمع آموزشی قرآنی هدی؛ افق‌های روشن در سایه‌سار قرآن',
  },
  {
    id: 'estedad',
    name: 'استعداد',
    enName: 'Estedad',
    description: 'برای یک مؤسسه آموزشی، مخصوصاً تیترهای بزرگ، ظاهر بسیار خوبی می‌دهد.',
    tagline: 'مناسب‌ترین گزینه برای نهادهای آموزشی، سرتیترهای پرانرژی و متون آکادمیک',
    badge: 'ویژه مؤسسات آموزشی',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    family: "'Estedad', system-ui, sans-serif",
    previewClass: 'font-estedad',
    weights: ['۴۰۰', '۵۰۰', '۶۰۰', '۷۰۰', '۸۰۰'],
    sampleVerse: '«يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ»',
    sampleTitle: 'مجتمع آموزشی قرآنی هدی؛ افق‌های روشن در سایه‌سار قرآن',
  },
  {
    id: 'peyda',
    name: 'پیدا',
    enName: 'Peyda',
    description: 'اگر بخواهی سایت کمی مدرن‌تر و برندمحورتر باشد.',
    tagline: 'شخصیت بصری برجسته، هندسه چشم‌نواز و هویت متمایز برند',
    badge: 'مدرن و هویت برند',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    family: "'Peyda', system-ui, sans-serif",
    weights: ['۴۰۰', '۵۰۰', '۶۰۰', '۷۰۰', '۸۰۰'],
    sampleVerse: '«ن ۚ وَالْقَلَمِ وَمَا يَسْطُرُونَ» — پیشگام در نوآوری و تعلیم',
    sampleTitle: 'مجتمع آموزشی قرآنی هدی؛ افق‌های روشن در سایه‌سار قرآن',
  },
  {
    id: 'dana',
    name: 'دانا',
    enName: 'Dana',
    description: 'حس حرفه‌ای و نرم‌تر دارد.',
    tagline: 'انحناهای دلپذیر و دوستانه، تجربه مطالعه ملایم و ارگونومیک',
    badge: 'حرفه‌ای و نرم',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    family: "'Dana', system-ui, sans-serif",
    weights: ['۴۰۰', '۵۰۰', '۶۰۰', '۷۰۰'],
    sampleVerse: '«رَبِّ زِدْنِي عِلْمًا» — فضایی پویا، امن و سرشار از محبت و معرفت',
    sampleTitle: 'مجتمع آموزشی قرآنی هدی؛ افق‌های روشن در سایه‌سار قرآن',
  },
  {
    id: 'noto-naskh',
    name: 'نوتو نسخ عربی',
    enName: 'Noto Naskh Arabic',
    description: 'اصالت قرآنی و اسلامی، باوقار و سنتی برای متون دینی و رسمی.',
    tagline: 'خط اصیل نسخ متناسب با هویت قرآنی و ارزش‌های اسلامی مجتمع',
    badge: 'اصالت قرآنی و اسلامی',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    family: "'Noto Naskh Arabic', serif, system-ui",
    previewClass: 'font-noto-naskh',
    weights: ['۴۰۰', '۵۰۰', '۶۰۰', '۷۰۰'],
    sampleVerse: '«بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ»',
    sampleTitle: 'مجتمع آموزشی قرآنی هدی؛ افق‌های روشن در سایه‌سار قرآن',
  },
];

/**
 * Gets the current font ID (fallback to 'vazirmatn')
 */
export function getActiveFontId() {
  if (typeof window === 'undefined') return 'vazirmatn';
  try {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    if (saved && AVAILABLE_FONTS.some(f => f.id === saved)) {
      return saved;
    }
    const settings = getItem(STORAGE_KEYS.SETTINGS, {});
    const fontFromSettings = settings.site_font || (settings.typography && settings.typography.fontFamily);
    if (fontFromSettings && AVAILABLE_FONTS.some(f => f.id === fontFromSettings)) {
      return fontFromSettings;
    }
  } catch (err) {
    console.warn('Error reading font setting:', err);
  }
  return 'vazirmatn';
}

/**
 * Applies the given font to the HTML document and CSS variables immediately
 */
export function applySiteFont(fontId) {
  const validFont = AVAILABLE_FONTS.find(f => f.id === fontId) || AVAILABLE_FONTS[0];
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-font', validFont.id);
    document.body?.setAttribute('data-font', validFont.id);
    document.documentElement.style.setProperty('--font-site', validFont.family);
    if (document.body) {
      document.body.style.fontFamily = validFont.family;
    }
  }
  return validFont;
}

/**
 * Persists the selected font both locally and in CMS backend settings
 */
export async function saveSiteFont(fontId) {
  const validFont = applySiteFont(fontId);
  try {
    localStorage.setItem(FONT_STORAGE_KEY, validFont.id);
    
    // Save to settings
    const currentSettings = getItem(STORAGE_KEYS.SETTINGS, {});
    const updatedSettings = {
      ...currentSettings,
      site_font: validFont.id,
      typography: {
        ...(currentSettings.typography || {}),
        fontFamily: validFont.id,
        fontName: validFont.name,
      }
    };
    setItem(STORAGE_KEYS.SETTINGS, updatedSettings);

    // Call API endpoint
    try {
      await apiRequest('/settings/site_font', {
        method: 'PUT',
        body: { value: validFont.id }
      });
    } catch {
      // Offline / Worker mock handled by mockStorage
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hoda_data_changed', { 
        detail: { key: 'site_font', val: validFont.id } 
      }));
    }
  } catch (err) {
    console.error('Failed to save font:', err);
  }
  return validFont;
}

/**
 * Initializes font listener and applies saved font on startup
 */
export function initSiteFont() {
  const activeId = getActiveFontId();
  applySiteFont(activeId);

  if (typeof window !== 'undefined') {
    const handler = (e) => {
      if (e.detail?.key === 'site_font' || e.detail?.key === STORAGE_KEYS.SETTINGS) {
        const id = getActiveFontId();
        applySiteFont(id);
      }
    };
    window.addEventListener('hoda_data_changed', handler);
    return () => window.removeEventListener('hoda_data_changed', handler);
  }
  return () => {};
}
