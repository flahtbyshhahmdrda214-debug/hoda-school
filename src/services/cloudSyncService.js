// Cloud Sync Service for Hoda Educational Complex
// Automatically and simultaneously synchronizes data across all devices (PC, Phone, Tablet)
// without requiring manual QR codes or links.
//
// KEY DESIGN: Uses text/plain Content-Type for PUT requests to bypass CORS preflight.
// The browser sends OPTIONS preflight ONLY for non-simple content types.
// By using text/plain, we skip the preflight entirely and writes go through cleanly.

export const CLOUD_BINS = {
  meta: 'dbafcce',
  schools: 'accffec',
  news: 'bcfcecd',
  achievements: 'bbdbcce',
  documents: 'baacafc',
  members: 'dbcaeac',
  settings: 'fdbdeee',
  teachers: 'cdfbebd',
  facilities: 'ccbcece',
};

const KEY_TO_BIN = {
  'hoda_schools_db': 'schools',
  'hoda_news_db': 'news',
  'hoda_achievements_db': 'achievements',
  'hoda_documents_db': 'documents',
  'hoda_members_db': 'members',
  'hoda_settings_db': 'settings',
  'hoda_teachers_db': 'teachers',
  'hoda_facilities_db': 'facilities',
};

const BIN_TO_KEY = {
  schools: 'hoda_schools_db',
  news: 'hoda_news_db',
  achievements: 'hoda_achievements_db',
  documents: 'hoda_documents_db',
  members: 'hoda_members_db',
  settings: 'hoda_settings_db',
  teachers: 'hoda_teachers_db',
  facilities: 'hoda_facilities_db',
};

const BASE_API = 'https://extendsclass.com/api/json-storage/bin';

// Internal state
let isPullingFromCloud = false;
let syncStatus = 'idle';
let lastError = null;
let pushTimeouts = {};
let isInitialized = false;

export function getDeviceId() {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = localStorage.getItem('hoda_client_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('hoda_client_device_id', id);
    }
    return id;
  } catch {
    return 'temp_device_' + Date.now();
  }
}

function setStatus(status, err = null) {
  syncStatus = status;
  lastError = err;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hoda_cloud_sync_status', {
      detail: { status, error: err, timestamp: Date.now() }
    }));
  }
}

export function getSyncStatus() { return syncStatus; }
export function getLastError() { return lastError; }
export function isCloudPullInProgress() { return isPullingFromCloud; }

export function onCloudSyncStatusChange(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener('hoda_cloud_sync_status', handler);
  callback({ status: syncStatus, error: lastError, timestamp: Date.now() });
  return () => window.removeEventListener('hoda_cloud_sync_status', handler);
}

/**
 * READ from cloud - simple GET, always works (no preflight needed for GET)
 */
async function fetchBin(binName, timeoutMs = 8000) {
  const binId = CLOUD_BINS[binName];
  if (!binId) throw new Error('Unknown bin: ' + binName);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${BASE_API}/${binId}?_t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} reading bin ${binName}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * WRITE to cloud - uses text/plain to avoid CORS preflight.
 * text/plain is a "simple" CORS content-type, so the browser sends NO OPTIONS preflight.
 * ExtendsClass accepts and stores the JSON body regardless of Content-Type header.
 */
