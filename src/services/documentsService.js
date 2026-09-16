import { apiRequest } from './apiClient.js';
import { credentialsData } from '../data/credentialsData.js';

export async function fetchDocuments() {
  try {
    const data = await apiRequest('/public/documents');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return credentialsData;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback credentialsData:', err.message);
    return credentialsData;
  }
}
