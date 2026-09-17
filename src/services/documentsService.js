import { apiRequest } from './apiClient.js';
import { getLiveDocuments } from './mockStorage.js';

export async function fetchDocuments() {
  try {
    const data = await apiRequest('/public/documents');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchDocuments, using persistent local storage:', err.message);
  }
  return getLiveDocuments();
}
