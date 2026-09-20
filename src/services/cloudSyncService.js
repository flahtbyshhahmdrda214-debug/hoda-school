// Cloud Sync Service for Hoda Educational Complex
// Automatically and simultaneously synchronizes data across all devices (PC, Phone, Tablet)
// without requiring manual QR codes or links.

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
let syncStatus = 'idle'; // 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
let lastError = null;
let pushTimeouts = {};
let isInitialized = false;

/**
 * Returns a unique device/client identifier stored locally
 */
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

/**
 * Updates internal sync status and emits an event
 */
function setStatus(status, err = null) {
  syncStatus = status;
  lastError = err;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hoda_cloud_sync_status', { 
      detail: { status, error: err, timestamp: Date.now() } 
    }));
  }
}

export function getSyncStatus() {
  return syncStatus;
}

export function getLastError() {
  return lastError;
}

export function isCloudPullInProgress() {
  return isPullingFromCloud;
}

/**
 * Subscribe to cloud sync status changes
 */
export function onCloudSyncStatusChange(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener('hoda_cloud_sync_status', handler);
  // Emit initial current state immediately
  callback({ status: syncStatus, error: lastError, timestamp: Date.now() });
  return () => window.removeEventListener('hoda_cloud_sync_status', handler);
}

/**
 * Fetch a JSON bin from cloud:
 * 1. Tries same-origin Cloudflare Edge API (/api/sync/get)
 * 2. Falls back to direct ExtendsClass URL with cache-busting
 */
