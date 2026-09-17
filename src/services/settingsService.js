import { apiRequest } from './apiClient.js';
import { getLiveSettings } from './mockStorage.js';

export async function fetchSettings() {
  try {
    const data = await apiRequest('/settings');
    if (data && typeof data === 'object') {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchSettings, using persistent local storage:', err.message);
  }
  return getLiveSettings();
}

export async function updateSetting(key, value) {
  return await apiRequest(`/settings/${key}`, {
    method: 'PUT',
    body: { value }
  });
}
