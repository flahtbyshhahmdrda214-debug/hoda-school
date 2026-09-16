import { apiRequest } from './apiClient.js';
import { schoolsData } from '../data/schoolsData.js';

export async function fetchSchools() {
  try {
    const data = await apiRequest('/public/schools');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return schoolsData;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback schoolsData:', err.message);
    return schoolsData;
  }
}

export async function fetchSchoolBySlug(slug) {
  try {
    const data = await apiRequest(`/public/schools/${slug}`);
    if (data && data.slug) {
      return data;
    }
  } catch (err) {
    console.warn(`Backend API unreachable for school ${slug}, using static fallback:`, err.message);
  }

  const fallback = schoolsData.find((s) => s.slug === slug);
  if (fallback) return fallback;
  throw new Error('مدرسه مورد نظر یافت نشد');
}
