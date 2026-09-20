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

export async function createDocument(payload) {
  return apiRequest('/documents', { method: 'POST', body: payload });
}

export async function updateDocument(id, payload) {
  return apiRequest(`/documents/${id}`, { method: 'PUT', body: payload });
}

export async function deleteDocument(id) {
  return apiRequest(`/documents/${id}`, { method: 'DELETE' });
}
