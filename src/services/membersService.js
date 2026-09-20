// Members, Leadership & Board of Trustees Service
import { apiRequest } from './apiClient.js';
import { getLiveMembers, handleMockRequest, setItem, getItem, STORAGE_KEYS } from './mockStorage.js';
import { membersData } from '../data/membersData.js';

export async function fetchMembers() {
  try {
    const data = await apiRequest('/members');
    if (data && typeof data === 'object' && (data.director || data.trustees || data.principals)) {
      return data;
    }
  } catch (err) {
    console.warn('API error in fetchMembers, falling back to local database:', err.message);
  }
  return getLiveMembers();
}

export async function saveMembers(payload) {
  try {
    const res = await apiRequest('/members', {
      method: 'PUT',
      body: payload
    });
    if (res) return res;
  } catch (err) {
    console.warn('API error in saveMembers, saving locally:', err.message);
  }
  return handleMockRequest('/members', {
    method: 'PUT',
    body: payload
  });
}

export async function updateDirector(directorData) {
  try {
    const res = await apiRequest('/members/director', {
      method: 'PUT',
      body: directorData
    });
    if (res) return res;
  } catch (err) {
    console.warn('API error in updateDirector:', err.message);
  }
  return handleMockRequest('/members/director', {
    method: 'PUT',
    body: directorData
  });
}

export async function addTrustee(trusteeData) {
  try {
    const res = await apiRequest('/members/trustees', {
      method: 'POST',
      body: trusteeData
    });
    if (res) return res;
  } catch (err) {
    console.warn('API error in addTrustee:', err.message);
  }
  return handleMockRequest('/members/trustees', {
    method: 'POST',
    body: trusteeData
  });
}

export async function updateTrustee(id, trusteeData) {
  try {
    const res = await apiRequest(`/members/trustees/${id}`, {
      method: 'PUT',
      body: trusteeData
    });
    if (res) return res;
  } catch (err) {
    console.warn('API error in updateTrustee:', err.message);
  }
  return handleMockRequest(`/members/trustees/${id}`, {
    method: 'PUT',
    body: trusteeData
  });
}

export async function deleteTrustee(id) {
  try {
    await apiRequest(`/members/trustees/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('API error in deleteTrustee:', err.message);
  }
  return handleMockRequest(`/members/trustees/${id}`, {
    method: 'DELETE'
  });
}

export async function updatePrincipal(id, principalData) {
  try {
    const res = await apiRequest(`/members/principals/${id}`, {
      method: 'PUT',
      body: principalData
    });
    if (res) return res;
  } catch (err) {
    console.warn('API error in updatePrincipal:', err.message);
  }
  return handleMockRequest(`/members/principals/${id}`, {
    method: 'PUT',
    body: principalData
  });
}
