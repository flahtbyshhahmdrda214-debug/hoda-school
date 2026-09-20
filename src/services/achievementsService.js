import { apiRequest } from './apiClient.js';
import { getLiveAchievements } from './mockStorage.js';

export async function fetchAchievements(params = {}) {
  try {
    const cleanParams = {};
    if (params.schoolSlug) cleanParams.schoolSlug = params.schoolSlug;
    if (params.category && params.category !== 'all' && params.category !== 'همه') cleanParams.category = params.category;
    
    const query = new URLSearchParams(cleanParams).toString();
    const data = await apiRequest(`/public/achievements${query ? `?${query}` : ''}`);
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchAchievements, using persistent local storage:', err.message);
  }
  return getLiveAchievements(params);
}

export async function fetchAdminAchievements(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const data = await apiRequest(`/achievements${query ? `?${query}` : ''}`);
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchAdminAchievements, using persistent local storage:', err.message);
  }
  return getLiveAchievements({ ...params, publishedOnly: false });
}

export async function createAchievement(payload) {
  return apiRequest('/achievements', {
    method: 'POST',
    body: payload,
  });
}

export async function updateAchievement(id, payload) {
  return apiRequest(`/achievements/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteAchievement(id) {
  return apiRequest(`/achievements/${id}`, {
    method: 'DELETE',
  });
}
