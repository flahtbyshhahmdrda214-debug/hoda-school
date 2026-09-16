const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  // Attach token from localStorage if present (as fallback for environments without cookie support)
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

  const response = await fetch(url, fetchOptions);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(json.message || 'خطایی در ارتباط با سرور رخ داده است');
    error.status = response.status;
    error.code = json.code;
    error.data = json;
    throw error;
  }

  return json.data;
}
