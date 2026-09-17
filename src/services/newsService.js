import { apiRequest } from './apiClient.js';
import { getLiveNews } from './mockStorage.js';

export async function fetchNews(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const data = await apiRequest(`/public/news${query ? `?${query}` : ''}`);
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchNews, using persistent local storage:', err.message);
  }
  return getLiveNews();
}

export async function fetchNewsBySlug(slug) {
  try {
    const data = await apiRequest(`/public/news/${slug}`);
    if (data && data.slug) return data;
  } catch (err) {
    console.warn(`API error for news ${slug}, using persistent local storage:`, err.message);
  }

  const allNews = getLiveNews();
  const fallback = allNews.find((n) => String(n.id) === String(slug) || n.slug === slug || n.title?.includes(slug));
  if (fallback) return fallback;
  throw new Error('خبر مورد نظر یافت نشد');
}