async function fetchBin(binName, timeoutMs = 8000) {
  const binId = CLOUD_BINS[binName];
  if (!binId) throw new Error('Unknown bin: ' + binName);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Strategy 1: Same-origin Worker proxy (Clean, bypasses all CORS)
  try {
    const res = await fetch(`/api/sync/get?bin=${binName}&_t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'no-store'
    });
    if (res.ok) {
      clearTimeout(timer);
      const data = await res.json();
      return data;
    }
  } catch {}

  // Strategy 2: Direct URL fallback
  try {
    const url = `${BASE_API}/${binId}?_t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from bin ${binId}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Save data to a cloud bin:
 * 1. Tries same-origin Cloudflare Edge API (/api/sync/put)
 * 2. Falls back to direct ExtendsClass PUT with text/plain (skips browser OPTIONS preflight 500)
 */
async function updateBin(binName, payload, timeoutMs = 10000) {
  const binId = CLOUD_BINS[binName];
  if (!binId) throw new Error('Unknown bin: ' + binName);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const bodyString = JSON.stringify(payload);

  // Strategy 1: Same-origin Worker proxy (Safe & Direct)
  try {
    const res = await fetch(`/api/sync/put?bin=${binName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyString,
      signal: controller.signal,
    });
    if (res.ok) {
      clearTimeout(timer);
      return await res.json().catch(() => ({ ok: true }));
    }
  } catch {}

  // Strategy 2: Direct ExtendsClass with text/plain header
  try {
    const url = `${BASE_API}/${binId}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: bodyString,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} updating bin ${binId}`);
    }
    return await res.json().catch(() => ({ ok: true }));
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Schedule a debounced push of a specific storage key to the cloud
 */
export function schedulePushToCloud(key, data) {
  if (typeof window === 'undefined') return;
  if (isPullingFromCloud) return; // Prevent loop

  const binName = KEY_TO_BIN[key];
  if (!binName || !CLOUD_BINS[binName]) return;

  if (pushTimeouts[key]) {
    clearTimeout(pushTimeouts[key]);
  }

  setStatus('syncing');

  // Debounce by 600ms to batch rapid successive edits
  pushTimeouts[key] = setTimeout(async () => {
    delete pushTimeouts[key];
    try {
      if (!navigator.onLine) {
        setStatus('offline');
        return;
      }

      await updateBin(binName, data);

      // Update meta bin
      const nowIso = new Date().toISOString();
      const meta = {
        version: Date.now(),
        lastUpdated: nowIso,
        updatedKey: binName,
        deviceId: getDeviceId(),
      };
      await updateBin('meta', meta);

      try {
        localStorage.setItem('hoda_cloud_synced_at', nowIso);
      } catch {}

      setStatus('synced');
    } catch (err) {
      console.warn('[CloudSync] Error pushing to cloud:', err);
      setStatus('error', err.message || 'خطا در اتصال به سرور ابری');
    }
  }, 600);
}

/**
 * Pull latest updates from the cloud
 * @param {boolean} force - If true, pulls all data regardless of timestamps
 */
export function pullFromCloud(force = false) {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (!navigator.onLine) {
    setStatus('offline');
    return Promise.resolve(false);
  }

  return (async () => {
    try {
      // 1. Fetch metadata
      const meta = await fetchBin('meta');
      if (!meta || !meta.lastUpdated) return false;

      const localSyncedAt = localStorage.getItem('hoda_cloud_synced_at');
      const myId = getDeviceId();

      // If we pushed this update ourselves and not forcing, ignore
      if (!force && meta.deviceId === myId && localSyncedAt === meta.lastUpdated) {
        setStatus('synced');
        return false;
      }

      // If local is already up to date and not forcing
      if (!force && localSyncedAt && new Date(localSyncedAt).getTime() >= new Date(meta.lastUpdated).getTime()) {
        setStatus('synced');
        return false;
      }

      setStatus('syncing');
      isPullingFromCloud = true;

      const shouldPullAll = force || !localSyncedAt || meta.updatedKey === 'all' || !meta.updatedKey;

      if (shouldPullAll) {
        // Pull all collections in parallel
        const collections = ['schools', 'news', 'achievements', 'documents', 'members', 'settings', 'teachers', 'facilities'];
        const results = await Promise.allSettled(
          collections.map(async (col) => {
            const data = await fetchBin(col);
            return { col, data };
          })
        );

        results.forEach(res => {
          if (res.status === 'fulfilled' && res.value && res.value.data) {
            const { col, data } = res.value;
            const storageKey = BIN_TO_KEY[col];
            if (storageKey) {
              try {
                localStorage.setItem(storageKey, JSON.stringify(data));
                window.dispatchEvent(new CustomEvent('hoda_data_changed', {
                  detail: { key: storageKey, val: data, source: 'cloud' }
                }));
              } catch (e) {
                console.warn('[CloudSync] LocalStorage write error for', storageKey, e);
              }
            }
          }
        });
      } else {
        // Pull only the single modified collection
        const col = meta.updatedKey;
        const storageKey = BIN_TO_KEY[col];
        if (col && storageKey) {
          const data = await fetchBin(col);
          if (data !== undefined && data !== null) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(data));
              window.dispatchEvent(new CustomEvent('hoda_data_changed', {
                detail: { key: storageKey, val: data, source: 'cloud' }
              }));
            } catch (e) {
              console.warn('[CloudSync] LocalStorage write error for', storageKey, e);
            }
          }
        }
      }

      localStorage.setItem('hoda_cloud_synced_at', meta.lastUpdated);
      isPullingFromCloud = false;
      setStatus('synced');
      return true;
    } catch (err) {
      isPullingFromCloud = false;
      console.warn('[CloudSync] Pull error:', err);
      setStatus('error', err.message || 'خطا در دریافت اطلاعات از سرور ابری');
      return false;
    }
  })();
}

/**
 * Push all local data to cloud immediately (Full Cloud Seed/Sync)
 */
export async function pushAllToCloud() {
  if (typeof window === 'undefined') return false;
  if (!navigator.onLine) {
    setStatus('offline');
    throw new Error('اتصال اینترنت برقرار نیست.');
  }

  setStatus('syncing');
  try {
    const collections = ['schools', 'news', 'achievements', 'documents', 'members', 'settings', 'teachers', 'facilities'];
    
    for (const col of collections) {
      const storageKey = BIN_TO_KEY[col];
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          await updateBin(col, parsed);
        } catch {}
      }
    }

    const nowIso = new Date().toISOString();
    const meta = {
      version: Date.now(),
      lastUpdated: nowIso,
      updatedKey: 'all',
      deviceId: getDeviceId(),
    };
    await updateBin('meta', meta);
    localStorage.setItem('hoda_cloud_synced_at', nowIso);
    setStatus('synced');
    return true;
  } catch (err) {
    setStatus('error', err.message);
    throw err;
  }
}

/**
 * Initializes automatic background synchronization
 * Should be called once on application mount (e.g. in App.jsx)
 */
export function initAutoCloudSync() {
  if (typeof window === 'undefined' || isInitialized) return () => {};
  isInitialized = true;

  // 1. Initial smart sync check
  setTimeout(async () => {
    try {
      const meta = await fetchBin('meta').catch(() => null);
      const isSuperAdmin = !!localStorage.getItem('hoda_admin_token') || !!localStorage.getItem('hoda_admin_session');
      
      // If admin on PC has local data and cloud is still on initial baseline: push PC data!
      if (isSuperAdmin && meta && (meta.device === 'initial-seed' || !meta.device)) {
        await pushAllToCloud();
        return;
      }
      
      await pullFromCloud(false);
    } catch {
      pullFromCloud(false);
    }
  }, 300);

  // 2. Poll metadata periodically (every 18 seconds)
  const intervalId = setInterval(() => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      pullFromCloud(false);
    }
  }, 18000);

  // 3. Auto-pull when user switches back to this browser tab/window
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      pullFromCloud(false);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 4. Auto-sync when device comes back online
  const handleOnline = () => {
    setStatus('syncing');
    pullFromCloud(false);
  };
  const handleOffline = () => {
    setStatus('offline');
  };
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
