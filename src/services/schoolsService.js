import { apiRequest } from './apiClient.js';
import { getLiveSchools } from './mockStorage.js';

export async function fetchSchools() {
  try {
    const data = await apiRequest('/public/schools');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchSchools, using persistent local storage:', err.message);
  }
  return getLiveSchools();
}

export async function fetchSchoolBySlug(slug) {
  try {
    const data = await apiRequest(`/public/schools/${slug}`);
    if (data && data.slug) {
      return data;
    }
  } catch (err) {
    console.warn(`API error for school ${slug}, using persistent local storage:`, err.message);
  }

  const schools = getLiveSchools();
  const found = schools.find((s) => s.slug === slug || String(s.id) === String(slug));
  if (found) return found;
  throw new Error('مدرسه مورد نظر یافت نشد');
}