async function updateBin(binName, payload, timeoutMs = 10000) {
  const binId = CLOUD_BINS[binName];
  if (!binId) throw new Error('Unknown bin: ' + binName);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const bodyString = JSON.stringify(payload);

  try {
    const url = `${BASE_API}/${binId}`;
    const res = await fetch(url, {
      method: 'PUT',
      // Use text/plain intentionally to bypass CORS preflight (OPTIONS request)
      // which fails on extendsclass.com with HTTP 500
      headers: { 'Content-Type': 'text/plain' },
      body: bodyString,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} writing bin ${binName}`);
    return await res.json().catch(() => ({ ok: true }));
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Automatically push a single key's data to cloud after a short debounce.
 * Called automatically from mockStorage.setItem on every admin save.
 */
export function schedulePushToCloud(key, data) {
  if (typeof window === 'undefined') return;
  if (isPullingFromCloud) return; // Prevent echo loop

  const binName = KEY_TO_BIN[key];
  if (!binName) return;

  if (pushTimeouts[key]) clearTimeout(pushTimeouts[key]);

  setStatus('syncing');

  pushTimeouts[key] = setTimeout(async () => {
    delete pushTimeouts[key];
    try {
      if (!navigator.onLine) { setStatus('offline'); return; }

      await updateBin(binName, data);

      const nowIso = new Date().toISOString();
      await updateBin('meta', {
        version: Date.now(),
        lastUpdated: nowIso,
        updatedKey: binName,
        deviceId: getDeviceId(),
      });

      try { localStorage.setItem('hoda_cloud_synced_at', nowIso); } catch {}
      setStatus('synced');
    } catch (err) {
      console.warn('[CloudSync] Push failed:', err.message);
      setStatus('error', err.message);
    }
  }, 600);
}

/**
 * Pull latest data from cloud and apply to localStorage.
 * force=true always downloads everything regardless of timestamps.
 */
export function pullFromCloud(force = false) {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (!navigator.onLine) { setStatus('offline'); return Promise.resolve(false); }

  return (async () => {
    try {
      const meta = await fetchBin('meta');
      if (!meta || !meta.lastUpdated) return false;

      const localSyncedAt = localStorage.getItem('hoda_cloud_synced_at');
      const myId = getDeviceId();

      // Already up-to-date (this device pushed it)
      if (!force && meta.deviceId === myId && localSyncedAt === meta.lastUpdated) {
        setStatus('synced');
        return false;
      }

      // Already up-to-date by time
      if (!force && localSyncedAt && new Date(localSyncedAt).getTime() >= new Date(meta.lastUpdated).getTime()) {
        setStatus('synced');
        return false;
      }

      setStatus('syncing');
      isPullingFromCloud = true;

      const shouldPullAll = force || !localSyncedAt || meta.updatedKey === 'all' || !meta.updatedKey;

      if (shouldPullAll) {
        const collections = ['schools', 'news', 'achievements', 'documents', 'members', 'settings', 'teachers', 'facilities'];
        const results = await Promise.allSettled(collections.map(col => fetchBin(col).then(data => ({ col, data }))));

        results.forEach(res => {
          if (res.status === 'fulfilled' && res.value?.data) {
            const { col, data } = res.value;
            const storageKey = BIN_TO_KEY[col];
            if (storageKey) {
              try {
                localStorage.setItem(storageKey, JSON.stringify(data));
                window.dispatchEvent(new CustomEvent('hoda_data_changed', {
                  detail: { key: storageKey, val: data, source: 'cloud' }
                }));
              } catch {}
            }
          }
        });
      } else {
        const col = meta.updatedKey;
        const storageKey = BIN_TO_KEY[col];
        if (col && storageKey) {
          const data = await fetchBin(col);
          if (data != null) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(data));
              window.dispatchEvent(new CustomEvent('hoda_data_changed', {
                detail: { key: storageKey, val: data, source: 'cloud' }
              }));
            } catch {}
          }
        }
      }

      localStorage.setItem('hoda_cloud_synced_at', meta.lastUpdated);
      isPullingFromCloud = false;
      setStatus('synced');
      return true;
    } catch (err) {
      isPullingFromCloud = false;
      console.warn('[CloudSync] Pull failed:', err.message);
      setStatus('error', err.message);
      return false;
    }
  })();
}

/**
 * Push ALL localStorage data to cloud immediately.
 * Called when admin clicks the cloud sync button.
 */
export async function pushAllToCloud() {
  if (typeof window === 'undefined') return false;
  if (!navigator.onLine) { setStatus('offline'); throw new Error('اتصال اینترنت برقرار نیست.'); }

  setStatus('syncing');
  try {
    const collections = ['schools', 'news', 'achievements', 'documents', 'members', 'settings', 'teachers', 'facilities'];
    for (const col of collections) {
      const storageKey = BIN_TO_KEY[col];
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try { await updateBin(col, JSON.parse(raw)); } catch {}
      }
    }

    const nowIso = new Date().toISOString();
    await updateBin('meta', {
      version: Date.now(),
      lastUpdated: nowIso,
      updatedKey: 'all',
      deviceId: getDeviceId(),
    });
    localStorage.setItem('hoda_cloud_synced_at', nowIso);
    setStatus('synced');
    return true;
  } catch (err) {
    setStatus('error', err.message);
    throw err;
  }
}

/**
 * Start automatic background sync loop.
 * - On startup: pull cloud data (or push local data if cloud is empty)
 * - Every 18s: check for updates
 * - On tab focus: check for updates
 * - On network reconnect: sync
 */
export function initAutoCloudSync() {
  if (typeof window === 'undefined' || isInitialized) return () => {};
  isInitialized = true;

  // Initial sync after short delay
  setTimeout(async () => {
    try {
      const meta = await fetchBin('meta').catch(() => null);
      // If cloud has never been populated by the admin, do nothing
      // If cloud has data, pull it
      if (meta && meta.lastUpdated) {
        await pullFromCloud(false);
      } else {
        setStatus('synced');
      }
    } catch {
      setStatus('idle');
    }
  }, 500);

  // Poll every 18 seconds for updates from other devices
  const intervalId = setInterval(() => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      pullFromCloud(false);
    }
  }, 18000);

  // Pull when switching back to this tab
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      pullFromCloud(false);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Handle network reconnect
  const handleOnline = () => { setStatus('syncing'); pullFromCloud(false); };
  const handleOffline = () => { setStatus('offline'); };
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
