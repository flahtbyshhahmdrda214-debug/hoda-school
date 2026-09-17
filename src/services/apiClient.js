import { handleMockRequest } from './mockStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/api/v1`
    : 'http://localhost:4000/api/v1'
);

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('hoda_admin_token');
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = typeof fetchOptions.body === 'string' ? fetchOptions.body : JSON.stringify(fetchOptions.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type') || '';

    // If response is HTML (e.g. Cloudflare Worker SPA rewrite for non-existent API routes)
    if (!contentType.includes('application/json')) {
      return handleMockRequest(endpoint, options);
    }

    const json = await response.json().catch(() => null);

    if (!response.ok || !json) {
      if (response.status === 404) {
        return handleMockRequest(endpoint, options);
      }
      const error = new Error(json?.message || 'خطایی در ارتباط با سرور رخ داده است');
      error.status = response.status;
      error.code = json?.code;
      error.data = json;
      throw error;
    }

    return json.data !== undefined ? json.data : json;
  } catch (err) {
    // If network fails or blocked by mixed content on Cloudflare
    console.warn(`Remote API unreachable for ${endpoint}, falling back to persistent client storage:`, err.message);
    return handleMockRequest(endpoint, options);
  }
}
