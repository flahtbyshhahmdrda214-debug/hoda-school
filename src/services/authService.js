import { apiRequest } from './apiClient.js';

export async function login(identifier, password) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: { identifier, password },
  });

  // Security: JWT token is transported securely via HttpOnly cookies and NOT stored in localStorage
  if (result.user) {
    localStorage.setItem('hoda_admin_user', JSON.stringify(result.user));
  }
  return result;
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('hoda_admin_token');
    localStorage.removeItem('hoda_admin_user');
  }
}

export async function getMe() {
  return await apiRequest('/auth/me');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('hoda_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('hoda_admin_user');
}
