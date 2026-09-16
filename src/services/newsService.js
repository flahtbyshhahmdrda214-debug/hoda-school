import { apiRequest } from './apiClient.js';
import { newsData } from '../data/newsData.js';

export async function fetchNews(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const data = await apiRequest(`/public/news${query ? `?${query}` : ''}`);
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return newsData;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback newsData:', err.message);
    return newsData;
  }
}

export async function fetchNewsBySlug(slug) {
  try {
    const data = await apiRequest(`/public/news/${slug}`);
    if (data && data.slug) return data;
  } catch (err) {
    console.warn(`Backend API unreachable for news ${slug}, using static fallback:`, err.message);
  }

  const fallback = newsData.find((n) => String(n.id) === slug || n.title?.includes(slug));
  if (fallback) return fallback;
  throw new Error('خبر مورد نظر یافت نشد');
}
