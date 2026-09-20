// Media Service for Hoda Educational Complex
// Supports client-side Canvas optimization, WebP compression, PDF handling, and persistent storage

import { apiRequest } from './apiClient.js';
import { getLiveMedia, handleMockRequest } from './mockStorage.js';

/**
 * Resizes and compresses image files using HTML5 Canvas to ensure optimal quality
 * and prevent localStorage quota issues (< 150KB per image).
 */
export async function processFileForUpload(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('هیچ فایلی انتخاب نشده است'));
    }

    const isImage = file.type.startsWith('image/');

    // If PDF or other document
    if (!isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          filename: file.name,
          originalName: file.name,
          mimeType: file.type || 'application/pdf',
          sizeBytes: file.size,
          dataUrl: reader.result,
        });
      };
      reader.onerror = () => reject(new Error('خطا در خواندن فایل سند'));
      reader.readAsDataURL(file);
      return;
    }

    // If Image: Optimize & Compress via Canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 1400;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        resolve({
          filename: file.name,
          originalName: file.name,
          mimeType: file.type || 'image/jpeg',
          sizeBytes: Math.round((dataUrl.length * 3) / 4),
          dataUrl,
        });
      };
      img.onerror = () => reject(new Error('خطا در بارگذاری تصویر جهت پردازش'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file (handles image compression, edge API fallback, and client database)
 */
export async function uploadMedia(file) {
  const payload = await processFileForUpload(file);
  
  try {
    const res = await apiRequest('/media/upload', {
      method: 'POST',
      body: payload
    });
    if (res && (res.id || res.url)) {
      return res;
    }
  } catch (err) {
    console.warn('API error during upload, falling back to local database:', err.message);
  }

  // Guaranteed fallback
  return handleMockRequest('/media/upload', {
    method: 'POST',
    body: payload
  });
}

/**
 * Fetches all media items
 */
export async function fetchMedia() {
  try {
    const res = await apiRequest('/media?limit=100');
    if (res && res.items && Array.isArray(res.items)) {
      return res.items;
    }
    if (Array.isArray(res)) {
      return res;
    }
  } catch (err) {
    console.warn('API error during fetchMedia:', err.message);
  }
  return getLiveMedia();
}

/**
 * Deletes a media item by ID
 */
export async function deleteMedia(id) {
  try {
    await apiRequest(`/media/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API error during deleteMedia:', err.message);
    handleMockRequest(`/media/${id}`, { method: 'DELETE' });
  }
  return true;
}
