import { EmergencyIncident } from '../types';

const DB_NAME = 'routeresq_offline_db';
const DB_VERSION = 1;
const STORE_OFFLINE_SOS = 'offline_sos_queue';
const STORE_CACHED_INCIDENTS = 'cached_incidents';
const STORE_OFFLINE_MAPS = 'offline_map_packs';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_OFFLINE_SOS)) {
        const sosStore = db.createObjectStore(STORE_OFFLINE_SOS, { keyPath: 'id' });
        sosStore.createIndex('synced', 'synced', { unique: false });
        sosStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_CACHED_INCIDENTS)) {
        db.createObjectStore(STORE_CACHED_INCIDENTS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_OFFLINE_MAPS)) {
        db.createObjectStore(STORE_OFFLINE_MAPS, { keyPath: 'regionId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineSOS(incident: EmergencyIncident): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_OFFLINE_SOS, STORE_CACHED_INCIDENTS], 'readwrite');
    const sosStore = tx.objectStore(STORE_OFFLINE_SOS);
    const cacheStore = tx.objectStore(STORE_CACHED_INCIDENTS);

    // Save with explicit offline flag
    const record = {
      ...incident,
      isOfflineCreated: true,
      synced: false,
      status: 'saved_locally' as const,
    };

    sosStore.put(record);
    cacheStore.put(record);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingOfflineSOS(): Promise<EmergencyIncident[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_SOS, 'readonly');
      const store = tx.objectStore(STORE_OFFLINE_SOS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as EmergencyIncident[]) || [];
        resolve(results.filter((i) => !i.synced));
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function markOfflineSOSSynced(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_OFFLINE_SOS, STORE_CACHED_INCIDENTS], 'readwrite');
    const store = tx.objectStore(STORE_OFFLINE_SOS);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result as EmergencyIncident | undefined;
      if (item) {
        item.synced = true;
        item.status = 'received';
        store.put(item);
        tx.objectStore(STORE_CACHED_INCIDENTS).put(item);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteOfflineSOS(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OFFLINE_SOS, 'readwrite');
    tx.objectStore(STORE_OFFLINE_SOS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export interface OfflineMapPack {
  regionId: string;
  name: string;
  downloadedAt: number;
  sizeMb: number;
  coordinates: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  emergencyFacilitiesCount: number;
  roadSegmentsCount: number;
}

export async function saveOfflineMapPack(pack: OfflineMapPack): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OFFLINE_MAPS, 'readwrite');
    tx.objectStore(STORE_OFFLINE_MAPS).put(pack);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineMapPacks(): Promise<OfflineMapPack[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_MAPS, 'readonly');
      const req = tx.objectStore(STORE_OFFLINE_MAPS).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}
